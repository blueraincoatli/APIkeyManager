// 输入验证工具函数（向后兼容）
import { validateAndSanitizeApiKey, validateAndSanitizeGroup } from './inputValidation';

export class Validator {
  static validateApiKey(apiKey: any): { isValid: boolean; errors: string[] } {
    const result = validateAndSanitizeApiKey(apiKey || {});
    return {
      isValid: result.isValid,
      errors: result.errors
    };
  }
  
  static validateGroup(group: any): { isValid: boolean; errors: string[] } {
    const result = validateAndSanitizeGroup(group || {});
    return {
      isValid: result.isValid,
      errors: result.errors
    };
  }
}