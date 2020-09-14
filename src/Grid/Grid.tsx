import React from "react";
import { GridNode } from "../GridNode/GridNode";
import "./Grid.css";
import { node } from "../helperFunctions/usefulInterfaces";
import { ensure } from "../helperFunctions/ensureNotUndefined";

interface Props {
  grid: node[][];
  maze: Map<[number, number], [[number, number], number][]>;
  pairGrid: [number, number][][];
  mouseState: boolean;
  handleMouseDown: (currentNode: node) => void;
  handleMouseEnter: (currentNode: node) => void;
  showNumbers: boolean;
}

export const Grid: React.FC<Props> = ({
  grid,
  maze,
  pairGrid,
  mouseState,
  handleMouseDown,
  handleMouseEnter,
  showNumbers,
  children,
}) => {
  // Renders the grid in the DOM thanks to the grid state in the App component
  return (
    <div className="grid">
      {grid.map((row, id) => {
        let rowLength = row.length;
        return (
          <div className="row" key={id}>
            {row.map((node, index) => (
              <GridNode
                numberOfElementsPerRow={rowLength}
                key={id + index * rowLength}
                node={node}
                neighbors={ensure(maze.get(pairGrid[node.x][node.y]))}
                mouseState={mouseState}
                handleMouseDown={handleMouseDown}
                handleMouseEnter={handleMouseEnter}
                showNumbers={showNumbers}
              ></GridNode>
            ))}
          </div>
        );
      })}
      {children}
    </div>
  );
};
