import React, { useState } from "react";
import { WrapperCSSTransition } from "../Wrapper/Wrapper";
import "./Tutorial.css";

interface TutorialProps {
  handleDismiss: () => void;
}

export const Tutorial: React.FC<TutorialProps> = (props) => {
  const [activePage, setActivePage] = useState("first-page");
  return (
    <div className="tutorial-panel">
      <WrapperCSSTransition
        in={activePage === "first-page"}
        unmountOnExit
        timeout={0}
        classNames="page-container"
        divClassName={"first-page page"}
        handleEnter={() => {}}
      >
        <Page
          leftButton={false}
          rightButton={true}
          rightOnClick={() => setActivePage("second-page")}
          handleDismiss={props.handleDismiss}
        >
          <h1 className="big-title">
            Welcome to the "Rat in a maze" Pathfinding Visulazing tool!
          </h1>
          <div className="emoji-container">
            <span role="img" aria-label="rat" className="tutorial-emoji">
              🐀
            </span>
            <span role="img" aria-label="cheese" className="tutorial-emoji">
              🧀
            </span>
          </div>
          <span>
            <h3 className="text">
              This is a tool I built to learn more about graph algorithm, and
              particularly Pathfinding Algorithms. There are some cool features
              in this tool.
            </h3>
            <h2>So without further ado, let's dive into how it works!</h2>
          </span>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "second-page"}
        unmountOnExit
        timeout={0}
        classNames="page-container"
        divClassName={"second-page page"}
        handleEnter={() => {}}
      >
        <Page
          leftButton
          rightButton
          leftOnClick={() => setActivePage("first-page")}
          rightOnClick={() => setActivePage("third-page")}
          handleDismiss={props.handleDismiss}
        >
          <h1 className="big-title">The Maze.</h1>

          <h3 className="text">
            The maze is composed of squares. Each square is linked to the
            adjacent squares (left, right, top and bottom). The rat in the maze
            is hungry, and it wants to eat all the cheese there is! to do that
            it need to move in the maze. Each move costs 1 point of energy. The
            goal of the rat is to minimize the energy points it will use to eat
            all the cheese. But the maze is full of obstacles!
          </h3>
          <h3>
            The first obstacles are the walls, the rat cannot go through those
            thin black walls.
          </h3>
          <img alt="The walls of the maze"></img>
          <h3>
            The second obstacles are the mud. The mud is different from the
            walls: the rat can go through the mud but it will cost more energy
            than moving through nothing. A normal move costs 1 energy point, a
            move through the mud costs 4 energy points. This is what I call the
            "mud weight".
          </h3>
          <img alt="The light brown mud in the maze"></img>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "third-page"}
        unmountOnExit
        timeout={0}
        classNames="page-container"
        divClassName={"third-page page"}
        handleEnter={() => {}}
      >
        <Page
          leftButton
          rightButton
          leftOnClick={() => setActivePage("second-page")}
          rightOnClick={() => setActivePage("fourth-page")}
          handleDismiss={props.handleDismiss}
        >
          <h1 className="big-title">The Algorithms.</h1>
          <h3 className="text">
            To help the rat find its way through the maze you will have to run
            some algorithms, and visulaze them.
          </h3>
          <h3 className="text">
            For a single cheese (or target), there are 2 types of algorithms:
          </h3>
          <ul>
            <li>
              <h3>
                The algorithms for unweighted graphs, which will find a way to
                the cheese while ignoring the added cost of going through mud
                (these will not guarantee the shortest path),
              </h3>
            </li>
            <li>
              <h3>
                And the algorithms for weighted graphs, which will take into
                account the added cost of going through mud. In this tool, the
                algorithms implemented will always find the shortest path
                between the rat and the cheese (or the path of lowest energy
                cost).
              </h3>
            </li>
          </ul>

          <h3>
            In the case where there are several cheeses, there are 2 possible
            algorithms in this tool:
          </h3>
          <ul>
            <li>
              <h3>
                The brute force algorithm, that will find the optimal solution,
                at the cost of a lot of computations,
              </h3>
            </li>
            <li>
              <h3>
                And the nearest neighbors heuristic algorithm which will find a
                solution a lot faster but, the solution may not be optimal.
              </h3>
            </li>
          </ul>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "fourth-page"}
        unmountOnExit
        timeout={0}
        classNames="page-container"
        divClassName={"fourth-page page"}
        handleEnter={() => {}}
      >
        <Page
          leftButton
          rightButton
          leftOnClick={() => setActivePage("third-page")}
          rightOnClick={() => setActivePage("fifth-page")}
          handleDismiss={props.handleDismiss}
        >
          <h1 className="big-title">Choosing the Algorithm.</h1>

          <h3 className="text">
            You can enable multiple targets in the maze by clicking on the
            button on the top-right corner. You can choose which algorithm you
            want to run on the dropdown menu labeled "Algorithms".
          </h3>
          <img
            src=""
            alt="The dropdown menu of the algorithms"
            className="gid"
          ></img>
          <h3>
            Then you can run the visualization with the light blue "Visualize"
            button!
          </h3>
          <img alt="The visualize button being clicked"></img>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "fifth-page"}
        unmountOnExit
        timeout={0}
        classNames="page-container"
        divClassName={"fifth-page page"}
        handleEnter={() => {}}
      >
        <Page
          leftButton
          rightButton
          leftOnClick={() => setActivePage("fourth-page")}
          rightOnClick={() => setActivePage("sixth-page")}
          handleDismiss={props.handleDismiss}
        >
          <h1 className="big-title">Maze Generator</h1>

          <h3 className="text">
            You can choose different options regarding the maze in the dropdown
            menu labeled "Maze Options".
          </h3>
          <img
            src={require("../icon/maze-options.gif")}
            alt="The dropdown menu of maze options"
            className="gif"
          ></img>
          <h3>
            Then you can generate a new maze with the changed values with the
            "Generate Maze button"
          </h3>
          <img alt="Generate maze button"></img>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "sixth-page"}
        unmountOnExit
        timeout={0}
        classNames="page-container"
        divClassName={"sixth-page page"}
        handleEnter={() => {}}
      >
        <Page
          leftButton
          rightButton
          leftOnClick={() => setActivePage("fifth-page")}
          rightOnClick={() => setActivePage("seventh-page")}
          handleDismiss={props.handleDismiss}
        >
          <h1 className="big-title">The Rat and the cheeses</h1>

          <h3 className="text">
            The last thing you need to know is that you can move the rat and the
            cheese around before visualizing an algorithm! You have to click on
            the rat and hold the button while moving, and releasing the mouse
            button on the square you want the rat on (this is essentially like
            drag and drop). The same thing works on the cheeses too!
          </h3>
          <img alt="Demonstration of the drag and drop"></img>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "seventh-page"}
        unmountOnExit
        timeout={0}
        classNames="page-container"
        divClassName={"seventh-page page"}
        handleEnter={() => {}}
      >
        <Page
          leftButton
          rightButton={false}
          leftOnClick={() => setActivePage("sixth-page")}
          handleDismiss={props.handleDismiss}
        >
          <h1 className="big-title">Have fun using this tool!</h1>
          <img alt="Have fun!"></img>
        </Page>
      </WrapperCSSTransition>
    </div>
  );
};

interface PageProps {
  leftButton: boolean;
  rightButton: boolean;
  leftOnClick?: () => void;
  rightOnClick?: () => void;
  handleDismiss: () => void;
}

const Page: React.FC<PageProps> = (props) => {
  return (
    <div className="page">
      {props.children}
      {props.leftButton && (
        <button className="button button-prev" onClick={props.leftOnClick}>
          {"<"} Previous
        </button>
      )}
      {props.rightButton && (
        <button className="button button-next" onClick={props.rightOnClick}>
          Next {">"}
        </button>
      )}
      <button className="button dismiss-button" onClick={props.handleDismiss}>
        Dismiss
      </button>
    </div>
  );
};
