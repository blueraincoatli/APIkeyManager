// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod clipboard;
mod commands;
mod database;
mod security;

use commands::{
    api_key_commands::*,
    batch_import_commands::*,
    clipboard_commands::*,
    group_commands::*,
    security_commands::*,
    window_commands::*,
};
use database::init_database;
use sqlx::SqlitePool;
use tauri::{Manager, State};



// 应用状态
pub struct AppState {
    pub db: SqlitePool,
}

// 启动 greet 命令用于测试
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 测试数据库连接
#[tauri::command]
async fn test_database(state: State<'_, AppState>) -> Result<String, String> {
    let pool = &state.db;
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM api_keys")
        .fetch_one(pool)
        .await
        .map_err(|e| e.to_string())?;
    Ok(format!("Database connected! Found {} API keys", count))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_shortcuts(["Ctrl+Shift+K"])
                .unwrap()
                .with_handler(|app, _shortcut, event| {
                    if event.state == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                        if let Some(window) = app.get_webview_window("main") {
                            match window.is_visible() {
                                Ok(true) => {
                                    // 窗口可见，隐藏它
                                    if let Err(e) = window.hide() {
                                        eprintln!("Failed to hide window: {}", e);
                                    }
                                }
                                Ok(false) => {
                                    // 窗口隐藏，显示并置于前台
                                    if let Err(e) = window.show() {
                                        eprintln!("Failed to show window: {}", e);
                                    }
                                    if let Err(e) = window.set_focus() {
                                        eprintln!("Failed to focus window: {}", e);
                                    }
                                }
                                Err(e) => {
                                    eprintln!("Failed to check window visibility: {}", e);
                                }
                            }
                        }
                    }
                })
                .build()
        )
        .setup(|app| {
            // 初始化数据库
            let handle = app.handle().clone();

            // 确保主窗口可见并设置为浮动工具条
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();

                // 初始状态不启用点击穿透，确保工具条可以正常交互
                // 点击穿透将由前端根据鼠标位置动态控制
                let _ = window.set_ignore_cursor_events(false);

                // 保持窗口完全透明，不应用任何系统级blur效果
                // 磨砂玻璃效果将完全通过CSS实现，避免影响窗口透明度
                println!("Floating toolbar window initialized with full transparency");
            }
            
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                match init_database(&app_handle).await {
                    Ok(pool) => {
                        app_handle.manage(AppState { db: pool });
                        println!("Database initialized and managed successfully");
                    }
                    Err(e) => {
                        eprintln!("数据库初始化失败: {}", e);
                    }
                }
            });

            // 全局快捷键已在插件初始化时注册
            println!("Global shortcut Ctrl+Shift+K registered in plugin initialization");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            test_database,
            add_api_key,
            edit_api_key,
            delete_api_key,
            list_api_keys,
            search_api_keys,
            get_all_platforms,
            import_api_keys_batch,
            copy_to_clipboard,
            set_master_password,
            verify_master_password,
            encrypt_key,
            decrypt_key,
            show_floating_toolbar,
            hide_floating_toolbar,
            exit_application,
            set_window_position,
            set_window_size,
            set_click_through,
            add_group,
            list_groups,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}