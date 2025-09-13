// 注册全局快捷键
#[tauri::command]
pub fn register_shortcut() -> Result<bool, String> {
    // 在Tauri 2.0中，全局快捷键需要在setup中注册
    // 这里暂时返回成功
    Ok(true)
}