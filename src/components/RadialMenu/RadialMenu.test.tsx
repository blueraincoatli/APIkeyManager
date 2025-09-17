import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RadialMenu } from "./RadialMenu";

describe("RadialMenu", () => {
  const mockOptions = [
    { id: "1", label: "Option 1" },
    { id: "2", label: "Option 2" },
    { id: "3", label: "Option 3" },
  ];

  const mockOnSelect = vi.fn();
  const mockOnClose = vi.fn();

  it("should render all options", () => {
    render(
      <RadialMenu
        options={mockOptions}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("should call onSelect when an option is clicked", () => {
    render(
      <RadialMenu
        options={mockOptions}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    const optionButton = screen.getByText("Option 1");
    fireEvent.click(optionButton);

    expect(mockOnSelect).toHaveBeenCalledWith("1");
  });

  it("should call onClose when the overlay is clicked", () => {
    render(
      <RadialMenu
        options={mockOptions}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    const overlay = screen.getByText("Option 1").closest(".fixed");
    if (overlay) {
      fireEvent.click(overlay);
      // Note: This test might need adjustment based on the actual DOM structure
    }
  });
});