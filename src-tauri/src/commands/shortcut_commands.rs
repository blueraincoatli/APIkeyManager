use tauri::{Manager, GlobalShortcutManager};
use tauri::api::dialog::message;

// 注册全局快捷键
#[tauri::command]
pub fn register_shortcut(app_handle: tauri::AppHandle, shortcut: String) -> Result<bool, String> {
    let mut shortcut_manager = app_handle.global_shortcut_manager();
    
    match shortcut_manager.register(&shortcut, move || {
        // 当快捷键被触发时显示搜索工具条
        // 这里需要与前端通信来显示工具条
        println!("快捷键 {} 被触发", shortcut);
    }) {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    }
}