use tauri::State;
use crate::{database::group::Group, AppState};
use crate::database::group::{insert_group, get_all_groups};

// Add a new group
#[tauri::command]
pub async fn add_group(
    state: State<'_, AppState>,
    group: Group,
) -> Result<bool, String> {
    let pool = &state.db;
    insert_group(pool, &group).await.map_err(|e| e.to_string())?;
    Ok(true)
}

// List all groups
#[tauri::command]
pub async fn list_groups(
    state: State<'_, AppState>,
) -> Result<Vec<Group>, String> {
    let pool = &state.db;
    get_all_groups(pool).await.map_err(|e| e.to_string())
}