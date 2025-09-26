
use actix_web::{web, App, HttpServer};
mod handlers;
mod db;
mod models;
mod schema;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let db_pool = db::init_db();

    // init redis client
    let redis_url = std::env::var("REDIS_URL").unwrap_or("redis://127.0.0.1/".to_string());
    let redis_client = redis::Client::open(redis_url.as_str()).expect("failed to create redis client");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(redis_client.clone()))
            .configure(handlers::init)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
