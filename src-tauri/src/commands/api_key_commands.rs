use tauri::State;
use crate::{database::{api_key::{ApiKey, insert_api_key, update_api_key, delete_api_key, get_all_api_keys, search_api_keys}, DatabaseError}, AppState};

// 添加新的API Key
#[tauri::command]
pub async fn add_api_key(
    state: State<'_, AppState>,
    api_key: ApiKey,
) -> Result<bool, DatabaseError> {
    let pool = &state.db;
    insert_api_key(pool, &api_key).await?;
    Ok(true)
}

// 编辑现有API Key
#[tauri::command]
pub async fn edit_api_key(
    state: State<'_, AppState>,
    api_key: ApiKey,
) -> Result<bool, DatabaseError> {
    let pool = &state.db;
    update_api_key(pool, &api_key).await?;
    Ok(true)
}

// 删除API Key
#[tauri::command]
pub async fn delete_api_key(
    state: State<'_, AppState>,
    key_id: String,
) -> Result<bool, DatabaseError> {
    let pool = &state.db;
    delete_api_key(pool, &key_id).await?;
    Ok(true)
}

// 获取API Key列表
#[tauri::command]
pub async fn list_api_keys(
    state: State<'_, AppState>,
) -> Result<Vec<ApiKey>, DatabaseError> {
    let pool = &state.db;
    get_all_api_keys(pool).await
}

// 搜索API Key
#[tauri::command]
pub async fn search_api_keys(
    state: State<'_, AppState>,
    keyword: String,
) -> Result<Vec<ApiKey>, DatabaseError> {
    let pool = &state.db;
    search_api_keys(pool, &keyword).await
}