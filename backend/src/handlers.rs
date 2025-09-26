
use actix_multipart::Multipart;
use actix_web::{web, HttpResponse, Responder};
use futures_util::TryStreamExt as _;
use std::io::Write;
use std::fs::File;
use uuid::Uuid;
use chrono::Utc;
use diesel::prelude::*;
use serde_json::Value;
use crate::db::DbPool;
use crate::models::{NewResume};
use serde::{Deserialize, Serialize};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/resume/upload").route(web::post().to(upload_resume)));
    cfg.service(web::resource("/jobs/import").route(web::post().to(import_job)));
    cfg.service(web::resource("/apply").route(web::post().to(trigger_apply)));
}

async fn upload_resume(pool: web::Data<DbPool>, mut payload: Multipart) -> impl Responder {
    // Save uploaded file to /tmp and send to NLP service
    let mut filename = None;
    let mut filepath = None;
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();

        if let Some(name) = content_disposition.get_name() {
            if name == "file" || name == "resume" {
                let cd_filename = content_disposition.get_filename().map(|s| s.to_string())
                    .unwrap_or_else(|| format!("resume-{}.pdf", Uuid::new_v4()));
                let tmp_path = format!("/tmp/{}", cd_filename);
                let mut f = File::create(&tmp_path).unwrap();
                while let Ok(Some(bytes)) = field.try_next().await {
                    let _ = f.write_all(&bytes);
                }
                filename = Some(cd_filename.clone());
                filepath = Some(tmp_path);
            }
        }
    }

    let filepath = match filepath {
        Some(p) => p,
        None => return HttpResponse::BadRequest().json(serde_json::json!({"error":"no file uploaded"})),
    };

    // call NLP service
    let nlp_url = std::env::var("NLP_SERVICE_URL").unwrap_or("http://nlp-service:8001/parse".to_string());
    let client = reqwest::Client::new();
    let form = reqwest::multipart::Form::new().file("file", &filepath);

    let resp = match form {
        Ok(form) => client.post(&nlp_url).multipart(form).send().await,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({"error":format!("failed forming multipart: {}", e)})),
    };

    let parsed_json: Value = match resp {
        Ok(r) => {
            if !r.status().is_success() {
                return HttpResponse::BadGateway().json(serde_json::json!({"error":"nlp service returned error"}));
            }
            match r.json().await {
                Ok(j) => j,
                Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({"error":format!("invalid json from nlp: {}", e)})),
            }
        }
        Err(e) => return HttpResponse::BadGateway().json(serde_json::json!({"error":format!("nlp request failed: {}", e)})),
    };

    // insert into DB using Diesel
    let new_id = Uuid::new_v4();
    let now = Utc::now();
    let new_resume = NewResume {
        id: new_id,
        user_id: None,
        uploaded_at: now,
        text: parsed_json.get("text").and_then(|t| t.as_str().map(|s| s.to_string())),
        parsed: Some(parsed_json.clone()),
        filename: filename.clone(),
    };

    let pool = pool.clone();
    let insert_res = web::block(move || {
        let conn = pool.get().map_err(|e| format!("pool error: {}", e))?;
        diesel::insert_into(crate::schema::resumes::table)
            .values(&new_resume)
            .execute(&conn)
            .map_err(|e| format!("insert error: {}", e))?;
        Ok::<_, String>(())
    }).await;

    match insert_res {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({"status":"uploaded","resume_id": new_id})),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error":format!("db insert failed: {}", e)})),
    }
}

async fn import_job() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({"status":"imported"}))
}

#[derive(Deserialize, Serialize)]
struct ApplyRequest {
    job_id: uuid::Uuid,
    resume_id: uuid::Uuid,
    auto_approve: bool,
}

async fn trigger_apply(redis_client: web::Data<redis::Client>, req: web::Json<ApplyRequest>) -> impl Responder {
    // enqueue into Redis list 'job_apply_queue'
    let payload = serde_json::to_string(&*req).unwrap();
    let client = redis_client.clone();
    // perform async push
    let res: Result<(), String> = async {
        let mut conn = client.get_async_connection().await.map_err(|e| format!(\"redis conn: {}\", e))?;
        redis::cmd(\"RPUSH\").arg(\"job_apply_queue\").arg(payload).query_async(&mut conn).await.map_err(|e| format!(\"rpush err: {}\", e))?;
        Ok(())
    }.await;
    match res {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({"status":"queued"})),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error":e})),
    }
}
