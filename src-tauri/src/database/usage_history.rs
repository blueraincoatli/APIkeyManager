use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UsageHistory {
    pub id: String,
    pub key_id: String,
    pub used_at: i64,
}