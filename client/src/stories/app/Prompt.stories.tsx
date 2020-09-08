import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Prompt, { PromptProps } from "../../components/prompt/Prompt";

export default {
  title: "App/Prompt",
  component: Prompt,
} as Meta;

const Template: Story<PromptProps> = (args) => <Prompt {...args} />;

export const Default = Template.bind({});
Default.args = {
  wordSet: ["Left", "Right"],
};
