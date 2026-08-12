import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SemesterForm } from "./SemesterForm";

describe("SemesterForm", () => {
  it("blocks submission and shows field errors when required fields are missing", () => {
    const onSubmit = vi.fn();
    render(<SemesterForm submitLabel="Create semester" isSubmitting={false} onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Create semester" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Start date is required.")).toBeInTheDocument();
    expect(screen.getByText("End date is required.")).toBeInTheDocument();
  });

  it("blocks submission when the end date is not after the start date", () => {
    const onSubmit = vi.fn();
    render(<SemesterForm submitLabel="Create semester" isSubmitting={false} onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Fall 2026" } });
    fireEvent.change(screen.getByLabelText(/Start date/), { target: { value: "2026-09-01" } });
    fireEvent.change(screen.getByLabelText(/End date/), { target: { value: "2026-08-01" } });
    fireEvent.click(screen.getByRole("button", { name: "Create semester" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("End date must be after the start date.")).toBeInTheDocument();
  });

  it("submits with valid values", () => {
    const onSubmit = vi.fn();
    render(<SemesterForm submitLabel="Create semester" isSubmitting={false} onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Fall 2026" } });
    fireEvent.change(screen.getByLabelText(/Start date/), { target: { value: "2026-09-01" } });
    fireEvent.change(screen.getByLabelText(/End date/), { target: { value: "2026-12-15" } });
    fireEvent.click(screen.getByRole("button", { name: "Create semester" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: "Fall 2026", startDate: "2026-09-01", endDate: "2026-12-15" }));
  });
});
