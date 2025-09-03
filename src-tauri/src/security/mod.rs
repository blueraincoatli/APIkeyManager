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

// 密码哈希
pub fn hash_password(password: &str) -> Result<String, Box<dyn std::error::Error>> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?
        .to_string();
    
    Ok(password_hash)
}

// 验证密码
pub fn verify_password(password: &str, hash: &str) -> Result<bool, Box<dyn std::error::Error>> {
    let argon2 = Argon2::default();
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    
    let is_valid = argon2
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok();
    
    Ok(is_valid)
}

// 生成加密密钥
pub fn generate_encryption_key(password: &str) -> Result<[u8; 32], Box<dyn std::error::Error>> {
    let salt = b"api_key_manager_salt";
    let mut key = [0u8; 32];
    
    // 使用Argon2派生密钥
    let argon2 = Argon2::default();
    argon2
        .hash_password_into(password.as_bytes(), salt, &mut key)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    
    Ok(key)
}

// 加密数据
pub fn encrypt_data(
    data: &str,
    key: &[u8; 32],
) -> Result<String, Box<dyn std::error::Error>> {
    let cipher = Aes256Gcm::new(key.into());
    
    // 生成随机nonce
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);
    
    // 加密数据
    let ciphertext = cipher
        .encrypt(nonce, data.as_bytes())
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    
    // 将nonce和密文组合
    let mut result = nonce_bytes.to_vec();
    result.extend_from_slice(&ciphertext);
    
    // Base64编码
    Ok(base64::encode(result))
}

// 解密数据
pub fn decrypt_data(
    encrypted_data: &str,
    key: &[u8; 32],
) -> Result<String, Box<dyn std::error::Error>> {
    // Base64解码
    let data = base64::decode(encrypted_data)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    
    if data.len() < 12 {
        return Err("Invalid encrypted data".into());
    }
    
    let (nonce_bytes, ciphertext) = data.split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);
    
    let cipher = Aes256Gcm::new(key.into());
    
    // 解密数据
    let plaintext = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    
    String::from_utf8(plaintext)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)
}