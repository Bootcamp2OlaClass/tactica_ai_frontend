import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { COURSE_COLOR_PALETTE, ColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
  it("marks the swatch matching the current value as selected", () => {
    render(<ColorPicker value={COURSE_COLOR_PALETTE[2].hex} onChange={() => {}} />);

    expect(screen.getByRole("button", { name: COURSE_COLOR_PALETTE[2].name })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: COURSE_COLOR_PALETTE[0].name })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the swatch hex when a swatch is clicked", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: COURSE_COLOR_PALETTE[4].name }));

    expect(onChange).toHaveBeenCalledWith(COURSE_COLOR_PALETTE[4].hex);
  });

  it("reveals a native color input and writes a valid hex when Custom is toggled", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Custom color" }));
    const customInput = screen.getByLabelText("Pick a custom color");
    fireEvent.change(customInput, { target: { value: "#ab12cd" } });

    expect(onChange).toHaveBeenCalledWith("#AB12CD");
  });

  it("opens with Custom already active when the value doesn't match any swatch", () => {
    render(<ColorPicker value="#123456" onChange={() => {}} />);

    expect(screen.getByLabelText("Pick a custom color")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom color" })).toHaveAttribute("aria-pressed", "true");
  });

  it("disables every control when disabled is set", () => {
    render(<ColorPicker value="" onChange={() => {}} disabled />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });
});
