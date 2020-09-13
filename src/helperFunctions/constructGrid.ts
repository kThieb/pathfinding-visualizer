import { node } from "./usefulInterfaces";

// This function (Not a React Component!) is made to initialize the grid rendered in the App component.
export const constructGrid: (
  numberOfRows: number,
  numberOfColumn: number,
  startNode: [number, number],
  endNode: [number, number],
  numberOfTargets: number
) => [node[][], node, node[]] = (
  numberOfRow,
  numberOfColumn,
  startNode,
  endNode,
  numberOfTargets
) => {
  let result: node[][] = [];
  for (let i: number = 0; i < numberOfColumn; i++) {
    let currentRow: node[] = [];
    for (let j: number = 0; j < numberOfRow; j++) {
      let currentNode: node = {
        id: i + j * numberOfColumn,
        x: i,
        y: j,
        isStart: false,
        hasCheese: false,
        hasRat: false,
        isVisited: false,
        isShortestPath: false,
        successorPosition: "",
      };
      currentRow.push(currentNode);
    }
    result.push(currentRow);
  }
  result[startNode[0]][startNode[1]].isStart = true;
  result[startNode[0]][startNode[1]].hasRat = true;
  result[endNode[0]][endNode[1]].hasCheese = true;
  let targetList: node[] = [result[endNode[0]][endNode[1]]];
  if (numberOfTargets >= 1)
    [result, targetList] = piecesOfCheese(
      result,
      startNode,
      endNode,
      numberOfTargets
    );
  return [result, result[startNode[0]][startNode[1]], targetList];
};

export const reconstructGrid: (
  numberOfRows: number,
  numberOfColumn: number,
  startNode: [number, number],
  targetList: node[]
) => [node[][], node, node[]] = (
  numberOfRow,
  numberOfColumn,
  startNode,
  targetList
) => {
  let result: node[][] = [];
  for (let i: number = 0; i < numberOfColumn; i++) {
    let currentRow: node[] = [];
    for (let j: number = 0; j < numberOfRow; j++) {
      let currentNode: node = {
        id: i + j * numberOfColumn,
        x: i,
        y: j,
        isStart: false,
        hasCheese: targetList.find(
          (targetNode) => targetNode.x === i && targetNode.y === j
        )
          ? true
          : false,
        hasRat: false,
        isVisited: false,
        isShortestPath: false,
        successorPosition: "",
      };
      currentRow.push(currentNode);
    }
    result.push(currentRow);
  }
  result[startNode[0]][startNode[1]].isStart = true;
  result[startNode[0]][startNode[1]].hasRat = true;
  let newTargetList: node[] = targetList.map(
    (targetNode) => result[targetNode.x][targetNode.y]
  );
  return [result, result[startNode[0]][startNode[1]], newTargetList];
};

const piecesOfCheese: (
  grid: node[][],
  startNode: [number, number],
  endNode: [number, number],
  cheeseNum: number
) => [node[][], node[]] = (grid, startNode, endNode, cheeseNum) => {
  const n: number = grid.length,
    m: number = grid[0].length;
  const targetList: node[] = [grid[endNode[0]][endNode[1]]];
  let visited: boolean[][] = new Array(n);
  for (let i: number = 0; i < n; ++i) {
    visited[i] = new Array(m);
  }
  for (let i: number = 0; i < n; ++i) {
    for (let j: number = 0; j < m; ++j) {
      visited[i][j] = false;
    }
  }

  visited[startNode[0]][startNode[1]] = true;
  visited[endNode[0]][endNode[1]] = true;
  for (let k: number = 0; k < cheeseNum; k++) {
    let i = -1,
      j = -1;
    do {
      i = Math.floor(Math.random() * n);
      j = Math.floor(Math.random() * m);
    } while (visited[i][j]);
    visited[i][j] = true;
    grid[i][j].hasCheese = true;
    targetList.push(grid[i][j]);
  }
  return [grid, targetList];
};

export const addPiecesOfCheese: (
  numberOfRows: number,
  numberOfColumn: number,
  startNode: node,
  oldTargetList: node[],
  cheeseToAdd: number
) => [node[][], node, node[]] = (
  numberOfRows,
  numberOfColumn,
  startNode,
  oldTargetList,
  cheeseToAdd
) => {
  // let targetList: node[] = [];
  while (cheeseToAdd < 0) {
    let randIndex: number = Math.floor(Math.random() * oldTargetList.length);
    oldTargetList = oldTargetList.filter(
      (targetNode, index) => index !== randIndex
    );
    cheeseToAdd++;
  }

  const [newGrid, newStartNode, targetList] = reconstructGrid(
    numberOfRows,
    numberOfColumn,
    [startNode.x, startNode.y],
    oldTargetList
  );

  let visited: boolean[][] = new Array(numberOfColumn);
  for (let i: number = 0; i < numberOfColumn; ++i) {
    visited[i] = new Array(numberOfRows);
  }
  for (let i: number = 0; i < numberOfColumn; ++i) {
    for (let j: number = 0; j < numberOfRows; ++j) {
      visited[i][j] = false;
    }
  }

  visited[startNode.x][startNode.y] = true;
  targetList.forEach((targetNode) => {
    visited[targetNode.x][targetNode.y] = true;
  });
  for (let k: number = 0; k < cheeseToAdd; k++) {
    let i = -1,
      j = -1;
    do {
      i = Math.floor(Math.random() * numberOfColumn);
      j = Math.floor(Math.random() * numberOfRows);
    } while (visited[i][j]);
    visited[i][j] = true;
    newGrid[i][j].hasCheese = true;
    targetList.push(newGrid[i][j]);
  }
  return [newGrid, newStartNode, targetList];
};
