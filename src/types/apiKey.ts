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

export interface BatchImportRecord {
  id: string;
  source: string;
  totalCount: number;
  successCount: number;
  failedCount: number;
  createdAt: number;
  details?: string;
}

export interface AnalyzedKey {
  platform: string;
  key: string;
  name?: string;
  group?: string;
}