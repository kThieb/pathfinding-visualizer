import React, { useState } from "react";
import "./NavBar.css";

export const NavBar: React.FC = (props) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
};

interface NavItemProps {
  icon: string;
  text: string;
}

export const NavItem: React.FC<NavItemProps> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <li className={"nav-item " + props.text}>
      <p className="icon-button" onClick={() => setOpen(!open)}>
        {props.text}
      </p>
      {open && props.children}
    </li>
  );
};

interface DropDownMenu {
  left: boolean;
}

export const DropDownMenu: React.FC<DropDownMenu> = (props) => {
  return (
    <div className={"dropdown " + (props.left ? "left" : "right")}>
      {props.children}
    </div>
  );
};

interface DropDownAlgoProps {
  leftIcon?: string;
  rightIcon?: string;
  algorithmName: string;
  changeAlgorithm: (algorithmName: string) => void;
}

export const DropDownAlgo: React.FC<DropDownAlgoProps> = (props) => {
  return (
    <div
      className="menu-item"
      onClick={(e) => {
        props.changeAlgorithm(props.algorithmName);
      }}
    >
      {props.children}
    </div>
  );
};

interface DropDownSliderProps {
  minValue: number;
  maxValue: number;
  defaultValue: number;
  text: string;
  handleChangeWallsDensity: (event: any) => void;
}

export const DropDownSlider: React.FC<DropDownSliderProps> = (props) => {
  return (
    <div className="slider-item">
      <div>
        <p>{props.text}</p>
      </div>
      <input
        className="slider"
        type="range"
        value={props.defaultValue}
        min={props.minValue.toString()}
        max={props.maxValue.toString()}
        step={0.01}
        onChange={(e) => props.handleChangeWallsDensity(e.target.value)}
      ></input>
    </div>
  );
};
