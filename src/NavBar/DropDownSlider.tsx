import React from "react";
import "./NavBar.css";

interface DropDownSliderProps {
  minValue: number;
  maxValue: number;
  step: number;
  defaultValue: number;
  text: string;
  handleChange: (event: any) => void;
}

export const DropDownSlider: React.FC<DropDownSliderProps> = (props) => {
  return (
    <div className="slider-item">
      <div className="slider-item-text">
        <div>
          <span>{props.text}</span>
        </div>
        <div className="slider-value">
          <span>{props.defaultValue}</span>
        </div>
      </div>
      <input
        className="slider"
        type="range"
        value={props.defaultValue}
        min={props.minValue.toString()}
        max={props.maxValue.toString()}
        step={props.step}
        onChange={(e) => props.handleChange(e.target.value)}
      ></input>
    </div>
  );
};
