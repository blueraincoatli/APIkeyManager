#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::SqlitePool;
    use crate::database::api_key::ApiKey;

    #[tokio::test]
    async fn test_add_api_key() {
        // 创建测试数据库连接池
        let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
        
        // 创建测试API Key
        let api_key = ApiKey::new(
            "Test Key".to_string(),
            "test-key-value".to_string(),
            Some("test-platform".to_string()),
            Some("Test description".to_string()),
            None,
            None,
        );
        
        // 插入API Key
        let result = insert_api_key(&pool, &api_key).await;
        
        // 验证结果
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_get_all_api_keys() {
        // 创建测试数据库连接池
        let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
        
        // 获取所有API Keys
        let keys = get_all_api_keys(&pool).await.unwrap();
        
        // 验证结果
        assert_eq!(keys.len(), 0);
    }
}