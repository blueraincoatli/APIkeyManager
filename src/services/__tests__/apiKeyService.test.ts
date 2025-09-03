import { apiKeyService } from "../apiKeyService";

// Mock the Tauri invoke function
jest.mock("@tauri-apps/api/core", () => ({
  invoke: jest.fn(),
}));

describe("apiKeyService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("addApiKey", () => {
    it("should call the add_api_key command with the correct parameters", async () => {
      const mockInvoke = require("@tauri-apps/api/core").invoke;
      mockInvoke.mockResolvedValue(true);

      const apiKeyData = {
        name: "Test API Key",
        keyValue: "test-key-value",
        platform: "test-platform",
      };

      const result = await apiKeyService.addApiKey(apiKeyData);

      expect(mockInvoke).toHaveBeenCalledWith("add_api_key", {
        apiKey: expect.objectContaining({
          name: "Test API Key",
          keyValue: "test-key-value",
          platform: "test-platform",
        }),
      });
      expect(result).toBe(true);
    });

    it("should handle errors gracefully", async () => {
      const mockInvoke = require("@tauri-apps/api/core").invoke;
      mockInvoke.mockRejectedValue(new Error("Test error"));

      const apiKeyData = {
        name: "Test API Key",
        keyValue: "test-key-value",
      };

      const result = await apiKeyService.addApiKey(apiKeyData);

      expect(result).toBe(false);
    });
  });

  describe("listApiKeys", () => {
    it("should call the list_api_keys command and return the result", async () => {
      const mockInvoke = require("@tauri-apps/api/core").invoke;
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

      expect(mockInvoke).toHaveBeenCalledWith("list_api_keys");
      expect(result).toEqual(mockKeys);
    });

    it("should return an empty array on error", async () => {
      const mockInvoke = require("@tauri-apps/api/core").invoke;
      mockInvoke.mockRejectedValue(new Error("Test error"));

      const result = await apiKeyService.listApiKeys();

      expect(result).toEqual([]);
    });
  });
});