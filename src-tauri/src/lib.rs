// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod database;
mod security;
mod clipboard;
mod llm;
mod commands;

use database::{init_database, error::DatabaseError};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tauri::Manager;
use std::sync::Arc;

// 应用状态
pub struct AppState {
    pub db: SqlitePool,
}

// 启动 greet 命令用于测试
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // 初始化数据库
            let handle = app.handle().clone();
            
            tauri::async_runtime::spawn(async move {
                match init_database(&handle).await {
                    Ok(pool) => {
                        // 存储数据库连接池到应用状态
                        handle.manage(AppState { db: pool });
                        
                        // 注册全局快捷键
                        if let Err(e) = handle.global_shortcut_manager().register("Ctrl+Shift+K", move || {
                            // 这里需要与前端通信来显示搜索工具条
                            println!("快捷键 Ctrl+Shift+K 被触发");
                        }) {
                            eprintln!("注册全局快捷键失败: {}", e);
                        }
                    }
                    Err(e) => {
                        eprintln!("数据库初始化失败: {}", e);
                    }
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::api_key_commands::add_api_key,
            commands::api_key_commands::edit_api_key,
            commands::api_key_commands::delete_api_key,
            commands::api_key_commands::list_api_keys,
            commands::api_key_commands::search_api_keys,
            commands::clipboard_commands::get_clipboard_content,
            commands::clipboard_commands::copy_to_clipboard,
            commands::security_commands::set_master_password,
            commands::security_commands::verify_master_password,
            commands::security_commands::encrypt_key,
            commands::security_commands::decrypt_key,
            commands::shortcut_commands::register_shortcut,
            commands::llm_commands::analyze_clipboard_text,
            commands::llm_commands::import_analyzed_keys,
            commands::llm_commands::check_ollama_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}