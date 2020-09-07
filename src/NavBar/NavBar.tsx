import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./NavBar.css";

export const NavBar: React.FC = (props) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
};

interface NavChangingButtonItemProps {
  isVisualized: boolean;
  className: string;
  visualizedClassName: string;
  handleClick: () => void;
}

export const NavChangingButtonItem: React.FC<NavChangingButtonItemProps> = (
  props
) => {
  return (
    <li
      className={
        "nav-item " +
        props.className +
        (props.isVisualized ? " " + props.visualizedClassName : "")
      }
      onClick={(e) => {
        props.handleClick();
      }}
    >
      <p>{props.children}</p>
    </li>
  );
};

interface NavDropDownItemProps {
  tabIndex: number;
  icon: string;
  text: string;
  id: string;
  isVisualized: boolean;
  shouldGreyOut: boolean;
}

export const NavDropDownItem: React.FC<NavDropDownItemProps> = (props) => {
  const [open, setOpen] = useState(false);
  const handleBlur: (e: any) => void = (e) => {
    setOpen(false);
  };

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
        "nav-item " +
        " " +
        (props.shouldGreyOut && props.isVisualized ? " greyed-out" : "")
      }
      tabIndex={props.tabIndex}
    >
      <p className="icon-button" onClick={handleClick}>
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
  const [activeMenu, setActiveMenu] = useState("main");
  return (
    <div className={"dropdown" + (props.left ? " left" : " right")}>
      <CSSTransition
        in={activeMenu === "main"}
        unmountOnExit
        timeout={100}
        classNames="menu-primary"
      >
        {props.children}
      </CSSTransition>
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
  isVisualized: boolean;
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
