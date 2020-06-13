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

const SLIDER_MIN = -10
const SLIDER_MAX = 10;
const SLIDER_INITIAL = 0;

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
      value: SLIDER_MIN,
      label: SLIDER_MIN.toString(),
    },
    {
      value: 0,
      label: 0,
    },
    {
      value: SLIDER_MAX,
      label: SLIDER_MAX.toString(),
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
        min={SLIDER_MIN}
        step={1}
        max={SLIDER_MAX}
        scale={(x) => x ** 10}
        onChange={handleChange}
        track={false}
        marks={marks}
        valueLabelDisplay='on'
        valueLabelFormat={valueLabelFormat}
      />
    </div>
  );
}
