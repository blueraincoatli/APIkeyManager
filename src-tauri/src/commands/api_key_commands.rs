use tauri::State;
use crate::{database::api_key::ApiKey, AppState};
use crate::database::api_key::{insert_api_key, update_api_key, delete_api_key as delete_api_key_db, get_all_api_keys, search_api_keys as search_api_keys_db, get_all_platforms as get_all_platforms_db, get_existing_key_values};

// 添加新的API Key
#[tauri::command]
pub async fn add_api_key(
    state: State<'_, AppState>,
    api_key: ApiKey,
) -> Result<bool, String> {
    println!("Adding API key: {} (platform: {:?})", api_key.name, api_key.platform);
    let pool = &state.db;
    insert_api_key(pool, &api_key).await.map_err(|e| {
        eprintln!("Failed to insert API key: {}", e);
        e.to_string()
    })?;
    println!("API key added successfully");
    Ok(true)
}

// 编辑现有API Key
#[tauri::command]
pub async fn edit_api_key(
    state: State<'_, AppState>,
    api_key: ApiKey,
) -> Result<bool, String> {
    let pool = &state.db;
    update_api_key(pool, &api_key).await.map_err(|e| e.to_string())?;
    Ok(true)
}

// 删除API Key
#[tauri::command]
pub async fn delete_api_key(
    state: State<'_, AppState>,
    key_id: String,
) -> Result<bool, String> {
    let pool = &state.db;
    delete_api_key_db(pool, &key_id).await.map_err(|e| e.to_string())?;
    Ok(true)
}

// 获取API Key列表
#[tauri::command]
pub async fn list_api_keys(
    state: State<'_, AppState>,
) -> Result<Vec<ApiKey>, String> {
    let pool = &state.db;
    get_all_api_keys(pool).await.map_err(|e| e.to_string())
}

// 搜索API Key
#[tauri::command]
pub async fn search_api_keys(
    state: State<'_, AppState>,
    keyword: String,
) -> Result<Vec<ApiKey>, String> {
    println!("Searching API keys with keyword: '{}'", keyword);
    let pool = &state.db;
    let results = search_api_keys_db(pool, &keyword).await.map_err(|e| {
        eprintln!("Failed to search API keys: {}", e);
        e.to_string()
    })?;
    println!("Found {} API keys", results.len());
    Ok(results)
}

// 获取所有platform
#[tauri::command]
pub async fn get_all_platforms(
    state: State<'_, AppState>,
) -> Result<Vec<String>, String> {
    let pool = &state.db;
    get_all_platforms_db(pool).await.map_err(|e| e.to_string())
}

// 批量检查 API Key 是否已存在（按 key_value）
#[tauri::command]
pub async fn check_api_keys_exists(
    state: State<'_, AppState>,
    keys: Vec<String>,
) -> Result<Vec<String>, String> {
    let pool = &state.db;
    get_existing_key_values(pool, &keys)
        .await
        .map_err(|e| e.to_string())
}
