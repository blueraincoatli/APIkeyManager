pub mod api_key;
pub mod error;
pub mod group;
pub mod usage_history;
pub mod settings;
pub mod batch_import;

use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};
use tauri::Manager;
use std::path::Path;

// 初始化数据库连接池
pub async fn init_database(app_handle: &tauri::AppHandle) -> Result<SqlitePool, Box<dyn std::error::Error>> {
    // 获取应用数据目录
    let app_dir = app_handle.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    println!("App data directory: {:?}", app_dir);
    
    // 创建数据库目录
    std::fs::create_dir_all(&app_dir)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    
    // 数据库文件路径
    let db_path = app_dir.join("api_keys.db");
    println!("Database file path: {:?}", db_path);
    
    // 检查目录是否创建成功
    if !Path::new(&app_dir).exists() {
        return Err(format!("App data directory was not created: {:?}", app_dir).into());
    }
    
    // 创建数据库连接池
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(
            sqlx::sqlite::SqliteConnectOptions::new()
                .filename(&db_path)
                .create_if_missing(true)
        )
        .await
        .map_err(|e| format!("Failed to create database connection pool: {}", e))?;
    
    println!("Database connection pool created successfully");
    
    // 运行数据库迁移
    run_migrations(&pool).await
        .map_err(|e| format!("Failed to run database migrations: {}", e))?;
    
    println!("Database migrations completed successfully");
    
    // 验证数据库文件是否存在
    if Path::new(&db_path).exists() {
        println!("Database file created successfully at: {:?}", db_path);
    } else {
        println!("Warning: Database file was not created at: {:?}", db_path);
    }
    
    Ok(pool)
}

// 运行数据库迁移
async fn run_migrations(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    // 创建API Key表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS api_keys (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            key_value TEXT NOT NULL,
            platform TEXT,
            description TEXT,
            group_id TEXT,
            tags TEXT,
            created_at INTEGER,
            updated_at INTEGER,
            last_used_at INTEGER
        )
        "#
    )
    .execute(pool)
    .await?;

    // 创建分组表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS groups (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            created_at INTEGER,
            updated_at INTEGER
        )
        "#
    )
    .execute(pool)
    .await?;

    // 创建使用历史记录表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS usage_history (
            id TEXT PRIMARY KEY,
            key_id TEXT NOT NULL,
            used_at INTEGER,
            FOREIGN KEY (key_id) REFERENCES api_keys(id)
        )
        "#
    )
    .execute(pool)
    .await?;

    // 创建配置表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
        "#
    )
    .execute(pool)
    .await?;

    // 创建批量导入记录表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS batch_imports (
            id TEXT PRIMARY KEY,
            source TEXT,
            total_count INTEGER,
            success_count INTEGER,
            failed_count INTEGER,
            created_at INTEGER,
            details TEXT
        )
        "#
    )
    .execute(pool)
    .await?;

    Ok(())
}