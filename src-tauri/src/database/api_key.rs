use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::SqlitePool;
use crate::database::error::DatabaseError;

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
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
    #[allow(dead_code)]
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
    sqlx::query(
        r#"
        INSERT INTO api_keys (
            id, name, key_value, platform, description, group_id, tags, created_at, updated_at, last_used_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
        "#
    )
    .bind(&api_key.id)
    .bind(&api_key.name)
    .bind(&api_key.key_value)
    .bind(&api_key.platform)
    .bind(&api_key.description)
    .bind(&api_key.group_id)
    .bind(&api_key.tags)
    .bind(api_key.created_at)
    .bind(api_key.updated_at)
    .bind(api_key.last_used_at)
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(|e| DatabaseError::SqlxError(e.to_string()))
}

// 更新API Key
pub async fn update_api_key(pool: &SqlitePool, api_key: &ApiKey) -> Result<(), DatabaseError> {
    sqlx::query(
        r#"
        UPDATE api_keys
        SET name = ?1, key_value = ?2, platform = ?3, description = ?4, group_id = ?5, tags = ?6, updated_at = ?7, last_used_at = ?8
        WHERE id = ?9
        "#
    )
    .bind(&api_key.name)
    .bind(&api_key.key_value)
    .bind(&api_key.platform)
    .bind(&api_key.description)
    .bind(&api_key.group_id)
    .bind(&api_key.tags)
    .bind(api_key.updated_at)
    .bind(api_key.last_used_at)
    .bind(&api_key.id)
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(|e| DatabaseError::SqlxError(e.to_string()))
}

// 删除API Key
pub async fn delete_api_key(pool: &SqlitePool, id: &str) -> Result<(), DatabaseError> {
    sqlx::query("DELETE FROM api_keys WHERE id = ?1")
        .bind(id)
        .execute(pool)
        .await
        .map(|_| ())
        .map_err(|e| DatabaseError::SqlxError(e.to_string()))
}

// 获取所有API Keys
pub async fn get_all_api_keys(pool: &SqlitePool) -> Result<Vec<ApiKey>, DatabaseError> {
    let keys = sqlx::query_as::<_, ApiKey>("SELECT * FROM api_keys")
        .fetch_all(pool)
        .await
        .map_err(|e| DatabaseError::SqlxError(e.to_string()))?;
    
    Ok(keys)
}

// 根据ID获取API Key
#[allow(dead_code)]
pub async fn get_api_key_by_id(pool: &SqlitePool, id: &str) -> Result<Option<ApiKey>, DatabaseError> {
    let key = sqlx::query_as::<_, ApiKey>("SELECT * FROM api_keys WHERE id = ?1")
        .bind(id)
        .fetch_optional(pool)
        .await
        .map_err(|e| DatabaseError::SqlxError(e.to_string()))?;
    
    Ok(key)
}

// 搜索API Keys
pub async fn search_api_keys(pool: &SqlitePool, keyword: &str) -> Result<Vec<ApiKey>, DatabaseError> {
    let search_term = format!("%{}%", keyword);
    let keys = sqlx::query_as::<_, ApiKey>(
        r#"
        SELECT * FROM api_keys 
        WHERE name LIKE ?1 OR platform LIKE ?2 OR description LIKE ?3
        "#
    )
    .bind(&search_term)
    .bind(&search_term)
    .bind(&search_term)
    .fetch_all(pool)
    .await
    .map_err(|e| DatabaseError::SqlxError(e.to_string()))?;
    
    Ok(keys)
}