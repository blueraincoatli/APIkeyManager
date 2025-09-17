import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the Tauri invoke function
const mockInvoke = vi.fn();

vi.mock("@tauri-apps/api/core", async () => {
  const actual = await vi.importActual("@tauri-apps/api/core");
  return {
    ...actual,
    invoke: mockInvoke,
  };
});

describe("apiKeyService", () => {
  // Dynamic import to avoid hoisting issues
  let apiKeyService: typeof import("../apiKeyService").apiKeyService;

  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Dynamically import the service after mocks are set up
    apiKeyService = (await import("../apiKeyService")).apiKeyService;
  });

  describe("addApiKey", () => {
    it("should call the add_api_key command with the correct parameters", async () => {
      mockInvoke.mockResolvedValue(true);

      const apiKeyData = {
        name: "Test API Key",
        keyValue: "test-key-value",
        platform: "test-platform",
      };

      const result = await apiKeyService.addApiKey(apiKeyData);

      expect(result.success).toBe(true);
      expect(mockInvoke).toHaveBeenCalledWith("add_api_key", {
        apiKey: expect.objectContaining({
          name: "Test API Key",
          keyValue: "test-key-value",
          platform: "test-platform",
        }),
      });
    });

    it("should handle errors gracefully", async () => {
      mockInvoke.mockRejectedValue(new Error("Test error"));

      const apiKeyData = {
        name: "Test API Key",
        keyValue: "test-key-value",
      };

      const result = await apiKeyService.addApiKey(apiKeyData);

      expect(result.success).toBe(false);
    });
    
    it("should validate input and return error for invalid data", async () => {
      const apiKeyData = {
        name: "", // Invalid: empty name
        keyValue: "test-key-value",
      };

      const result = await apiKeyService.addApiKey(apiKeyData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("名称不能为空");
    });
  });

  describe("listApiKeys", () => {
    it("should call the list_api_keys command and return the result", async () => {
      const mockKeys = [
        {
          id: "1",
          name: "Test Key 1",
          keyValue: "key1",
          createdAt: 1234567890,
          updatedAt: 1234567890,
        },
      ];
      mockInvoke.mockResolvedValue(mockKeys);

      const result = await apiKeyService.listApiKeys();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockKeys);
      expect(mockInvoke).toHaveBeenCalledWith("list_api_keys");
    });

    it("should return an empty array on error", async () => {
      mockInvoke.mockRejectedValue(new Error("Test error"));

      const result = await apiKeyService.listApiKeys();

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });
  });
});