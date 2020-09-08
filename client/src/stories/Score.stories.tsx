import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Score, { ScoreProps } from "../components/score/Score";

export default {
  title: "Score",
  component: Score,
} as Meta;

const Template: Story<ScoreProps> = (args) => <Score {...args} />;

export const Default = Template.bind({});
Default.args = {
  socket: undefined,
  teamId: 0,
};
