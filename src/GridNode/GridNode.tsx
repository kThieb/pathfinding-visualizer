import React from "react";
import "./GridNode.css";
import { node } from "../helperFunctions/usefulInterfaces";

interface Props {
  numberOfElementsPerRow: number;
  node: node;
  neighbors: [[number, number], number][];
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
  if (node.isShortestPath) addedClassName += " shortest-path-node";
  if (node.isVisited) addedClassName += " visited-node";
  return addedClassName;
};

// This component represents a single Node in the grid rendered in the DOM
export const _GridNode: React.FC<Props> = ({
  numberOfElementsPerRow,
  node,
  neighbors,
}) => {
  const addEmoji: (node: node) => any = (node) => {
    if (node.isStart) {
      return (
        <span role="img" aria-label="rat" className="content">
          🐀
        </span>
      );
    }
    if (node.isEnd) {
      return (
        <span role="img" aria-label="rat" className="content">
          🧀
        </span>
      );
    }
    return <span></span>;
  };

  return (
    <div className={"grid-node" + getAddedClassName(neighbors, node)}>
      {addEmoji(node)}
    </div>
  );
};

const areEqual: (prevProps: Props, nextProps: Props) => boolean = (
  prevProps,
  nextProps
) => {
  return (
    prevProps.node.isVisited === nextProps.node.isVisited &&
    prevProps.node.isShortestPath === nextProps.node.isShortestPath &&
    getAddedClassName(prevProps.neighbors, prevProps.node) ===
      getAddedClassName(nextProps.neighbors, nextProps.node)
  );
};

export const GridNode = React.memo(_GridNode, areEqual);
