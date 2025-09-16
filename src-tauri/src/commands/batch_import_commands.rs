use tauri::command;
use serde::{Deserialize, Serialize};
use crate::database::api_key::{insert_api_key, ApiKey};
use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchApiKey {
    pub name: String,
    pub key_value: String,
    pub platform: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchImportResult {
    pub success: bool,
    pub total: usize,
    pub succeeded: usize,
    pub failed: usize,
    pub errors: Vec<String>,
}

#[command]
pub async fn import_api_keys_batch(
    state: tauri::State<'_, AppState>,
    keys: Vec<BatchApiKey>,
) -> Result<BatchImportResult, String> {
    let mut succeeded = 0;
    let mut failed = 0;
    let mut errors = Vec::new();
    
    for (index, key) in keys.iter().enumerate() {
        let api_key = ApiKey::new(
            key.name.clone(),
            key.key_value.clone(),
            key.platform.clone(),
            key.description.clone(),
            None, // group_id
            None, // tags
        );
        
        match insert_api_key(&state.db, &api_key).await {
            Ok(_) => {
                succeeded += 1;
            }
            Err(e) => {
                failed += 1;
                errors.push(format!("第{}条记录失败: {}", index + 1, e));
            }
        }
    }
    
    Ok(BatchImportResult {
        success: failed == 0,
        total: keys.len(),
        succeeded,
        failed,
        errors,
    })
}