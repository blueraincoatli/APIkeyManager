// 输入验证工具函数
export class Validator {
  static validateApiKey(apiKey: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!apiKey) {
      errors.push("API Key对象不能为空");
      return { isValid: false, errors };
    }
    
    if (!apiKey.name || typeof apiKey.name !== 'string' || apiKey.name.trim().length === 0) {
      errors.push("API Key名称不能为空");
    }
    
    if (apiKey.name && apiKey.name.length > 100) {
      errors.push("API Key名称不能超过100个字符");
    }
    
    if (apiKey.description && apiKey.description.length > 500) {
      errors.push("API Key描述不能超过500个字符");
    }
    
    if (apiKey.platform && apiKey.platform.length > 50) {
      errors.push("平台名称不能超过50个字符");
    }
    
    if (apiKey.keyValue && apiKey.keyValue.length > 1000) {
      errors.push("API Key值不能超过1000个字符");
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  static validateGroup(group: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!group) {
      errors.push("分组对象不能为空");
      return { isValid: false, errors };
    }
    
    if (!group.name || typeof group.name !== 'string' || group.name.trim().length === 0) {
      errors.push("分组名称不能为空");
    }
    
    if (group.name && group.name.length > 50) {
      errors.push("分组名称不能超过50个字符");
    }
    
    if (group.description && group.description.length > 200) {
      errors.push("分组描述不能超过200个字符");
    }
    
    return { isValid: errors.length === 0, errors };
  }
}