import { render } from "@testing-library/react";
import React from "react";
import App from './App';

test('renders player count', () => {
  const { getByText } = render(<App />);
  const playerCountElement = getByText(/Players/i);
  expect(playerCountElement).toBeInTheDocument();
});
