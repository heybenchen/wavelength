import ComponentParams from "<your_component_path>/ComponentParams";
import { storiesOf } from "@storybook/react";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import StoryRouter from "storybook-react-router";
import Game from "./Game";

export default {
  title: "Components/Game",
  component: Game,
} as Meta;

const Template: Story = (args) => <Game {...args} />;

export const Default = Template.bind({});
Default.args = {};

storiesOf("Components/Game", module).addDecorator(StoryRouter());
