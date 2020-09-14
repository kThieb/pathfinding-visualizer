import React from "react";
import "./NavBar.css";

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
