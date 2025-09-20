use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[allow(dead_code)]
pub struct BatchImport {
    pub id: String,
    pub source: String,
    pub total_count: i32,
    pub success_count: i32,
    pub failed_count: i32,
    pub created_at: i64,
    pub details: Option<String>,
}
// This file was removed because the BatchImport struct was defined but never used.
// The struct caused a compiler warning "struct `BatchImport` is never constructed"
