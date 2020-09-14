import React from "react";
import "./NavBar.css";

export const NavBar: React.FC = (props) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
};
