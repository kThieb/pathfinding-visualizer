import React from "react";
import "./InfoButton.css";

interface InfoButtonProps {
  handleClick: () => void;
  showTutorial: boolean;
}

export const InfoButton: React.FC<InfoButtonProps> = (props) => {
  return (
    <div className="info">
      <button onClick={props.handleClick} className="info-button">
        i
      </button>
      <div>
        <p className="info-tooltip">
          {props.showTutorial ? "Hide" : "Show"} tutorial
        </p>
      </div>
    </div>
  );
};
