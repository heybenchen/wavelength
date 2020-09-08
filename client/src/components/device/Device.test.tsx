import { render } from "@testing-library/react";
import React from "react";
import Device from "./Device";

test("renders buttons", () => {
  const { getByText } = render(<Device socket={undefined} />);
  const peekButton = getByText(/Peek/);
  expect(peekButton).toBeInTheDocument();
});
