import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import Device, { DeviceProps } from "./Device";

export default {
  title: "Components/Device",
  component: Device,
} as Meta;

const Template: Story<DeviceProps> = (args) => <Device {...args} />;

export const Default = Template.bind({});
Default.args = {};
