use arboard::Clipboard;
use tauri::Manager;

// 获取剪贴板内容
pub fn get_clipboard_content() -> Result<String, Box<dyn std::error::Error>> {
    let mut clipboard = Clipboard::new()?;
    let content = clipboard.get_text()?;
    Ok(content)
}

// 设置剪贴板内容
pub fn set_clipboard_content(content: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut clipboard = Clipboard::new()?;
    clipboard.set_text(content.to_string())?;
    Ok(())
}

// 监控剪贴板变化
pub fn start_clipboard_monitor<F>(callback: F) -> Result<(), Box<dyn std::error::Error>>
where
    F: Fn(String) + Send + 'static,
{
    // 这里可以实现剪贴板监控逻辑
    // 为了简化，我们暂时返回Ok
    Ok(())
}