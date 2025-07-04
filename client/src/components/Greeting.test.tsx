import { render, screen } from "@testing-library/react";
import { Greeting } from "./Greeting";

test("renders the greeting message", () => {
  render(<Greeting name="Foyez" />);
  expect(screen.getByText(/hello, foyez/i)).toBeInTheDocument();
});
