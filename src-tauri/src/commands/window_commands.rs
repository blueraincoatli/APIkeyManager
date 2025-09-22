use tauri::{Manager, WebviewWindowBuilder, WebviewUrl, Emitter};
use serde::{Deserialize, Serialize};
use std::time::Duration;

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

// 创建批量导入预览窗口
#[tauri::command]
pub async fn create_preview_window(
    app: tauri::AppHandle,
    preview_data: String,
    theme: Option<String>,
    language: Option<String>,
) -> Result<(), String> {
    // 检查预览窗口是否已存在
    if let Some(existing_window) = app.get_webview_window("preview") {
        // 如果存在，先关闭它
        existing_window.close().map_err(|e| e.to_string())?;
    }

    // 创建新的预览窗口
    let window = WebviewWindowBuilder::new(
        &app,
        "preview",
        WebviewUrl::App("preview.html".into())
    )
    .title("数据预览")
    .inner_size(800.0, 600.0)
    .min_inner_size(600.0, 400.0)
    .center()
    .decorations(false)
    .resizable(true)
    .visible(false) // 先隐藏，等数据传递完成后再显示
    // 将数据、主题与调用桥自动注入到预览窗口，避免依赖前端 Tauri API 的可用性
    .initialization_script(&format!(
        r#"
        // 预置数据供页面直接渲染
        try {{
          window.__PREVIEW_DATA__ = JSON.parse({data_json});
        }} catch (e) {{
          console.error('Failed to parse injected preview data:', e);
          window.__PREVIEW_DATA__ = [];
        }}

        // 应用主题（由主窗口传入，fallback 到系统）
        try {{
          window.__THEME__ = {theme_json};
          if (window.__THEME__ === 'dark') {{
            document.documentElement.classList.add('dark');
          }} else if (window.__THEME__ === 'light') {{
            document.documentElement.classList.remove('dark');
          }}
        }} catch (_) {{}}

        // 注入语言设置
        try {{
          window.__PREVIEW_LANGUAGE__ = {language_json};
        }} catch (_) {{}}

        // 提供一个统一的调用桥，兼容不同 Tauri 版本
        window.__TAURI_INVOKE__ = (cmd, args) => {{
          try {{
            if (window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke) {{
              return window.__TAURI__.core.invoke(cmd, args);
            }}
            if (window.__TAURI_INTERNALS__ && window.__TAURI_INTERNALS__.invoke) {{
              return window.__TAURI_INTERNALS__.invoke(cmd, args);
            }}
            return Promise.reject(new Error('Tauri invoke API not available'));
          }} catch (err) {{
            return Promise.reject(err);
          }}
        }};
        "#,
        data_json = serde_json::to_string(&preview_data).unwrap_or_else(|_| "[]".to_string()),
        theme_json = serde_json::to_string(&theme.unwrap_or_else(|| "system".to_string())).unwrap_or_else(|_| "\"system\"".to_string()),
        language_json = serde_json::to_string(&language.unwrap_or_else(|| "zh-CN".to_string())).unwrap_or_else(|_| "\"zh-CN\"".to_string())
    ))
    .build()
    .map_err(|e| e.to_string())?;

    // 确保预览窗口置顶
    if let Err(e) = window.set_always_on_top(true) {
        eprintln!("Failed to set always on top: {}", e);
    }

    // 兜底：在短暂延迟后发一次数据并显示窗口（主要路径）
    let window_clone = window.clone();
    let data_clone = preview_data.clone();

    tauri::async_runtime::spawn(async move {
        // 等待一小段时间确保窗口完全加载
        std::thread::sleep(Duration::from_millis(800));

        // 传递预览数据到窗口
        if let Err(e) = window_clone.emit("preview-data", &data_clone) {
            eprintln!("Failed to emit preview data: {}", e);
        }

        // 显示窗口
        if let Err(e) = window_clone.show() {
            eprintln!("Failed to show preview window: {}", e);
        }

        // 设置焦点并置顶
        if let Err(e) = window_clone.set_focus() {
            eprintln!("Failed to focus preview window: {}", e);
        }
        let _ = window_clone.set_always_on_top(true);
    });

    Ok(())
}

// 关闭预览窗口
#[tauri::command]
pub async fn close_preview_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("preview") {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

// 预览窗口确认导入：由预览窗口调用，后端转发事件给主窗口并关闭预览
#[tauri::command]
pub async fn confirm_import_preview(app: tauri::AppHandle, data: String) -> Result<(), String> {
    // 将事件广播给所有窗口，避免窗口 label 不一致导致接收不到
    if let Err(e) = app.emit("confirm-import", &data) {
        eprintln!("Failed to emit confirm-import: {}", e);
    }
    // 关闭预览窗口
    if let Some(window) = app.get_webview_window("preview") {
        let _ = window.close();
    }
    Ok(())
}
