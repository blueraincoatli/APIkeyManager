pub mod password;
pub mod encryption;

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use rand::RngCore;
use base64::{Engine as _, engine::general_purpose};

// 密码哈希
pub fn hash_password(password: &str) -> Result<String, String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| format!("Hash error: {:?}", e))?
        .to_string();
    
    Ok(password_hash)
}

// 验证密码
#[allow(dead_code)]
pub fn verify_password(password: &str, hash: &str) -> Result<bool, String> {
    let argon2 = Argon2::default();
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| format!("Parse hash error: {:?}", e))?;
    
    let is_valid = argon2
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok();
    
    Ok(is_valid)
}

// 生成加密密钥
#[allow(dead_code)]
pub fn generate_encryption_key(password: &str) -> Result<[u8; 32], String> {
    let salt = b"api_key_manager_salt";
    let mut key = [0u8; 32];
    
    // 使用Argon2派生密钥
    let argon2 = Argon2::default();
    argon2
        .hash_password_into(password.as_bytes(), salt, &mut key)
        .map_err(|e| format!("Key derivation error: {:?}", e))?;
    
    Ok(key)
}

// 加密数据
pub fn encrypt_data(
    data: &str,
    key: &[u8; 32],
) -> Result<String, String> {
    let cipher = Aes256Gcm::new(key.into());
    
    // 生成随机nonce
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);
    
    // 加密数据
    let ciphertext = cipher
        .encrypt(nonce, data.as_bytes())
        .map_err(|e| format!("Encryption error: {:?}", e))?;
    
    // 将nonce和密文组合
    let mut result = nonce_bytes.to_vec();
    result.extend_from_slice(&ciphertext);
    
    // Base64编码
    Ok(general_purpose::STANDARD.encode(result))
}

// 解密数据
pub fn decrypt_data(
    encrypted_data: &str,
    key: &[u8; 32],
) -> Result<String, String> {
    // Base64解码
    let data = general_purpose::STANDARD.decode(encrypted_data)
        .map_err(|e| format!("Base64 decode error: {:?}", e))?;
    
    if data.len() < 12 {
        return Err("Invalid encrypted data".to_string());
    }
    
    let (nonce_bytes, ciphertext) = data.split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);
    
    let cipher = Aes256Gcm::new(key.into());
    
    // 解密数据
    let plaintext = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| format!("Decryption error: {:?}", e))?;
    
    String::from_utf8(plaintext)
        .map_err(|e| format!("UTF-8 conversion error: {:?}", e))
}