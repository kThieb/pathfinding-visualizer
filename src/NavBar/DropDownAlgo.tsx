import React from "react";
import "./NavBar.css";

interface DropDownAlgoProps {
  leftIcon?: string;
  rightIcon?: string;
  handleClick: () => void;
}

export const DropDownItem: React.FC<DropDownAlgoProps> = (props) => {
  return (
    <div
      className="menu-item"
      onClick={(e) => {
        props.handleClick();
      }}
    >
      {props.children}
    </div>
  );
};
