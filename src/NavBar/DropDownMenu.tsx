import React from "react";
import "./NavBar.css";

interface DropDownMenu {
  height?: number;
  left?: boolean;
}

export const DropDownMenu: React.FC<DropDownMenu> = (props) => {
  return (
    <div
      className={"dropdown" + (props.left ? " left" : "")}
      style={{ height: props.height }}
    >
      {props.children}
    </div>
  );
};
