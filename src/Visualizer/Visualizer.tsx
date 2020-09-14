import React, { useEffect, useRef, useState } from "react";
import "./Visualizer.css";
import { Grid } from "../Grid/Grid";
import { NavBar } from "../NavBar/NavBar";

import { node } from "../helperFunctions/usefulInterfaces";
import {
  singleTargetAlgorithms,
  multipleTargetsAlgorithms,
} from "../helperFunctions/shortestPathAlgorithms/allAlgorithms";
import { generateMazeGraph } from "../helperFunctions/mazeGenerators/mazeGraph";
import {
  addPiecesOfCheese,
  constructGrid,
  reconstructGrid,
} from "../helperFunctions/constructGrid";
import { WrapperCSSTransition } from "../Wrapper/Wrapper";
import { Tutorial } from "../Tutorial/Tutorial";
import { NavButton } from "../NavBar/NavButton";
import { DropDownItem } from "../NavBar/DropDownAlgo";
import { DropDownMenu } from "../NavBar/DropDownMenu";
import { DropDownSlider } from "../NavBar/DropDownSlider";
import { DropDownToggleSwich } from "../NavBar/DropDownToggleSwitch";
import { NavItem } from "../NavBar/NavItem";
import { NavSlider } from "../NavBar/NavSlider";
import { InfoButton } from "../Tutorial/InfoButton";
import { EnergyCost } from "../NavBar/EnergyCost";

const NUMBER_OF_COLUMNS: number = 28;
const NUMBER_OF_ROWS: number = 13;
const VISITED_ANIMATION_TIMEOUT: number = 35;
const PATH_ANIMATION_TIMEOUT: number = 125;
const FIRST_START_NODE: [number, number] = [6, 3];
const FIRST_END_NODE: [number, number] = [6, 24];
const FIRST_WALLS_DENSITY: number = 0.4;
const FIRST_MUD_DENSITY: number = 0.4;
const FIRST_MUD_WEIGHT: number = 4;
// We define these constants out of the functional component
// that the App uses to avoid re-running the functions to create
// these each time there is a re-render

const [firstGrid, firstStartNode, firstTargetList] = constructGrid(
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
  FIRST_START_NODE,
  FIRST_END_NODE,
  0
);

const [firstpairGrid, mazeGraph] = generateMazeGraph(
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
  firstGrid,
  FIRST_WALLS_DENSITY,
  FIRST_MUD_DENSITY,
  FIRST_MUD_WEIGHT
);

// Component rendering everything in the webpage.
const Visualizer: React.FC = () => {
  // State managing the tutorial of the project
  const [showTutorial, setShowTutorial] = useState(true);

  const gridRef = useRef(firstGrid);
  // States managing the grid
  const [grid, setGrid] = useState(firstGrid);
  const [pairGrid, setPairGrid] = useState(firstpairGrid);
  const [isVisualized, setIsVisualized] = useState(0);

  // States managing the maze
  const [maze, setMaze] = useState(mazeGraph);
  const [wallsDensity, setWallsDensity] = useState(FIRST_WALLS_DENSITY);
  const [mudDensity, setMudDensity] = useState(FIRST_MUD_DENSITY);
  const [mudWeight, setMudWeight] = useState(FIRST_MUD_WEIGHT);
  const [numberOfTargets, setNumberOfTargets] = useState(1);
  const [shouldGenerateMaze, setShouldGenerateMaze] = useState(false);
  const didMount = useRef(false);
  const [showNumbers, setShowNumbers] = useState(true);

  // States of the start and end nodes
  const [startNode, setStartNode] = useState(firstStartNode);
  const [targetList, setTargetList] = useState(firstTargetList);

  // States managing the dropdown menu
  const [algoActiveMenu, setAlgoActiveMenu] = useState("main-single-target");
  const [singleTargetAlgorithm, setSingleTargetAlgorithm] = useState(
    "Dijkstra's algorithm"
  );
  const [multipleTargetsAlgorithm, setMultipleTargetsAlgorithm] = useState(
    "Nearest Neighbors Heuristic"
  );
  const [showDistance, setShowDistance] = useState(false);
  const [distance, setDistance] = useState(-1);

  const [height, setHeight] = useState(undefined);

  // State of the mouse
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const draggedNode = useRef(startNode);

  // This function is there to visualize the algorithm chosen in the drop down menu
  const visualizeSingleTargetAlgorithm: (
    visited: node[],
    path: node[],
    timeout: number
  ) => number = (visited, path, timeout) => {
    const n = visited.length;
    for (let i: number = 0; i < n; i++) {
      setTimeout(() => {
        const newGrid: node[][] = gridRef.current.slice();
        const node: node = visited[i];
        // define the x and y of the current node
        const x: number = node.x;
        const y: number = node.y;
        newGrid[x][y] = {
          ...gridRef.current[x][y],
          isVisited: true,
        };
        gridRef.current = newGrid;
        setGrid(newGrid);
      }, timeout + VISITED_ANIMATION_TIMEOUT * i);
    }

    const m = path.length;
    for (let i: number = 0; i < m; i++) {
      setTimeout(() => {
        const newGrid: node[][] = gridRef.current.slice();
        const successor: node = i < m - 1 ? path[i + 1] : path[i];
        const node: node = path[i];
        // define the x and y of the current node
        const x: number = node.x;
        const y: number = node.y;

        newGrid[x][y] = {
          ...gridRef.current[x][y],
          isShortestPath: true,
          isVisited: false,
          successorPosition: getSuccessorPosition(node, successor),
        };
        gridRef.current = newGrid;
        setGrid(newGrid);
      }, timeout + VISITED_ANIMATION_TIMEOUT * n + PATH_ANIMATION_TIMEOUT * i + 500);
    }
    return timeout + VISITED_ANIMATION_TIMEOUT * n + PATH_ANIMATION_TIMEOUT * m;
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

  // This function is there to visualize multipleTargetsAlgorithms
  const visualizeMultipleTargetsAlgorithm: (
    allVisitedAndPathsArray: [node[], node[]][]
  ) => number = (allVisitedAndPathsArray) => {
    let n: number = allVisitedAndPathsArray.length;
    let currentTimeout: number = 0;
    for (let i: number = 0; i < n; i++) {
      const [visited, path] = allVisitedAndPathsArray[i];
      currentTimeout = visualizeSingleTargetAlgorithm(
        visited,
        path,
        currentTimeout
      );

      currentTimeout += visited.length > 0 ? 1250 : 0;
      setTimeout(() => {
        const newGrid: node[][] = gridRef.current.slice();
        for (let x: number = 0; x < newGrid.length; x++) {
          for (let y: number = 0; y < newGrid[0].length; y++) {
            newGrid[x][y] = {
              ...gridRef.current[x][y],
              isVisited: false,
            };
          }
        }
        gridRef.current = newGrid;
        setGrid(newGrid);
      }, currentTimeout);
      currentTimeout += 1000;
    }
    return currentTimeout - 1000;
  };

  // This function is passed to the drop down menu to handle the change of algorithm
  const handleAlgorithmChange: (algorithmName: string) => () => void = (
    algorithmName
  ) => {
    return () => {
      numberOfTargets > 1
        ? setMultipleTargetsAlgorithm(algorithmName)
        : setSingleTargetAlgorithm(algorithmName);
    };
  };

  // This function handles the click on the menu buttons
  const handleMenuChange: (menuName: string) => () => void = (menuName) => {
    return () => setAlgoActiveMenu(menuName);
  };

  // This function handles the logic of the visualization of the algorithms
  const handleVisualization: () => void = () => {
    if (isVisualized === 0) {
      setIsVisualized(1);
      if (numberOfTargets === 1) {
        const [[visited, path], newDistance]: [
          [node[], node[]],
          number
        ] = singleTargetAlgorithms[singleTargetAlgorithm](
          grid,
          pairGrid,
          maze,
          startNode,
          targetList.map((targetNode) => grid[targetNode.x][targetNode.y])
        );
        const n: number = visited.length,
          m: number = path.length;
        visualizeSingleTargetAlgorithm(visited, path, 0);
        setTimeout(() => {
          setIsVisualized(2);
          setDistance(newDistance);
          setShowDistance(true);
        }, VISITED_ANIMATION_TIMEOUT * n + PATH_ANIMATION_TIMEOUT * m + 500);
        return;
      }
      const [allVisitedAndPaths, newDistance]: [
        [node[], node[]][],
        number
      ] = multipleTargetsAlgorithms[multipleTargetsAlgorithm](
        grid,
        pairGrid,
        maze,
        startNode,
        targetList.slice()
      );
      const timeout: number = visualizeMultipleTargetsAlgorithm(
        allVisitedAndPaths
      );
      setTimeout(() => {
        setIsVisualized(2);
        setDistance(newDistance);
        setShowDistance(true);
      }, timeout);
    }
    if (isVisualized === 2) {
      reinitializeGrid();
      setShowDistance(false);
    }
  };

  // This function calls the generate maze function
  const generateMaze: () => void = () => {
    if (isVisualized === 0) {
      const [newPairGrid, newMaze] = generateMazeGraph(
        NUMBER_OF_COLUMNS,
        NUMBER_OF_ROWS,
        grid,
        wallsDensity,
        mudDensity,
        mudWeight
      );
      setPairGrid(newPairGrid);
      setMaze(newMaze);
      setShouldGenerateMaze(false);
    }
  };

  // Reinitialize the the board
  const reinitializeGrid: () => void = () => {
    if (isVisualized !== 1) {
      const [newGrid, newStartNode, newTargetList] = reconstructGrid(
        NUMBER_OF_COLUMNS,
        NUMBER_OF_ROWS,
        [startNode.x, startNode.y],
        targetList
      );
      for (let i: number = 0; i < newGrid.length; i++) {
        for (let j: number = 0; j < newGrid[0].length; j++) {
          gridRef.current[i][j] = newGrid[i][j];
        }
      }
      gridRef.current = newGrid;
      setGrid(newGrid);
      setStartNode(newStartNode);
      setTargetList(newTargetList);
      setIsVisualized(0);
    }
  };

  // toggles on and off the multiple targets
  const toggleMultipleTargetGrid: () => void = () => {
    if (isVisualized !== 1) {
      let newGrid, newStartNode, newTargetList;
      if (numberOfTargets > 1) {
        [newGrid, newStartNode, newTargetList] = addPiecesOfCheese(
          NUMBER_OF_COLUMNS,
          NUMBER_OF_ROWS,
          startNode,
          targetList,
          numberOfTargets - targetList.length
        );
        for (let i: number = 0; i < newGrid.length; i++) {
          for (let j: number = 0; j < newGrid[0].length; j++) {
            gridRef.current[i][j] = newGrid[i][j];
          }
        }
      } else {
        [newGrid, newStartNode, newTargetList] = constructGrid(
          NUMBER_OF_COLUMNS,
          NUMBER_OF_ROWS,
          [startNode.x, startNode.y],
          FIRST_END_NODE,
          0
        );
      }
      gridRef.current = newGrid;
      setGrid(newGrid);
      setStartNode(newStartNode);
      setTargetList(newTargetList);
      setIsVisualized(0);
    }
  };

  // If the value of multipleTargets change, call the reinitialize function
  useEffect(toggleMultipleTargetGrid, [numberOfTargets]);

  // handle the change of the number of targets
  const handleChangeNumberOfTargets: (val: any) => void = (val) => {
    setNumberOfTargets(parseInt(val));
  };

  // handle the click on the multiple targets button
  const handleMultipleTargets: () => void = () => {
    if (isVisualized === 0) {
      setAlgoActiveMenu(
        numberOfTargets > 1 ? "main-single-target" : "main-multiple-target"
      );
      setNumberOfTargets(numberOfTargets > 1 ? 1 : 5);
    }
  };

  const handleMudChange: (input: any) => void = (input) => {
    setMudWeight(parseFloat(input));
  };

  // Toggle the cheese or rat on the node
  const toggleNode: (currentNode: node) => void = (currentNode) => {
    let oldStartNode: node = startNode,
      oldTargetList: node[] = targetList.slice();
    if (draggedNode.current === startNode) {
      oldStartNode = currentNode;
    } else {
      const isTargetNode: boolean = targetList.find(
        (targetNode) => targetNode === currentNode
      )
        ? true
        : false;
      if (!isTargetNode) {
        oldTargetList = oldTargetList.filter(
          (targetNode) => targetNode !== draggedNode.current
        );
        oldTargetList.push(currentNode);
      }
    }
    const [newGrid, newStartNode, newTargetList] = reconstructGrid(
      NUMBER_OF_COLUMNS,
      NUMBER_OF_ROWS,
      [oldStartNode.x, oldStartNode.y],
      oldTargetList
    );
    for (let x: number = 0; x < newGrid.length; x++) {
      for (let y: number = 0; y < newGrid[0].length; y++) {
        gridRef.current[x][y] = newGrid[x][y];
      }
    }
    draggedNode.current = newGrid[currentNode.x][currentNode.y];
    setStartNode(newStartNode);
    setTargetList(newTargetList);
    gridRef.current = newGrid;
    setGrid(newGrid);
  };

  // handles the case when the mouse button is down
  const handleMouseDown: (currentNode: node) => void = (currentNode) => {
    const isTargetNode: boolean = targetList.find(
      (targetNode) => targetNode === currentNode
    )
      ? true
      : false;
    if (isVisualized === 0 && (currentNode === startNode || isTargetNode)) {
      setMouseIsPressed(true);
      draggedNode.current = currentNode;
    }
  };

  // handles the case whan the mouse button is down and you enter a node
  const handleMouseEnter: (currentNode: node) => void = (currentNode) => {
    if (mouseIsPressed) {
      toggleNode(currentNode);
    }
  };

  // handles the case when you mouse up
  const handleMouseUp: () => void = () => {
    setMouseIsPressed(false);
  };

  // function that returns the text in the visualization button
  const getVisualizeText: () => string = () => {
    if (isVisualized <= 0)
      return (
        "Visualize " +
        (numberOfTargets > 1
          ? multipleTargetsAlgorithm
          : singleTargetAlgorithm) +
        "!"
      );
    return "Reinitialize Visualization";
  };

  // updates the maze in real time
  useEffect(() => {
    if (didMount.current) setShouldGenerateMaze(true);
    else didMount.current = true;
  }, [wallsDensity, mudDensity, mudWeight]);

  // Render the app
  return (
    <div className="App" onMouseUp={() => handleMouseUp()}>
      <NavBar>
        <NavButton
          text="Generate New Maze"
          isVisualized={isVisualized}
          className={
            "generate-maze " + (shouldGenerateMaze ? "should-generate" : "")
          }
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
          <DropDownMenu left={true}>
            <DropDownSlider
              text="Density of walls:"
              minValue={0}
              maxValue={1}
              step={0.01}
              defaultValue={wallsDensity}
              handleChange={setWallsDensity}
            ></DropDownSlider>
            <DropDownSlider
              text="Density of mud:"
              minValue={0}
              maxValue={1}
              step={0.01}
              defaultValue={mudDensity}
              handleChange={setMudDensity}
            ></DropDownSlider>
            <DropDownSlider
              text="Mud Weight:"
              minValue={1.1}
              maxValue={10}
              step={0.1}
              defaultValue={mudWeight}
              handleChange={handleMudChange}
            ></DropDownSlider>
            <DropDownToggleSwich
              text="Show Mud Weights ?"
              shouldShowWeights={showNumbers}
              handleChange={() => setShowNumbers(!showNumbers)}
            />
          </DropDownMenu>
        </NavItem>
        <NavSlider
          className={
            numberOfTargets > 1 ? "show-nav-slider" : "hide-nav-slider"
          }
          text="Number of Targets:"
          minValue={2}
          maxValue={10}
          step={1}
          defaultValue={numberOfTargets}
          handleChange={handleChangeNumberOfTargets}
          isVisualized={isVisualized}
          visualizingClassName="greyed-out"
          visualizedClassName="greyed-out"
        />

        <NavButton
          text={
            (numberOfTargets > 1 ? "Disable" : "Enable") + " Multiple Targets"
          }
          isVisualized={isVisualized}
          className={
            numberOfTargets > 1
              ? "disable-multiple-targets"
              : "enable-multiple-targets"
          }
          visualizingClassName="greyed-out"
          visualizedClassName="greyed-out"
          handleClick={handleMultipleTargets}
        />
        <EnergyCost distance={distance} showDistance={showDistance} />
        <NavButton
          text={getVisualizeText()}
          isVisualized={isVisualized}
          className="visualize-button"
          visualizingClassName="greyed-out highlight"
          visualizedClassName="highlight"
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
              in={algoActiveMenu === "main-single-target"}
              unmountOnExit
              timeout={500}
              classNames="menu-primary"
              divClassName="menu"
              handleEnter={setHeight}
              appear
            >
              <DropDownItem handleClick={handleMenuChange("unweighted")}>
                <p>Algorithms for unweighted graphs</p>
                <p className="arrow-right">{">"}</p>
              </DropDownItem>
              <DropDownItem handleClick={handleMenuChange("weighted")}>
                <p>Algorithms for weighted graphs</p>
                <p className="arrow-right">{">"}</p>
              </DropDownItem>
            </WrapperCSSTransition>
            <WrapperCSSTransition
              in={algoActiveMenu === "unweighted"}
              unmountOnExit
              timeout={500}
              classNames="menu-unweighted"
              divClassName="menu"
              handleEnter={setHeight}
            >
              <DropDownItem
                handleClick={handleMenuChange("main-single-target")}
              >
                <p className="arrow-left">{"<"}</p>
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange("Depth First Search")}
              >
                <p>Random Depth First Search</p>
                {singleTargetAlgorithm === "Depth First Search" ? (
                  <p className="tickmark">✓</p>
                ) : (
                  ""
                )}
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange("Breadth First Search")}
              >
                <p>Breadth First Search</p>
                {singleTargetAlgorithm === "Breadth First Search" ? (
                  <p className="tickmark">✓</p>
                ) : (
                  ""
                )}
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange("Meet in the Middle BFS")}
              >
                <p>Meet in the Middle BFS</p>
                {singleTargetAlgorithm === "Meet in the Middle BFS" ? (
                  <p className="tickmark">✓</p>
                ) : (
                  ""
                )}
              </DropDownItem>
            </WrapperCSSTransition>
            <WrapperCSSTransition
              in={algoActiveMenu === "weighted"}
              unmountOnExit
              timeout={500}
              classNames="menu-weighted"
              divClassName="menu"
              handleEnter={setHeight}
            >
              <DropDownItem
                handleClick={handleMenuChange("main-single-target")}
              >
                <p className="arrow-left">{"<"}</p>
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange("Dijkstra's algorithm")}
              >
                <p>Dijkstra's Algorithm</p>
                {singleTargetAlgorithm === "Dijkstra's algorithm" ? (
                  <p className="tickmark">✓</p>
                ) : (
                  ""
                )}
              </DropDownItem>
              <DropDownItem handleClick={handleAlgorithmChange("A* algorithm")}>
                <p>A* Algorithm</p>
                {singleTargetAlgorithm === "A* algorithm" ? (
                  <p className="tickmark">✓</p>
                ) : (
                  ""
                )}
              </DropDownItem>
            </WrapperCSSTransition>
            <WrapperCSSTransition
              in={algoActiveMenu === "main-multiple-target"}
              unmountOnExit
              timeout={500}
              classNames="menu-unweighted"
              divClassName="menu"
              handleEnter={setHeight}
            >
              <DropDownItem
                handleClick={handleAlgorithmChange("Brute Force Algorithm")}
              >
                <p>Brute Force Algorithm</p>
                {multipleTargetsAlgorithm === "Brute Force Algorithm" ? (
                  <p className="tickmark">✓</p>
                ) : (
                  ""
                )}
              </DropDownItem>
              <DropDownItem
                handleClick={handleAlgorithmChange(
                  "Nearest Neighbors Heuristic"
                )}
              >
                <p>Nearest Neighbors Heuristic</p>
                {multipleTargetsAlgorithm === "Nearest Neighbors Heuristic" ? (
                  <p className="tickmark">✓</p>
                ) : (
                  ""
                )}
              </DropDownItem>
            </WrapperCSSTransition>
          </DropDownMenu>
        </NavItem>
      </NavBar>

      <Tutorial
        handleDismiss={() => setShowTutorial(false)}
        showTutorial={showTutorial}
      />

      <Grid
        grid={grid}
        pairGrid={pairGrid}
        maze={maze}
        mouseState={mouseIsPressed}
        handleMouseDown={handleMouseDown}
        handleMouseEnter={handleMouseEnter}
        showNumbers={showNumbers}
      >
        <InfoButton
          showTutorial={showTutorial}
          handleClick={() => setShowTutorial(!showTutorial)}
        />
      </Grid>
    </div>
  );
};

export default Visualizer;
