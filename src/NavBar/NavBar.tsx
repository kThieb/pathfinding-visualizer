import React, { useState } from "react";
import "./NavBar.css";

export const NavBar: React.FC = (props) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
};

interface NavButtonProps {
  text: string;
  isVisualized: number;
  className: string;
  startClassName?: string;
  visualizingClassName: string;
  visualizedClassName: string;
  handleClick: () => void;
}

export const NavButton: React.FC<NavButtonProps> = (props) => {
  const addedClassNames: string[] = [
    props.startClassName ? props.startClassName : "",
    props.visualizingClassName,
    props.visualizedClassName,
  ];

  return (
    <li
      className={
        "nav-item " +
        addedClassNames[props.isVisualized] +
        " " +
        props.className
      }
      onClick={(e) => {
        props.handleClick();
      }}
    >
      <p>{props.text}</p>
    </li>
  );
};

interface NavItemProps {
  text: string;
  id: string;
  isVisualized: number;
  shouldGreyOut: boolean;
}

export const NavItem: React.FC<NavItemProps> = (props) => {
  const [open, setOpen] = useState(false);

  const handleClick: (e: any) => void = (event) => {
    if (!props.shouldGreyOut || !props.isVisualized) setOpen(!open);
    document.addEventListener("click", (e) => {
      const dropDownMenu = document.getElementById(props.id);
      let targetElement = e.target as Element;

      do {
        if (targetElement === dropDownMenu) return;
        targetElement = targetElement.parentNode as Element;
      } while (targetElement);
      setOpen(false);
    });
  };

  return (
    <li
      id={props.id}
      className={
        "nav-item" +
        (props.shouldGreyOut && props.isVisualized ? " greyed-out" : "")
      }
    >
      <p className="icon-button" onClick={handleClick}>
        {props.text}
      </p>
      {open && props.children}
    </li>
  );
};

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
      <span>{props.leftIcon ? props.leftIcon : ""}</span>
      {props.children}
      <span>{props.rightIcon ? props.rightIcon : ""}</span>
    </div>
  );
};

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
