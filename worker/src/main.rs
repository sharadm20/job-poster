
use redis::AsyncCommands;
use serde::Deserialize;
use std::process::Stdio;
use tokio::process::Command;
use uuid::Uuid;
use anyhow::Result;
use tokio_postgres::NoTls;
use chrono::Utc;

#[derive(Deserialize, Debug)]
struct Job {
    job_id: Uuid,
    resume_id: Uuid,
    auto_approve: bool,
}

#[derive(Deserialize, Debug)]
struct PlayResult {
    status: String,
    screenshot: Option<String>,
    error: Option<String>,
}

#[tokio::main]
async fn main() -> Result<()> {
    let redis_url = std::env::var(\"REDIS_URL\").unwrap_or(\"redis://127.0.0.1/\".to_string());
    let pg_url = std::env::var(\"DATABASE_URL\").unwrap_or(\"postgres://postgres:postgres@db:5432/ai_job\".to_string());

    let client = redis::Client::open(redis_url.as_str())?;
    let mut conn = client.get_async_connection().await?;

    println!(\"Worker listening for jobs...\");\n
    loop {
        let res: Option<(String, String)> = conn.blpop(\"job_apply_queue\", 0).await?;
        if let Some((_queue, payload)) = res {
            let job: Job = serde_json::from_str(&payload)?;
            println!(\"Processing job: {:?}\", job);

            let mut cmd = Command::new(\"npx\");
            cmd.arg(\"ts-node\")
                .arg(\"automation-worker/src/apply.ts\")
                .env(\"TARGET_URL\", std::env::var(\"TARGET_URL\").unwrap_or_default())
                .env(\"FIRST_NAME\", std::env::var(\"FIRST_NAME\").unwrap_or_default())
                .env(\"LAST_NAME\", std::env::var(\"LAST_NAME\").unwrap_or_default())
                .env(\"EMAIL\", std::env::var(\"EMAIL\").unwrap_or_default())
                .env(\"RESUME_PATH\", std::env::var(\"RESUME_PATH\").unwrap_or_default())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped());

            let mut child = cmd.spawn()?;
            let output = child.wait_with_output().await?;
            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

            let play_res: PlayResult = if !stdout.is_empty() {
                match serde_json::from_str(&stdout) {
                    Ok(r) => r,
                    Err(_) => PlayResult { status: \"unknown\".to_string(), screenshot: None, error: Some(stdout.clone()) }
                }
            } else if !stderr.is_empty() {
                match serde_json::from_str(&stderr) {
                    Ok(r) => r,
                    Err(_) => PlayResult { status: \"failed\".to_string(), screenshot: None, error: Some(stderr.clone()) }
                }
            } else {
                PlayResult { status: \"failed\".to_string(), screenshot: None, error: Some(\"no output\".to_string()) }
            };

            println!(\"Play result: {:?}\", play_res);

            let (client, connection) = tokio_postgres::connect(&pg_url, NoTls).await?;
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!(\"Postgres connection error: {}\", e);
                }
            });

            let app_id = Uuid::new_v4();
            let now = Utc::now();
            let meta = serde_json::json!({
                "play_result": play_res,
                "worker_ts": now,
            });

            let insert_stmt = \"INSERT INTO applications (id, job_id, resume_id, status, meta, created_at) VALUES ($1, $2, $3, $4, $5::jsonb, $6)\";
            let status_str = play_res.status.clone();
            let meta_text = serde_json::to_string(&meta)?;
            client.execute(insert_stmt, &[&app_id, &job.job_id, &job.resume_id, &status_str, &meta_text, &now]).await?;

            println!(\"Inserted application result {}\", app_id);
        }
    }
}
