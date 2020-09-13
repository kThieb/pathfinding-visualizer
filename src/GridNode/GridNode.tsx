import React from "react";
import "./GridNode.css";
import { node } from "../helperFunctions/usefulInterfaces";
import { ReactComponent as ChevronRightIcon } from "../icon/right-thin-chevron-svgrepo-com.svg";
import { ensure } from "../helperFunctions/ensureNotUndefined";

interface Props {
  numberOfElementsPerRow: number;
  node: node;
  neighbors: [[number, number], number][];
  mouseState: boolean;
  handleMouseDown: (currentNode: node) => void;
  handleMouseEnter: (currentNode: node) => void;
  showNumbers: boolean;
}

const getAddedClassName: (
  neighbors: [[number, number], number][],
  node: node
) => string = (neighbors, node) => {
  let addedClassName: string = "";
  for (let i = 0; i < neighbors.length; i++) {
    let neighbor: [[number, number], number] = neighbors[i];
    let neighborX = neighbor[0][0],
      neighborY = neighbor[0][1],
      distance: number = neighbor[1];
    if (neighborX === node.x + 1)
      addedClassName += distance === 1 ? " no-wall-bottom" : " mud-bottom";
    if (neighborX === node.x - 1)
      addedClassName += distance === 1 ? " no-wall-top" : " mud-top";
    if (neighborY === node.y + 1)
      addedClassName += distance === 1 ? " no-wall-right" : " mud-right";
    if (neighborY === node.y - 1)
      addedClassName += distance === 1 ? " no-wall-left" : " mud-left";
  }
  if (node.hasCheese) addedClassName += " cheese";
  if (node.isShortestPath && node.isVisited)
    addedClassName += " shortest-path-node-being-visited";
  else {
    if (node.isShortestPath) addedClassName += " shortest-path-node";
    if (node.isVisited) addedClassName += " visited-node";
  }
  return addedClassName;
};

// This component represents a single Node in the grid rendered in the DOM
export const _GridNode: React.FC<Props> = ({
  numberOfElementsPerRow,
  node,
  neighbors,
  mouseState,
  handleMouseDown,
  handleMouseEnter,
  showNumbers,
}) => {
  return (
    <div
      className={"grid-node" + getAddedClassName(neighbors, node)}
      onMouseDown={(e) => handleMouseDown(node)}
      onMouseEnter={(e) => handleMouseEnter(node)}
    >
      <span
        role="img"
        className={node.isStart || node.hasCheese ? "content" : "no-content"}
      >
        {(node.isStart ? "🐀" : "") + (node.hasCheese ? "🧀" : "")}
      </span>
      <div className={"svg-chevron " + node.successorPosition}>
        {node.isShortestPath && !(node.isStart || node.hasCheese) ? (
          <ChevronRightIcon />
        ) : (
          <span></span>
        )}
      </div>
      {showNumbers &&
        neighbors.find((neighbor) => neighbor[0][0] === node.x + 1) &&
        ensure(neighbors.find((neighbor) => neighbor[0][0] === node.x + 1))[1] >
          1 && (
          <span className="number-bottom">
            {
              ensure(
                neighbors.find((neighbor) => neighbor[0][0] === node.x + 1)
              )[1]
            }
          </span>
        )}
      {showNumbers &&
        neighbors.find((neighbor) => neighbor[0][1] === node.y + 1) &&
        ensure(neighbors.find((neighbor) => neighbor[0][1] === node.y + 1))[1] >
          1 && (
          <span className="number-right">
            {
              ensure(
                neighbors.find((neighbor) => neighbor[0][1] === node.y + 1)
              )[1]
            }
          </span>
        )}
    </div>
  );
};

const areEqual: (prevProps: Props, nextProps: Props) => boolean = (
  prevProps,
  nextProps
) => {
  return (
    getAddedClassName(prevProps.neighbors, prevProps.node) ===
      getAddedClassName(nextProps.neighbors, nextProps.node) &&
    prevProps.node === nextProps.node &&
    prevProps.mouseState === nextProps.mouseState &&
    prevProps.showNumbers === nextProps.showNumbers
  );
};

export const GridNode = React.memo(_GridNode, areEqual);
