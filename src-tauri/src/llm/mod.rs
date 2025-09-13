use reqwest;
use serde::{Deserialize, Serialize};

// 分析结果结构
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AnalyzedKey {
    pub platform: String,
    pub key: String,
    pub name: Option<String>,
    pub group: Option<String>,
}

// 检查Ollama服务状态
pub async fn check_ollama_status() -> Result<bool, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let res = client
        .get("http://localhost:11434/api/tags")
        .send()
        .await;
    
    match res {
        Ok(response) => Ok(response.status().is_success()),
        Err(_) => Ok(false),
    }
}

// 分析文本中的API Key
pub async fn analyze_text(text: &str) -> Result<Vec<AnalyzedKey>, Box<dyn std::error::Error>> {
    // 首先检查Ollama服务是否可用
    let is_available = check_ollama_status().await?;
    
    if is_available {
        // 使用Ollama进行分析
        analyze_with_ollama(text).await
    } else {
        // 使用正则表达式进行基本分析
        analyze_with_regex(text)
    }
}

// 使用Ollama进行分析
async fn analyze_with_ollama(text: &str) -> Result<Vec<AnalyzedKey>, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    
    // 构造提示词
    let prompt = format!(
        "请分析以下文本，提取其中的API Key信息。对于每个API Key，请提供：
1. 平台名称（如gemini, deepseek等）
2. API Key值
3. 可能的描述或名称
4. 分组建议

文本内容：
{}

请以JSON格式返回结果：
[
  {{
    \"platform\": \"平台名称\",
    \"key\": \"API Key值\",
    \"name\": \"描述或名称\",
    \"group\": \"建议分组\"
  }}
]",
        text
    );
    
    // 构造请求
    let request_body = serde_json::json!({
        "model": "llama3",
        "prompt": prompt,
        "stream": false
    });
    
    let res = client
        .post("http://localhost:11434/api/generate")
        .json(&request_body)
        .send()
        .await?;
    
    if res.status().is_success() {
        let _response_text = res.text().await?;
        // 解析JSON响应
        // 这里简化处理，实际应该解析完整的响应
        Ok(vec![])
    } else {
        // 如果Ollama分析失败，回退到正则表达式
        analyze_with_regex(text)
    }
}

// 使用正则表达式进行基本分析
fn analyze_with_regex(text: &str) -> Result<Vec<AnalyzedKey>, Box<dyn std::error::Error>> {
    use regex::Regex;
    
    let mut results = Vec::new();
    
    // 常见API Key格式的正则表达式
    let api_key_patterns = vec![
        // OpenAI格式
        (r"sk-[a-zA-Z0-9]{48}", "openai"),
        // Gemini格式
        (r"AIzaSy[a-zA-Z0-9_-]{33}", "gemini"),
        // DeepSeek格式
        (r"sk-[a-zA-Z0-9]{48}", "deepseek"),
        // Claude格式
        (r"sk-ant-[a-zA-Z0-9]{94}", "claude"),
    ];
    
    for (pattern, platform) in &api_key_patterns {
        let re = Regex::new(pattern)?;
        for cap in re.captures_iter(text) {
            if let Some(key) = cap.get(0) {
                results.push(AnalyzedKey {
                    platform: platform.to_string(),
                    key: key.as_str().to_string(),
                    name: None,
                    group: None,
                });
            }
        }
    }
    
    Ok(results)
}