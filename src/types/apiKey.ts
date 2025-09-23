export interface ApiKey {
  id: string;
  name: string;
  keyValue: string;
  platform?: string;
  description?: string;
  groupId?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  lastUsedAt?: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UsageHistory {
  id: string;
  keyId: string;
  usedAt: number;
}

export interface Setting {
  key: string;
  value: string;
}

export interface AnalyzedKey {
  key: string;
  platform: string;
  name?: string;
  group?: string;
}

export interface BatchImportRecord {
  id: string;
  source: string;
  totalCount: number;
  successCount: number;
  failedCount: number;
  createdAt: number;
  details?: string;
}

export interface BatchApiKey {
  name: string;
  keyValue: string;
  platform?: string;
  description?: string;
}

export interface BatchImportResult {
  success: boolean;
  total: number;
  succeeded: number;
  failed: number;
  errors: string[];
}

// Tauri 环境接口
declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}
