use crate::clipboard;



// 复制内容到剪贴板
#[tauri::command]
pub fn copy_to_clipboard(content: String) -> Result<bool, String> {
    match clipboard::set_clipboard_content(&content) {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    }
}