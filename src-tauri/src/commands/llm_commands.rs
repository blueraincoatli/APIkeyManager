use crate::llm;

// 分析剪贴板文本
#[tauri::command]
pub async fn analyze_clipboard_text(text: String) -> Result<Vec<llm::AnalyzedKey>, String> {
    match llm::analyze_text(&text).await {
        Ok(keys) => Ok(keys),
        Err(e) => Err(e.to_string()),
    }
}

// 导入分析的API Key
#[tauri::command]
pub async fn import_analyzed_keys(_keys: Vec<llm::AnalyzedKey>) -> Result<bool, String> {
    // 这里应该将分析的API Key导入到数据库
    // 为了简化，我们暂时只返回成功
    Ok(true)
}

// 检查Ollama服务状态
#[tauri::command]
pub async fn check_ollama_status() -> Result<bool, String> {
    match llm::check_ollama_status().await {
        Ok(status) => Ok(status),
        Err(e) => Err(e.to_string()),
    }
}