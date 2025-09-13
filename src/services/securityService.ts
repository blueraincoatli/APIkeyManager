import { invoke } from "@tauri-apps/api/core";
import { logSecureError, OperationContext } from "./secureLogging";

// 安全服务
export const securityService = {
  // 设置主密码
  async setMasterPassword(password: string): Promise<boolean> {
    try {
      // 调用Tauri后端命令
      return await invoke("set_master_password", { password });
    } catch (error) {
      logSecureError(OperationContext.MASTER_PASSWORD_SET, error);
      return false;
    }
  },

  // 验证主密码
  async verifyMasterPassword(password: string): Promise<boolean> {
    try {
      // 调用Tauri后端命令
      return await invoke("verify_master_password", { password });
    } catch (error) {
      logSecureError(OperationContext.MASTER_PASSWORD_VERIFY, error);
      return false;
    }
  },

  // 加密API Key
  async encryptKey(key: string): Promise<string> {
    try {
      // 调用Tauri后端命令
      return await invoke("encrypt_key", { key });
    } catch (error) {
      logSecureError(OperationContext.KEY_ENCRYPTION, error);
      return "";
    }
  },

  // 解密API Key
  async decryptKey(encryptedKey: string): Promise<string> {
    try {
      // 调用Tauri后端命令
      return await invoke("decrypt_key", { encryptedKey });
    } catch (error) {
      logSecureError(OperationContext.KEY_DECRYPTION, error);
      return "";
    }
  },
};