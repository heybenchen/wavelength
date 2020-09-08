import { Story } from "@storybook/react/types-6-0";
import React from "react";
import Device, { DeviceProps } from "../components/device/Device";

// This default export determines where you story goes in the story list
export default {
  title: "Device",
  component: Device,
};

const Template: Story<DeviceProps> = (args) => <Device {...args} />;

export const DeviceStory = Template.bind({});
DeviceStory.args = {
  /* the args you need here will depend on your component */
};
