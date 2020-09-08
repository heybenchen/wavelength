import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Prompt, { PromptProps } from "./Prompt";

export default {
  title: "Components/Prompt",
  component: Prompt,
} as Meta;

const Template: Story<PromptProps> = (args) => <Prompt {...args} />;

export const Default = Template.bind({});
Default.args = {
  wordSet: ["Left", "Right"],
};
