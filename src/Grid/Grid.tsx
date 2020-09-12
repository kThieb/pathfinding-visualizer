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
  handleMouseDown: (x: number, y: number) => void;
  handleMouseEnter: (x: number, y: number) => void;
}

export const Grid: React.FC<Props> = ({
  grid,
  maze,
  pairGrid,
  mouseState,
  handleMouseDown,
  handleMouseEnter,
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
              ></GridNode>
            ))}
          </div>
        );
      })}
    </div>
  );
};
