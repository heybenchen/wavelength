import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Score, { ScoreProps } from "../../components/score/Score";

export default {
  title: "App/Score",
  component: Score,
} as Meta;

const Template: Story<ScoreProps> = (args) => <Score {...args} />;

export const Default = Template.bind({});
Default.args = {
  teamId: 0,
};
