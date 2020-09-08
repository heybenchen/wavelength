import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Score, { ScoreProps } from "./Score";

export default {
  title: "Components/Score",
  component: Score,
} as Meta;

const Template: Story<ScoreProps> = (args) => <Score {...args} />;

export const RedTeam = Template.bind({});
RedTeam.args = {
  teamId: 0,
};

export const BlueTeam = Template.bind({});
BlueTeam.args = {
  teamId: 1,
};
