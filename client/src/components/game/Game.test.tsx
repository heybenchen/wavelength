import { render } from "@testing-library/react";
import React from "react";
import Game from "./Game";

test("renders player count", () => {
  const { getByText } = render(<Game />);
  const playerCountElement = getByText(/Players/i);
  expect(playerCountElement).toBeInTheDocument();
});
