
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Insertable};
use crate::schema::resumes;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use serde_json::Value;

#[derive(Debug, Queryable, Serialize)]
pub struct Resume {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub uploaded_at: DateTime<Utc>,
    pub text: Option<String>,
    pub parsed: Option<Value>,
    pub filename: Option<String>,
}

#[derive(Debug, Insertable, Deserialize)]
#[table_name="resumes"]
pub struct NewResume {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub uploaded_at: DateTime<Utc>,
    pub text: Option<String>,
    pub parsed: Option<Value>,
    pub filename: Option<String>,
}
