import React, { useState } from "react";
import "./NavBar.css";

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
