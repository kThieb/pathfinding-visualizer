import React from "react";
import "./NavBar.css";

interface NavSliderProps {
  className: string;
  minValue: number;
  maxValue: number;
  step: number;
  defaultValue: number;
  text: string;
  handleChange: (event: any) => void;
  isVisualized: number;
  visualizingClassName: string;
  visualizedClassName: string;
}

export const NavSlider: React.FC<NavSliderProps> = (props) => {
  return (
    <div
      className={
        "nav-slider nav-item " +
        props.className +
        (props.isVisualized === 1 ? " " + props.visualizingClassName : "") +
        (props.isVisualized === 2 ? " " + props.visualizedClassName : "")
      }
    >
      <div className="nav-slider-item-text">
        <div>
          <span>{props.text}</span>
        </div>
        <div className="nav-slider-value">
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
