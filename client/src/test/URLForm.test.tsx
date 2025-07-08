import URLForm from "@/components/URLForm";
import { render, screen, fireEvent } from "@testing-library/react";

describe("URLForm", () => {
  it("should allow URL input and trigger submit", async () => {
    const handleSubmit = vi.fn();
    render(<URLForm onSubmit={handleSubmit} />);

    const input = screen.getByPlaceholderText(/Enter website URL/i);
    fireEvent.change(input, { target: { value: "https://hello.com" } });

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalledWith("https://hello.com");
  });
});
