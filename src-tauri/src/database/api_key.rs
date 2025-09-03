use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use crate::database::DatabaseError;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiKey {
    pub id: String,
    pub name: String,
    pub key_value: String,
    pub platform: Option<String>,
    pub description: Option<String>,
    pub group_id: Option<String>,
    pub tags: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
    pub last_used_at: Option<i64>,
}

impl ApiKey {
    // 创建新的API Key
    pub fn new(
        name: String,
        key_value: String,
        platform: Option<String>,
        description: Option<String>,
        group_id: Option<String>,
        tags: Option<String>,
    ) -> Self {
        let now = chrono::Utc::now().timestamp();
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            name,
            key_value,
            platform,
            description,
            group_id,
            tags,
            created_at: now,
            updated_at: now,
            last_used_at: None,
        }
    }
}

// 插入API Key
pub async fn insert_api_key(pool: &SqlitePool, api_key: &ApiKey) -> Result<(), DatabaseError> {
    sqlx::query!(
        r#"
        INSERT INTO api_keys (
            id, name, key_value, platform, description, group_id, tags, created_at, updated_at, last_used_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
        api_key.id,
        api_key.name,
        api_key.key_value,
        api_key.platform,
        api_key.description,
        api_key.group_id,
        api_key.tags,
        api_key.created_at,
        api_key.updated_at,
        api_key.last_used_at
    )
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(|e| DatabaseError::SqlxError(e))
}

// 更新API Key
pub async fn update_api_key(pool: &SqlitePool, api_key: &ApiKey) -> Result<(), DatabaseError> {
    sqlx::query!(
        r#"
        UPDATE api_keys
        SET name = ?, key_value = ?, platform = ?, description = ?, group_id = ?, tags = ?, updated_at = ?, last_used_at = ?
        WHERE id = ?
        "#,
        api_key.name,
        api_key.key_value,
        api_key.platform,
        api_key.description,
        api_key.group_id,
        api_key.tags,
        api_key.updated_at,
        api_key.last_used_at,
        api_key.id
    )
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(|e| DatabaseError::SqlxError(e))
}

// 删除API Key
pub async fn delete_api_key(pool: &SqlitePool, id: &str) -> Result<(), DatabaseError> {
    sqlx::query!("DELETE FROM api_keys WHERE id = ?", id)
        .execute(pool)
        .await
        .map(|_| ())
        .map_err(|e| DatabaseError::SqlxError(e))
}

// 获取所有API Keys
pub async fn get_all_api_keys(pool: &SqlitePool) -> Result<Vec<ApiKey>, DatabaseError> {
    let keys = sqlx::query_as!(ApiKey, "SELECT * FROM api_keys")
        .fetch_all(pool)
        .await
        .map_err(|e| DatabaseError::SqlxError(e))?;
    
    Ok(keys)
}

// 根据ID获取API Key
pub async fn get_api_key_by_id(pool: &SqlitePool, id: &str) -> Result<Option<ApiKey>, DatabaseError> {
    let key = sqlx::query_as!(ApiKey, "SELECT * FROM api_keys WHERE id = ?", id)
        .fetch_optional(pool)
        .await
        .map_err(|e| DatabaseError::SqlxError(e))?;
    
    Ok(key)
}

// 搜索API Keys
pub async fn search_api_keys(pool: &SqlitePool, keyword: &str) -> Result<Vec<ApiKey>, DatabaseError> {
    let search_term = format!("%{}%", keyword);
    let keys = sqlx::query_as!(
        ApiKey,
        r#"
        SELECT * FROM api_keys 
        WHERE name LIKE ? OR platform LIKE ? OR description LIKE ?
        "#,
        search_term,
        search_term,
        search_term
    )
    .fetch_all(pool)
    .await
    .map_err(|e| DatabaseError::SqlxError(e))?;
    
    Ok(keys)
}