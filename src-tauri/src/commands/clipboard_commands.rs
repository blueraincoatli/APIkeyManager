use tauri::Manager;
use crate::clipboard;

// 获取剪贴板内容
#[tauri::command]
pub fn get_clipboard_content() -> Result<String, String> {
    match clipboard::get_clipboard_content() {
        Ok(content) => Ok(content),
        Err(e) => Err(e.to_string()),
    }
}

// 复制内容到剪贴板
#[tauri::command]
pub fn copy_to_clipboard(content: String) -> Result<bool, String> {
    match clipboard::set_clipboard_content(&content) {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    }
}