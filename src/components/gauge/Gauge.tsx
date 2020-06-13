import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Slider } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: 400,
  },
  slider: {
    color: '#52af77',
  },
  markLabel: {
    color: '#ffffff',
  }
});

const SLIDER_MAX = 14;
const SLIDER_INITIAL = SLIDER_MAX / 2;

export default function Gauge() {
  const classes = useStyles();
  const [value, setValue] = React.useState<number | number[]>(SLIDER_INITIAL);

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue);
  };

  const valueLabelFormat = () => {
    let fixedValue = value;
    if ((value as number).toFixed) {
      fixedValue = parseFloat((value as number).toFixed(1));
    } else {
      fixedValue = parseFloat((value as number[])[0].toFixed(1));
    }
    return fixedValue.toString();
  }

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 7,
      label: '7',
    },
    {
      value: 14,
      label: '14',
    },
  ];

  return (
    <div className={classes.root}>
      <Slider
        className={classes.slider}
        classes={{
          root: classes.slider,
          markLabel: classes.markLabel,
        }}
        value={value}
        min={0}
        step={0.5}
        max={SLIDER_MAX}
        scale={(x) => x ** 10}
        onChange={handleChange}
        track={false}
        marks={marks}
        valueLabelDisplay='auto'
        valueLabelFormat={valueLabelFormat}
      />
    </div>
  );
}
