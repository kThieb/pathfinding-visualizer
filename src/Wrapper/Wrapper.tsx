import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";

interface WrapperProps {
  handleEnter: any;
  timeout: number;
  classNames: string;
  in: boolean;
  unmountOnExit: boolean;
  appear?: boolean;
}

export const WrapperCSSTransition: React.FC<WrapperProps> = ({
  handleEnter,
  ...props
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  // This function calculates the height of a DOM element
  const calcHeight: (isAppearing: boolean) => void = (isAppearing) => {
    const el = nodeRef.current;
    const height: number = el !== null ? el.offsetHeight : 0;
    handleEnter(height);
  };

  return (
    <CSSTransition nodeRef={nodeRef} {...props} onEnter={calcHeight}>
      <div className="menu" ref={nodeRef}>
        {props.children}
      </div>
    </CSSTransition>
  );
};
