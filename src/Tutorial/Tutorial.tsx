import React, { useState } from "react";
import { WrapperCSSTransition } from "../Wrapper/Wrapper";
import "./Tutorial.css";

interface TutorialProps {
  handleDismiss: () => void;
  showTutorial: boolean;
}

export const Tutorial: React.FC<TutorialProps> = (props) => {
  const [activePage, setActivePage] = useState("first-page");
  return (
    <div className={"tutorial-panel " + (props.showTutorial ? "" : "hide")}>
      <WrapperCSSTransition
        in={activePage === "first-page"}
        unmountOnExit
        appear
        timeout={500}
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
            Welcome to the "Rat in a maze" Pathfinding Visualizing tool!
          </h1>
          <div className="emoji-container">
            <span role="img" aria-label="rat" className="tutorial-emoji">
              🐀
            </span>
            <span role="img" aria-label="cheese" className="tutorial-emoji">
              🧀
            </span>
          </div>

          <h3 className="text">
            This is a tool I built to learn more about graph algorithm, and
            particularly Pathfinding Algorithms. There are some cool features
            implemented.
          </h3>
          <span className="how-to-dismiss">
            <h3>
              You can skip this tutorial by clicking on "Dismiss". You can
              reopen this tutorial by click on the "i" button on the top-right
              corner of the grid.
            </h3>
            <img
              className="img"
              alt="bouton informations"
              src={require("./imagesAndGifs/infoButton.png")}
            ></img>
          </span>
          <h2>So without further ado, let's see how it works!</h2>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "second-page"}
        unmountOnExit
        timeout={750}
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
          <h1 className="big-title">The Maze</h1>

          <h3 className="text">
            The maze is composed of squares. Each square is linked to the
            adjacent squares (left, right, top and bottom). The rat in the maze
            is hungry, and it wants to eat all the cheese there is! To do that
            it need to move in the maze. Each move costs 1 point of energy. The
            goal of the rat is to minimize the energy points it will use to eat
            all the cheese. But the maze is full of obstacles!
          </h3>
          <h3>
            The first obstacles are the walls, represented by the thin black
            lines. The rat cannot go through these.
          </h3>
          <img
            src={require("./imagesAndGifs/wall.png")}
            alt="The walls of the maze"
            className="img img-wall"
          ></img>
          <h3>
            The second obstacles are the mud. The mud is different from the
            walls: the rat can go through the mud but it will cost more energy
            than moving through nothing. A normal move costs 1 energy point, a
            move through the mud costs 4 energy points. This is what I call the
            "mud weight".
          </h3>
          <img
            src={require("./imagesAndGifs/mud.png")}
            alt="The light brown mud in the maze"
            className="img img-mud"
          ></img>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "third-page"}
        unmountOnExit
        timeout={750}
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
          <h1 className="big-title">The Algorithms</h1>
          <h3>
            To help the rat find its way through the maze you will have to run
            some algorithms, and visualize them.
          </h3>
          <h3>
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
                solution a lot faster, but the solution may not be optimal.
              </h3>
            </li>
          </ul>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "fourth-page"}
        unmountOnExit
        timeout={750}
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
          <h1 className="big-title">Choosing the Algorithm</h1>

          <h3 className="text">
            You can enable multiple targets in the maze by clicking on the
            button on the top-right corner, and then choose the number of
            targets.
          </h3>
          <img
            src={require("./imagesAndGifs/enableMultipleTargets.gif")}
            alt="enable multiple targets button"
            className="gif gif-multiple-targets"
          ></img>
          <h3>
            You can choose which algorithm you want to run on the dropdown menu
            labeled "Algorithms".
          </h3>
          <img
            src={require("./imagesAndGifs/chooseAlgorithm.gif")}
            alt="The dropdown menu of the algorithms"
            className="gif gif-choose-algorithm"
          ></img>
          <h3>
            Then you can run the visualization with the light blue "Visualize"
            button!
          </h3>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "fifth-page"}
        unmountOnExit
        timeout={750}
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
            menu labeled "Maze Options". You can also choose to hide the "mud
            weight" if you want. <br />
            Then you can generate a new maze with the changed values with the
            "Generate Maze button".
          </h3>
          <img
            src={require("./imagesAndGifs/mazeOptions.gif")}
            alt="The dropdown menu of maze options"
            className="gif gif-maze-options"
          ></img>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "sixth-page"}
        unmountOnExit
        timeout={750}
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
            the rat and hold down the mouse button while moving, and releasing
            the mouse button on the square you want the rat to be on (this is
            essentially like a drag and drop action). The same thing works on
            the cheeses too!
          </h3>
          <img
            src={require("./imagesAndGifs/dragAndDrop.gif")}
            alt="Demonstration of the drag and drop"
            className="gif gif-drag-and-drop"
          ></img>
        </Page>
      </WrapperCSSTransition>
      <WrapperCSSTransition
        in={activePage === "seventh-page"}
        unmountOnExit
        timeout={750}
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
          <div className="emoji-container">
            <span role="img" aria-label="rat" className="tutorial-emoji">
              🐀
            </span>
            <span role="img" aria-label="cheese" className="tutorial-emoji">
              🧀
            </span>
          </div>

          <img
            src={require("./imagesAndGifs/haveFunVisualizing.gif")}
            alt="Have fun!"
            className="gif gif-have-fun"
          ></img>
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
    <div className="page-interieur">
      <div className="page-content">{props.children}</div>
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
