use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, thiserror::Error)]
pub enum DatabaseError {
    #[error("SQLx error: {0}")]
    SqlxError(String),
    #[error("Key not found")]
    KeyNotFound,
    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

impl From<sqlx::Error> for DatabaseError {
    fn from(error: sqlx::Error) -> Self {
        DatabaseError::SqlxError(error.to_string())
    }
}