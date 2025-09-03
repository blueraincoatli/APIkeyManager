import { describe, it, expect } from "vitest";
import { Validator } from "../validation";

describe("Validator", () => {
  describe("validateApiKey", () => {
    it("should validate a correct API key", () => {
      const apiKey = {
        name: "Test API Key",
        keyValue: "test-key-value",
        platform: "test-platform",
      };

      const result = Validator.validateApiKey(apiKey);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should reject an API key with empty name", () => {
      const apiKey = {
        name: "",
        keyValue: "test-key-value",
      };

      const result = Validator.validateApiKey(apiKey);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("API Key名称不能为空");
    });
  });

  describe("validateGroup", () => {
    it("should validate a correct group", () => {
      const group = {
        name: "Test Group",
        description: "Test group description",
      };

      const result = Validator.validateGroup(group);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should reject a group with empty name", () => {
      const group = {
        name: "",
        description: "Test group description",
      };

      const result = Validator.validateGroup(group);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("分组名称不能为空");
    });
  });
});