// 输入验证工具函数（向后兼容）
import {
  validateAndSanitizeApiKey,
  validateAndSanitizeGroup,
  ApiKeyInput,
  GroupInput,
} from "./inputValidation";

export class Validator {
  static validateApiKey(apiKey: ApiKeyInput): {
    isValid: boolean;
    errors: string[];
  } {
    const result = validateAndSanitizeApiKey(apiKey || {});
    return {
      isValid: result.isValid,
      errors: result.errors,
    };
  }

  static validateGroup(group: GroupInput): {
    isValid: boolean;
    errors: string[];
  } {
    const result = validateAndSanitizeGroup(group || {});
    return {
      isValid: result.isValid,
      errors: result.errors,
    };
  }
}
