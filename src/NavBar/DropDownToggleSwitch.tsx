import React from "react";
import "./NavBar.css";

interface DropDownToggleSwitchProps {
  text: string;
  shouldShowWeights: boolean;
  handleChange: () => void;
}

export const DropDownToggleSwich: React.FC<DropDownToggleSwitchProps> = (
  props
) => {
  return (
    <div className="menu-item switch-item">
      <span className="switch-text">{props.text}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={props.shouldShowWeights}
          onChange={props.handleChange}
        />
        <span className="switch-slider round"></span>
      </label>
    </div>
  );
};
