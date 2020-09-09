import { render } from "@testing-library/react";
import React from "react";
import Game from "./Game";

jest.mock("react-router", () => ({
  useParams: jest.fn().mockReturnValue({ id: "123" }),
}));

beforeEach(() => {
  sessionStorage.clear();
});

test("it renders", () => {
  const tree = render(<Game />);
  // expect(tree).toMatchSnapshot();
});

test("it renders player count", () => {
  const { getByText } = render(<Game />);
  const playerCountElement = getByText(/Players/i);
  expect(playerCountElement).toBeInTheDocument();
});

test("it restores player info", () => {
  sessionStorage.setItem("playerName", "Ben Chen");
  sessionStorage.setItem("teamId", "1");

  render(<Game />);

  expect(sessionStorage.clear).toHaveBeenCalled();
  expect(sessionStorage.getItem).toHaveReturnedWith("Ben Chen");
  expect(sessionStorage.getItem).toHaveReturnedWith("1");
});

test("it saves player info", () => {
  render(<Game />);

  expect(sessionStorage.clear).toHaveBeenCalled();
  expect(sessionStorage.getItem).toHaveBeenCalledWith("playerName");
  expect(sessionStorage.getItem).toHaveBeenCalledWith("teamId");
});
