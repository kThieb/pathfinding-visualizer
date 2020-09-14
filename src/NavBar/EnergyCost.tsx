import React from "react";
import "./NavBar.css";

interface EnergyCostProps {
  distance: number;
  showDistance: boolean;
}

export const EnergyCost: React.FC<EnergyCostProps> = (props) => {
  return (
    <div
      className={
        "distance " + (props.showDistance ? "show-distance" : "hide-distance")
      }
    >
      <span>The path's energy cost is {props.distance.toFixed(2)}</span>
    </div>
  );
};
