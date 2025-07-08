import URLForm from "@/components/URLForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

describe("URLForm Component", () => {
  it("renders input and button", () => {
    render(<URLForm onSubmit={vi.fn()} />);
    expect(
      screen.getByPlaceholderText(/Enter website URL/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
  });

  it("calls onSubmit with valid URL", async () => {
    const onSubmit = vi.fn();
    render(<URLForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(/Enter website URL/i);
    fireEvent.change(input, { target: { value: "https://example.com" } });

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("https://example.com");
    });
  });

  it("does not call onSubmit if input is empty", async () => {
    const onSubmit = vi.fn();
    render(<URLForm onSubmit={onSubmit} />);

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("trims input before submitting", async () => {
    const onSubmit = vi.fn();
    render(<URLForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(/Enter website URL/i);
    fireEvent.change(input, { target: { value: "   https://example.com   " } });

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("https://example.com");
    });
  });

  it("clears input after submission", async () => {
    render(<URLForm onSubmit={vi.fn()} />);

    const input = screen.getByPlaceholderText(/Enter website URL/i);
    fireEvent.change(input, { target: { value: "https://clear.com" } });

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });

  it("prevents default form submission behavior", () => {
    const onSubmit = vi.fn();
    const preventDefault = vi.fn();

    render(<URLForm onSubmit={onSubmit} />);

    const form = screen.getByRole("form");
    const event = new Event("submit", { bubbles: true, cancelable: true });
    // Patch the event to include preventDefault
    event.preventDefault = preventDefault;
    form.dispatchEvent(event);

    expect(preventDefault).toHaveBeenCalled();
  });
});
