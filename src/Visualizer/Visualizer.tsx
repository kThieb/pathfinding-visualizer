import React, { useState } from "react";
import "./Visualizer.css";
import { Grid } from "../Grid/Grid";
import {
  NavBar,
  NavDropDownItem,
  DropDownMenu,
  DropDownAlgo,
  DropDownSlider,
  NavChangingButtonItem,
} from "../NavBar/NavBar";
import { node } from "../helper_functions/usefulInterfaces";
import { algorithms } from "../helper_functions/shortestPathAlgorithms/allAlgorithms";
import {
  createEmptyMazeGraph,
  generateMazeGraph,
} from "../helper_functions/mazeGenerators/mazeGraph";
import { constructGrid } from "../helper_functions/constructGrid";

const NUMBER_OF_ROWS: number = 28;
const NUMBER_OF_COLUMN: number = 13;

// We define these constants out of the functional component
// that the App uses to avoid re-running the functions to create
// these each time there is a re-render
const [firstGrid, firstStartNode, firstEndNode] = constructGrid(
  NUMBER_OF_ROWS,
  NUMBER_OF_COLUMN,
  [6, 3],
  [6, 24]
);

const [firstpairGrid, mazeGraph] = createEmptyMazeGraph(
  NUMBER_OF_ROWS,
  NUMBER_OF_COLUMN,
  firstGrid
);

// Component rendering everything in the webpage.
const Visualizer: React.FC = () => {
  // States managing the grid
  const [grid, setGrid] = useState(firstGrid);
  const [maze, setMaze] = useState(mazeGraph);
  const [pairGrid, setPairGrid] = useState(firstpairGrid);
  const [algorithm, setAlgorithm] = useState("dijkstraWithWalls");
  const [wallsDensity, setWallsDensity] = useState(0.7);
  const [isVisualized, setIsVisualized] = useState(false);
  // const [mouseIsPressed, setMouseIsPressed] = useState(false);

  // States of the start and end node
  const [startNode, setStartNode] = useState(firstStartNode);
  const [endNode, setEndNode] = useState(firstEndNode);

  // This function is there to visualize the algorithm chosen in the drop down menu
  const visualizeAlgorithm: (visited: node[], path: node[]) => void = (
    visited,
    path
  ) => {
    const n = visited.length;
    for (let i: number = 0; i < n; i++) {
      setTimeout(() => {
        const newGrid = grid.slice();
        const node = visited[i];
        // define the x and y of the current node
        const x: number = node.x;
        const y: number = node.y;
        const newNode: node = {
          ...node,
          isVisited: true,
        };
        newGrid[x][y] = newNode;
        setGrid(newGrid);
      }, 35 * i);
    }

    const m = path.length;
    for (let i: number = 0; i < m; i++) {
      setTimeout(() => {
        const newGrid = grid.slice();
        const node = path[i];
        // define the x and y of the current node
        const x: number = node.x;
        const y: number = node.y;
        const newNode: node = {
          ...node,
          isVisited: false,
          isShortestPath: true,
        };
        newGrid[x][y] = newNode;
        setGrid(newGrid);
      }, 35 * n + 75 * i);
    }
  };

  // This function is passed to the drop down menu to handle the change of algorithm
  const handleAlgorithmChange: (algorithmName: string) => void = (
    algorithmName
  ) => {
    setAlgorithm(algorithmName);
  };

  // This function changes the algorithm that will be run, at the moment only dijkstra is implemented
  const chooseAlgorithm: () => (
    grid: node[][],
    pairGrid: [number, number][][],
    mazeGraph: Map<[number, number], [number, number][]>,
    startNode: node,
    endNode: node
  ) => [node[], node[]] = () => {
    return algorithms[algorithm];
  };

  // This function calls the generate maze function
  const generateMaze: () => void = () => {
    if (!isVisualized) {
      const newGrid = grid.slice();
      const [newPairGrid, newMaze] = generateMazeGraph(
        NUMBER_OF_ROWS,
        NUMBER_OF_COLUMN,
        newGrid,
        wallsDensity
      );
      setGrid(newGrid);
      setPairGrid(newPairGrid);
      setMaze(newMaze);
    }
  };

  // Reinitialize the the board
  const reinitialize: () => void = () => {
    const [newGrid, newStartNode, newEndNode] = constructGrid(
      NUMBER_OF_ROWS,
      NUMBER_OF_COLUMN,
      [startNode.x, startNode.y],
      [endNode.x, endNode.y]
    );
    const [newPairGrid, newMaze] = createEmptyMazeGraph(
      NUMBER_OF_ROWS,
      NUMBER_OF_COLUMN,
      newGrid
    );
    setGrid(newGrid);
    setPairGrid(newPairGrid);
    setMaze(newMaze);
    setStartNode(newStartNode);
    setEndNode(newEndNode);
    setIsVisualized(false);
  };

  // The following block of functions handles the making of walls in the grid
  // This feature is currently not used as it is not a good fit with the current direction of the app

  // const toggleWall: (x: number, y: number) => void = (x, y) => {
  //   const newGrid: node[][] = grid.slice();
  //   let newNode;
  //   if (!newGrid[x][y].isWall) {
  //     newNode = {
  //       ...newGrid[x][y],
  //       isWall: !newGrid[x][y].isWall,
  //       className: "grid-node wall-node",
  //     };
  //   } else {
  //     newNode = {
  //       ...newGrid[x][y],
  //       isWall: !newGrid[x][y].isWall,
  //       className: "grid-node",
  //     };
  //   }
  //   newGrid[x][y] = newNode;
  //   setGrid(newGrid);
  // };

  // // handles the case when the mouse button is down
  // const handleMouseDown: (x: number, y: number) => void = (x, y) => {
  //   toggleWall(x, y);
  //   setMouseIsPressed(false);
  // };

  // // handles the case whan the mouse button is down and you enter a node
  // const handleMouseEnter: (x: number, y: number) => void = (x, y) => {
  //   if (mouseIsPressed) {
  //     toggleWall(x, y);
  //   }
  // };

  // // handles the case when you mouse up
  // const handleMouseUp: () => void = () => {
  //   setMouseIsPressed(false);
  // };

  // Render the app
  return (
    <div className="App">
      <NavBar>
        <NavChangingButtonItem
          isVisualized={isVisualized}
          className="reinitialize"
          visualizedClassName="highlight"
          handleClick={reinitialize}
        >
          Reinitialize
        </NavChangingButtonItem>
        <NavChangingButtonItem
          isVisualized={isVisualized}
          className="generate-maze"
          visualizedClassName="greyed-out"
          handleClick={generateMaze}
        >
          Generate maze
        </NavChangingButtonItem>
        <NavDropDownItem
          text="Maze options"
          id="maze-options"
          isVisualized={isVisualized}
          shouldGreyOut={true}
        >
          <DropDownMenu>
            <DropDownSlider
              isVisualized={isVisualized}
              minValue={0.1}
              maxValue={1}
              defaultValue={wallsDensity}
              text="Density of walls"
              handleChangeWallsDensity={setWallsDensity}
            ></DropDownSlider>
          </DropDownMenu>
        </NavDropDownItem>
        <NavChangingButtonItem
          isVisualized={isVisualized}
          className="visualize-button"
          visualizedClassName="greyed-out"
          handleClick={() => {
            if (!isVisualized) {
              visualizeAlgorithm(
                ...chooseAlgorithm()(grid, pairGrid, maze, startNode, endNode)
              );
              setIsVisualized(true);
            }
          }}
        >
          Visualize!
        </NavChangingButtonItem>
        <NavDropDownItem
          text="Algorithm"
          id="algorithms"
          isVisualized={isVisualized}
          shouldGreyOut={false}
        >
          <DropDownMenu>
            <DropDownAlgo
              changeAlgorithm={handleAlgorithmChange}
              algorithmName="dijkstraWithWalls"
            >
              <p>Dijkstra's Algorithm</p>
              {algorithm === "dijkstraWithWalls" ? <p>✓</p> : ""}
            </DropDownAlgo>
            {/* <DropDownAlgo
              changeAlgorithm={handleAlgorithmChange}
              algorithmName="A*"
            >
              A* Algorithm
            </DropDownAlgo> */}
          </DropDownMenu>
        </NavDropDownItem>
      </NavBar>
      {/* <SecondaryHeader>
        <button
          className="visualize-button"
          onClick={(e) => {
            visualizeAlgorithm(
              ...chooseAlgorithm(algorithm)(
                grid,
                pairGrid,
                mazeGraph,
                startNode,
                endNode
              )
            );
          }}
        >
          Visualize the path!
        </button>
      </SecondaryHeader> */}
      <Grid grid={grid} pairGrid={pairGrid} maze={maze} />
    </div>
  );
};

export default Visualizer;
