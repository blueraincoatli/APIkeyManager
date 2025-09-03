use tauri::State;
use crate::{security, AppState};

// 设置主密码
#[tauri::command]
pub async fn set_master_password(
    state: State<'_, AppState>,
    password: String,
) -> Result<bool, String> {
    match security::hash_password(&password) {
        Ok(hash) => {
            // 这里应该将哈希存储到数据库或配置中
            // 为了简化，我们暂时只返回成功
            Ok(true)
        },
        Err(e) => Err(e.to_string()),
    }
}

// 验证主密码
#[tauri::command]
pub async fn verify_master_password(
    state: State<'_, AppState>,
    password: String,
) -> Result<bool, String> {
    // 这里应该从数据库或配置中获取存储的哈希
    // 为了简化，我们暂时只返回成功
    Ok(true)
}

// 加密API Key
#[tauri::command]
pub async fn encrypt_key(
    state: State<'_, AppState>,
    key: String,
) -> Result<String, String> {
    // 生成加密密钥（实际应用中应该使用主密码）
    let encryption_key = [0u8; 32]; // 简化处理
    
    match security::encrypt_data(&key, &encryption_key) {
        Ok(encrypted) => Ok(encrypted),
        Err(e) => Err(e.to_string()),
    }
}

// 解密API Key
#[tauri::command]
pub async fn decrypt_key(
    state: State<'_, AppState>,
    encrypted_key: String,
) -> Result<String, String> {
    // 生成加密密钥（实际应用中应该使用主密码）
    let encryption_key = [0u8; 32]; // 简化处理
    
    match security::decrypt_data(&encrypted_key, &encryption_key) {
        Ok(decrypted) => Ok(decrypted),
        Err(e) => Err(e.to_string()),
    }
}