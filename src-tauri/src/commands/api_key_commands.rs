use tauri::State;
use crate::{database::api_key::ApiKey, AppState};
use crate::database::api_key::{insert_api_key, update_api_key, delete_api_key as delete_api_key_db, get_all_api_keys, search_api_keys as search_api_keys_db};

// 添加新的API Key
#[tauri::command]
pub async fn add_api_key(
    state: State<'_, AppState>,
    api_key: ApiKey,
) -> Result<bool, String> {
    let pool = &state.db;
    insert_api_key(pool, &api_key).await.map_err(|e| e.to_string())?;
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
    let pool = &state.db;
    search_api_keys_db(pool, &keyword).await.map_err(|e| e.to_string())
}