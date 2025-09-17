import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Tauri invoke function
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.crypto
Object.defineProperty(window, 'crypto', {
  writable: true,
  value: {
    randomUUID: vi.fn().mockImplementation(() => 'mock-uuid'),
  },
});