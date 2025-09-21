import * as XLSX from 'xlsx';

// 检查是否在Tauri环境中
const isTauri = typeof window !== 'undefined' && (
  '__TAURI__' in window ||
  '__TAURI_INTERNALS__' in window
);

// Tauri文件系统API
let tauriFs: any = null;

if (isTauri) {
  // 优先使用旧版全局 fs（如存在）
  if ((window as any).__TAURI__ && (window as any).__TAURI__.fs) {
    tauriFs = (window as any).__TAURI__.fs;
  }
  // 其余情况使用按需动态导入（在实际读取时 import），避免在浏览器环境触发 require 未定义警告
}

export interface ExcelApiKeyData {
  name: string;
  keyValue: string;
  platform: string;
  description: string;
}

export interface ExcelParseResult {
  success: boolean;
  data?: ExcelApiKeyData[];
  error?: string;
}

/**
 * 解析Excel文件中的API Key数据
 * @param filePath - 文件路径（Tauri环境）或File对象（Web环境）
 * @returns Promise<ExcelParseResult>
 */
export async function parseExcelFile(filePath: string | File): Promise<ExcelParseResult> {
  console.log('parseExcelFile called with:', typeof filePath === 'string' ? filePath : filePath.name);

  try {
    let workbook: XLSX.WorkBook;

    if (typeof filePath === 'string') {
      // Tauri环境：从文件路径读取
      if (!isTauri) {
        return {
          success: false,
          error: 'Tauri文件系统不可用'
        };
      }

      try {
        let fileData: Uint8Array;

        if (tauriFs && tauriFs.readBinaryFile) {
          // 使用传统的Tauri API
          fileData = await tauriFs.readBinaryFile(filePath);
        } else {
          // 尝试使用新的插件API
          const { readBinaryFile } = await import('@tauri-apps/plugin-fs');
          fileData = await readBinaryFile(filePath);
        }

        workbook = XLSX.read(fileData, { type: 'array' });
      } catch (error: any) {
        console.error('Failed to read file:', error);
        return {
          success: false,
          error: `无法读取文件: ${error.message || '文件读取失败'}`
        };
      }
    } else {
      // Web环境：从File对象读取
      const arrayBuffer = await filePath.arrayBuffer();
      workbook = XLSX.read(arrayBuffer, { type: 'array' });
    }

    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        success: false,
        error: 'Excel文件中没有找到工作表'
      };
    }

    const worksheet = workbook.Sheets[sheetName];
    
    // 将工作表转换为JSON数组
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('JSON data from Excel:', jsonData);

    if (jsonData.length < 2) {
      console.error('Not enough data rows:', jsonData.length);
      return {
        success: false,
        error: 'Excel文件中没有足够的数据行'
      };
    }

    // 获取表头行
    const headers = jsonData[0] as string[];
    console.log('Headers found:', headers);
    
    // 验证必需的列是否存在
    const requiredColumns = ['名称', 'API Key', '提供商', '描述'];
    const columnIndexes: { [key: string]: number } = {};
    
    for (const col of requiredColumns) {
      const index = headers.findIndex(header =>
        header && header.toString().trim() === col
      );
      if (index === -1) {
        console.error(`Missing column: ${col}. Available headers:`, headers);
        return {
          success: false,
          error: `缺少必需的列: ${col}。可用列: ${headers.join(', ')}`
        };
      }
      columnIndexes[col] = index;
    }

    // 解析数据行
    const apiKeys: ExcelApiKeyData[] = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as any[];
      
      // 跳过空行
      if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
        continue;
      }

      const name = row[columnIndexes['名称']]?.toString().trim();
      const keyValue = row[columnIndexes['API Key']]?.toString().trim();
      const platform = row[columnIndexes['提供商']]?.toString().trim();
      const description = row[columnIndexes['描述']]?.toString().trim();

      // 验证必需字段
      if (!name || !keyValue) {
        console.warn(`第${i + 1}行数据不完整，跳过: 名称=${name}, API Key=${keyValue}`);
        continue;
      }

      apiKeys.push({
        name,
        keyValue,
        platform: platform || '',
        description: description || ''
      });
    }

    if (apiKeys.length === 0) {
      return {
        success: false,
        error: '没有找到有效的API Key数据'
      };
    }

    return {
      success: true,
      data: apiKeys
    };

  } catch (error: any) {
    console.error('Excel解析失败:', error);
    return {
      success: false,
      error: `Excel解析失败: ${error.message || '未知错误'}`
    };
  }
}

/**
 * 生成Excel模板文件的数据
 * @returns 模板数据的二进制数组
 */
export function generateExcelTemplate(): Uint8Array {
  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  
  // 创建示例数据
  const templateData = [
    ['名称', 'API Key', '提供商', '描述'],
    ['OpenAI GPT-4', 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'OpenAI', '用于GPT-4模型访问'],
    ['Claude API', 'claude-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Anthropic', '用于Claude模型访问'],
    ['Google Gemini', 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Google', '用于Gemini模型访问']
  ];
  
  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  
  // 设置列宽
  worksheet['!cols'] = [
    { width: 20 }, // 名称
    { width: 50 }, // API Key
    { width: 15 }, // 提供商
    { width: 30 }  // 描述
  ];
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'API Keys');
  
  // 生成Excel文件的二进制数据
  const excelBuffer = XLSX.write(workbook, { 
    type: 'array', 
    bookType: 'xlsx' 
  });
  
  return new Uint8Array(excelBuffer);
}

/**
 * 验证Excel文件格式
 * @param filePath - 文件路径或File对象
 * @returns 是否为有效的Excel文件
 */
export function isValidExcelFile(filePath: string | File): boolean {
  if (typeof filePath === 'string') {
    // 检查文件扩展名
    return /\.(xlsx|xls)$/i.test(filePath);
  } else {
    // 检查File对象的类型
    return filePath.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           filePath.type === 'application/vnd.ms-excel' ||
           /\.(xlsx|xls)$/i.test(filePath.name);
  }
}
