import URLControls from "@/components/URLControls";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

describe("URLFormControls Component", () => {
  it("renders input and button", () => {
    render(
      <URLControls
        onAdd={vi.fn()}
        onSearch={vi.fn()}
        filters={{}}
        onFilterChange={vi.fn()}
      />
    );
    expect(
      screen.getByPlaceholderText(/Enter website URL/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add URL/i })
    ).toBeInTheDocument();
  });

  it("calls onSubmit with valid URL", async () => {
    const onSubmit = vi.fn();
    render(
      <URLControls
        onAdd={onSubmit}
        onSearch={vi.fn()}
        filters={{}}
        onFilterChange={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Enter website URL/i);
    fireEvent.change(input, { target: { value: "https://example.com" } });

    const button = screen.getByRole("button", { name: /Add URL/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("https://example.com");
    });
  });

  it("does not call onSubmit if input is empty", async () => {
    const onSubmit = vi.fn();
    render(
      <URLControls
        onAdd={onSubmit}
        onSearch={vi.fn()}
        filters={{}}
        onFilterChange={vi.fn()}
      />
    );

    const button = screen.getByRole("button", { name: /Add URL/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("trims input before submitting", async () => {
    const onSubmit = vi.fn();
    render(
      <URLControls
        onAdd={onSubmit}
        onSearch={vi.fn()}
        filters={{}}
        onFilterChange={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Enter website URL/i);
    fireEvent.change(input, { target: { value: "   https://example.com   " } });

    const button = screen.getByRole("button", { name: /Add URL/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("https://example.com");
    });
  });

  it("clears input after submission", async () => {
    render(
      <URLControls
        onAdd={vi.fn()}
        onSearch={vi.fn()}
        filters={{}}
        onFilterChange={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Enter website URL/i);
    fireEvent.change(input, { target: { value: "https://clear.com" } });

    const button = screen.getByRole("button", { name: /Add URL/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });

  it("prevents default form submission behavior", () => {
    const preventDefault = vi.fn();

    render(
      <URLControls
        onAdd={vi.fn()}
        onSearch={vi.fn()}
        filters={{}}
        onFilterChange={vi.fn()}
      />
    );

    const form = screen.getByRole("form");
    const event = new Event("submit", { bubbles: true, cancelable: true });
    // Patch the event to include preventDefault
    event.preventDefault = preventDefault;
    form.dispatchEvent(event);

    expect(preventDefault).toHaveBeenCalled();
  });
});
