use tauri::Manager;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WindowPosition {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WindowSize {
    pub width: f64,
    pub height: f64,
}

// 显示浮动工具条窗口
#[tauri::command]
pub async fn show_floating_toolbar(app: tauri::AppHandle) -> Result<(), String> {
    // 获取浮动工具条窗口
    if let Some(window) = app.get_webview_window("floating-toolbar") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

// 隐藏浮动工具条窗口
#[tauri::command]
pub async fn hide_floating_toolbar(app: tauri::AppHandle) -> Result<(), String> {
    // 获取浮动工具条窗口
    if let Some(window) = app.get_webview_window("floating-toolbar") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

// 退出应用程序
#[tauri::command]
pub async fn exit_application(app: tauri::AppHandle) -> Result<(), String> {
    println!("Exit application command called");
    app.exit(0);
    Ok(())
}

// 设置窗口位置
#[tauri::command]
pub async fn set_window_position(
    app: tauri::AppHandle,
    window_label: &str,
    position: WindowPosition,
) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(window_label) {
        window
            .set_position(tauri::Position::Logical(tauri::LogicalPosition::new(
                position.x, position.y,
            )))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

// 设置窗口大小
#[tauri::command]
pub async fn set_window_size(
    app: tauri::AppHandle,
    window_label: &str,
    size: WindowSize,
) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(window_label) {
        window
            .set_size(tauri::Size::Logical(tauri::LogicalSize::new(
                size.width, size.height,
            )))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

// 设置窗口点击穿透模式 - 使用Tauri内置API
#[tauri::command]
pub async fn set_click_through(
    app: tauri::AppHandle,
    window_label: &str,
    enabled: bool,
) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(window_label) {
        window
            .set_ignore_cursor_events(enabled)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}