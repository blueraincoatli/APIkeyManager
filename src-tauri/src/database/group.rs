use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqlitePool};
use crate::database::error::DatabaseError;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Group {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: i64,
    #[serde(rename = "updatedAt")]
    pub updated_at: i64,
}

impl Group {
    // Create a new group
    #[allow(dead_code)]
    pub fn new(
        id: String,
        name: String,
        description: Option<String>,
    ) -> Self {
        let now = Utc::now().timestamp();
        Self {
            id,
            name,
            description,
            created_at: now,
            updated_at: now,
        }
    }
}

// Insert a new group
pub async fn insert_group(pool: &SqlitePool, group: &Group) -> Result<(), DatabaseError> {
    sqlx::query(
        r#"
        INSERT INTO groups (
            id, name, description, created_at, updated_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5)
        "#
    )
    .bind(&group.id)
    .bind(&group.name)
    .bind(&group.description)
    .bind(group.created_at)
    .bind(group.updated_at)
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(|e| DatabaseError::SqlxError(e.to_string()))
}

// Get all groups
pub async fn get_all_groups(pool: &SqlitePool) -> Result<Vec<Group>, DatabaseError> {
    sqlx::query_as::<_, Group>(
        r#"
        SELECT id, name, description, created_at, updated_at
        FROM groups
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await
    .map_err(|e| DatabaseError::SqlxError(e.to_string()))
}