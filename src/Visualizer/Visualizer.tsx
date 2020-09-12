import React, { useState } from "react";
import "./Visualizer.css";
import { Grid } from "../Grid/Grid";
import {
  NavBar,
  NavItem,
  DropDownMenu,
  DropDownItem,
  DropDownSlider,
  NavButton,
} from "../NavBar/NavBar";
import { node } from "../helperFunctions/usefulInterfaces";
import { algorithms } from "../helperFunctions/shortestPathAlgorithms/allAlgorithms";
import { generateMazeGraph } from "../helperFunctions/mazeGenerators/mazeGraph";
import { constructGrid } from "../helperFunctions/constructGrid";
import { WrapperCSSTransition } from "../Wrapper/Wrapper";

const NUMBER_OF_COLUMNS: number = 28;
const NUMBER_OF_ROWS: number = 13;
const VISITED_ANIMATION_TIMEOUT: number = 35;
const PATH_ANIMATION_TIMEOUT: number = 80;

// We define these constants out of the functional component
// that the App uses to avoid re-running the functions to create
// these each time there is a re-render
const [firstGrid, firstStartNode, firstEndNode] = constructGrid(
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
  [6, 3],
  [6, 24]
);

const [firstpairGrid, mazeGraph] = generateMazeGraph(
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
  firstGrid,
  0.3,
  0.3,
  5
);

// Component rendering everything in the webpage.
const Visualizer: React.FC = () => {
  // States managing the grid
  const [grid, setGrid] = useState(firstGrid);
  const [maze, setMaze] = useState(mazeGraph);
  const [pairGrid, setPairGrid] = useState(firstpairGrid);
  const [algorithm, setAlgorithm] = useState("Dijkstra's algorithm");
  const [wallsDensity, setWallsDensity] = useState(0.3);
  const [mudDensity, setMudDensity] = useState(0.3);
  const [isVisualized, setIsVisualized] = useState(0);
  const [mudWeight, setMudWeight] = useState(3);

  // States of the start and end node
  const [startNode, setStartNode] = useState(firstStartNode);
  const [endNodeList, setEndNodeList] = useState([firstEndNode]);

  // States managing the dropdown menu
  const [algoActiveMenu, setAlgoActiveMenu] = useState("main");
  const [height, setHeight] = useState(undefined);

  // State of the mouse
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  // This function is there to visualize the algorithm chosen in the drop down menu
  const visualizeAlgorithm: (visited: node[], path: node[]) => void = (
    visited,
    path
  ) => {
    const n = visited.length;
    for (let i: number = 0; i < n; i++) {
      setTimeout(() => {
        const newGrid: node[][] = grid.slice();
        const node: node = visited[i];
        // define the x and y of the current node
        const x: number = node.x;
        const y: number = node.y;
        const newNode: node = {
          ...node,
          isVisited: true,
        };
        newGrid[x][y] = newNode;
        setGrid(newGrid);
      }, VISITED_ANIMATION_TIMEOUT * i);
    }

    const m = path.length;
    for (let i: number = 0; i < m; i++) {
      setTimeout(() => {
        const newGrid: node[][] = grid.slice();
        let successor: node = i < m - 1 ? path[i + 1] : path[i];
        const node: node = path[i];
        // define the x and y of the current node
        const x: number = node.x;
        const y: number = node.y;

        const newNode: node = {
          ...node,
          isVisited: false,
          isShortestPath: true,
          successorPosition: getSuccessorPosition(node, successor),
        };
        newGrid[x][y] = newNode;
        setGrid(newGrid);
      }, VISITED_ANIMATION_TIMEOUT * n + PATH_ANIMATION_TIMEOUT * i);
    }
  };

  // This function returns the position of the successor of a node in the shortest path
  const getSuccessorPosition: (node: node, successor: node) => string = (
    node,
    successor
  ) => {
    if (node.x + 1 === successor.x) return "D";
    if (node.y + 1 === successor.y) return "R";
    if (node.x - 1 === successor.x) return "U";
    if (node.y - 1 === successor.y) return "L";
    return "";
  };

  // This function is passed to the drop down menu to handle the change of algorithm
  const handleAlgorithmChange: (algorithmName: string) => () => void = (
    algorithmName
  ) => {
    return () => {
      setAlgorithm(algorithmName);
    };
  };

  // This function handles the click on the menu buttons
  const handleMenuChange: (menuName: string) => () => void = (menuName) => {
    return () => setAlgoActiveMenu(menuName);
  };

  // This function changes the algorithm that will be run, at the moment only dijkstra is implemented
  const chooseAlgorithm: () => (
    grid: node[][],
    pairGrid: [number, number][][],
    mazeGraph: Map<[number, number], [[number, number], number][]>,
    startNode: node,
    endNode: node
  ) => [node[], node[]] = () => {
    return algorithms[algorithm];
  };

  // This function handles the logic of the visualization of the algorithms
  const handleVisualization: () => void = () => {
    if (isVisualized === 0) {
      setIsVisualized(1);
      const [visited, path]: [node[], node[]] = chooseAlgorithm()(
        grid,
        pairGrid,
        maze,
        startNode,
        endNodeList[0]
      );
      const n: number = visited.length,
        m: number = path.length;
      visualizeAlgorithm(visited, path);
      setTimeout(() => {
        setIsVisualized(2);
      }, VISITED_ANIMATION_TIMEOUT * n + PATH_ANIMATION_TIMEOUT * m);
    }
  };

  // This function calls the generate maze function
  const generateMaze: () => void = () => {
    if (isVisualized === 0) {
      const newGrid = grid.slice();
      const [newPairGrid, newMaze] = generateMazeGraph(
        NUMBER_OF_COLUMNS,
        NUMBER_OF_ROWS,
        newGrid,
        wallsDensity,
        mudDensity,
        mudWeight
      );
      setGrid(newGrid);
      setPairGrid(newPairGrid);
      setMaze(newMaze);
    }
  };

  // Reinitialize the the board
  const reinitializeGrid: () => void = () => {
    if (isVisualized === 2) {
      const [newGrid, newStartNode, newEndNode] = constructGrid(
        NUMBER_OF_COLUMNS,
        NUMBER_OF_ROWS,
        [startNode.x, startNode.y],
        [endNodeList[0].x, endNodeList[0].y]
      );
      setGrid(newGrid);
      setStartNode(newStartNode);
      setEndNodeList([newEndNode]);
      setIsVisualized(0);
    }
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

  const toggleStartNode: (x: number, y: number) => void = (x, y) => {
    const [newGrid, newStartNode, newEndNode] = constructGrid(
      NUMBER_OF_COLUMNS,
      NUMBER_OF_ROWS,
      [x, y],
      [endNodeList[0].x, endNodeList[0].y]
    );
    setStartNode(newStartNode);
    setEndNodeList([newEndNode]);
    setGrid(newGrid);
  };

  // handles the case when the mouse button is down
  const handleMouseDown: (x: number, y: number) => void = (x, y) => {
    if (grid[x][y] === startNode) {
      console.log("mouse is pressed");
      setMouseIsPressed(true);
    }
  };

  // handles the case whan the mouse button is down and you enter a node
  const handleMouseEnter: (x: number, y: number) => void = (x, y) => {
    if (mouseIsPressed) {
      console.log("entered");
      toggleStartNode(x, y);
    }
  };

  // handles the case when you mouse up
  const handleMouseUp: () => void = () => {
    console.log("mouse is up!");
    setMouseIsPressed(false);
  };

  // Render the app
  return (
    <div className="App" onMouseUp={() => handleMouseUp()}>
      <NavBar>
        <NavButton
          text="Reinitialize"
          isVisualized={isVisualized}
          className="reinitialize"
          startClassName="greyed-out"
          visualizingClassName="greyed-out"
          visualizedClassName="highlight"
          handleClick={reinitializeGrid}
        />
        <NavButton
          text="Generate Maze"
          isVisualized={isVisualized}
          className="generate-maze"
          visualizingClassName="greyed-out"
          visualizedClassName="greyed-out"
          handleClick={generateMaze}
        />
        <NavItem
          text="Maze options"
          id="maze-options"
          isVisualized={isVisualized}
          shouldGreyOut={true}
        >
          <DropDownMenu>
            <DropDownSlider
              text="Density of walls"
              minValue={0}
              maxValue={1}
              step={0.01}
              defaultValue={wallsDensity}
              handleChange={setWallsDensity}
            ></DropDownSlider>
            <DropDownSlider
              text="Density of mud"
              minValue={0}
              maxValue={1}
              step={0.01}
              defaultValue={mudDensity}
              handleChange={setMudDensity}
            ></DropDownSlider>
            <DropDownSlider
              text="Mud Weight"
              minValue={1}
              maxValue={5}
              step={1}
              defaultValue={mudWeight}
              handleChange={setMudWeight}
            ></DropDownSlider>
          </DropDownMenu>
        </NavItem>
        <NavButton
          text={"Visualize " + algorithm + "!"}
          isVisualized={isVisualized}
          className="visualize-button"
          visualizingClassName="greyed-out"
          visualizedClassName="greyed-out"
          handleClick={handleVisualization}
        />
        <NavItem
          text="Algorithms"
          id="algorithms"
          isVisualized={isVisualized}
          shouldGreyOut={false}
        >
          <DropDownMenu height={height}>
            <WrapperCSSTransition
              in={algoActiveMenu === "main"}
              unmountOnExit
              timeout={500}
              classNames="menu-primary"
              handleEnter={setHeight}
              appear
            >
              <DropDownItem handleClick={handleMenuChange("unweighted")}>
                Algorithms for unweighted graphs
              </DropDownItem>
              <DropDownItem handleClick={handleMenuChange("weighted")}>
                Algorithms for weighted graphs
              </DropDownItem>
            </WrapperCSSTransition>
            <WrapperCSSTransition
              in={algoActiveMenu === "unweighted"}
              unmountOnExit
              timeout={500}
              classNames="menu-unweighted"
              handleEnter={setHeight}
            >
              <DropDownItem handleClick={handleMenuChange("main")}>
                {"<<<"}
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange("Depth First Search")}
              >
                <p>Random Depth First Search</p>
                {algorithm === "Depth First Search" ? <p>✓</p> : ""}
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange("Breadth First Search")}
              >
                <p>Breadth First Search</p>
                {algorithm === "Breadth First Search" ? <p>✓</p> : ""}
              </DropDownItem>
            </WrapperCSSTransition>
            <WrapperCSSTransition
              in={algoActiveMenu === "weighted"}
              unmountOnExit
              timeout={500}
              classNames="menu-weighted"
              handleEnter={setHeight}
            >
              <DropDownItem handleClick={handleMenuChange("main")}>
                {"<<<"}
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange("Dijkstra's algorithm")}
              >
                <p>Dijkstra's Algorithm</p>
                {algorithm === "Dijkstra's algorithm" ? <p>✓</p> : ""}
              </DropDownItem>
              <DropDownItem handleClick={handleAlgorithmChange("A* algorithm")}>
                <p>A* Algorithm</p>
                {algorithm === "A* algorithm" ? <p>✓</p> : ""}
              </DropDownItem>
            </WrapperCSSTransition>
          </DropDownMenu>
        </NavItem>
      </NavBar>

      <Grid
        grid={grid}
        pairGrid={pairGrid}
        maze={maze}
        mouseState={mouseIsPressed}
        handleMouseDown={handleMouseDown}
        handleMouseEnter={handleMouseEnter}
      />
    </div>
  );
};

export default Visualizer;
