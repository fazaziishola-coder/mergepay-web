import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InviteScannerModal } from "./InviteScannerModal";

describe("InviteScannerModal", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders scanner modal with video container and manual input", () => {
    render(<InviteScannerModal open={true} onClose={vi.fn()} onScan={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Scan Group Invite QR/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Or enter invite code/i)).toBeInTheDocument();
  });

  it("handles manual invite submission correctly", () => {
    const onScan = vi.fn();
    const onClose = vi.fn();
    render(<InviteScannerModal open={true} onClose={onClose} onScan={onScan} />);

    const input = screen.getByLabelText(/Or enter invite code/i);
    fireEvent.change(input, { target: { value: "TESTCODE99" } });

    const submitBtn = screen.getByRole("button", { name: /^Join$/i });
    fireEvent.click(submitBtn);

    expect(onScan).toHaveBeenCalledWith("TESTCODE99");
    expect(onClose).toHaveBeenCalled();
  });
});
