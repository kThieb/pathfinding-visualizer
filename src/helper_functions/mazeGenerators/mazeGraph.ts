import { node } from "../usefulInterfaces";

// TODO: Refactor the code to use the different key-values pair as the nodes get changed when there is a setGrid that is applied

const createMazeGraph: (
  rowLength: number,
  columnLength: number,
  grid: node[][]
) => [[number, number][][], Map<[number, number], [number, number][]>] = (
  rowLength,
  columnLength,
  grid
) => {
  let pairGrid: [number, number][][] = [];
  for (let i: number = 0; i < columnLength; i++) {
    let pairRow: [number, number][] = [];
    for (let j: number = 0; j < rowLength; j++) {
      let currentNode: node = grid[i][j];
      pairRow.push([currentNode.x, currentNode.y]);
    }
    pairGrid.push(pairRow);
  }

  // Create the maze graph
  let mazeGraph: Map<[number, number], [number, number][]> = new Map();
  for (let i: number = 0; i < columnLength; i++) {
    for (let j: number = 0; j < rowLength; j++) {
      mazeGraph.set(pairGrid[i][j], []);
    }
  }
  return [pairGrid, mazeGraph];
};

export const createEmptyMazeGraph: (
  rowLength: number,
  columnLength: number,
  grid: node[][]
) => [[number, number][][], Map<[number, number], [number, number][]>] = (
  rowLength,
  columnLength,
  grid
) => {
  let pairGrid: [number, number][][] = [];
  for (let i: number = 0; i < columnLength; i++) {
    let pairRow: [number, number][] = [];
    for (let j: number = 0; j < rowLength; j++) {
      let currentNode: node = grid[i][j];
      pairRow.push([currentNode.x, currentNode.y]);
    }
    pairGrid.push(pairRow);
  }
  // Create the maze graph
  let mazeGraph: Map<[number, number], [number, number][]> = new Map();
  for (let i: number = 0; i < columnLength; i++) {
    for (let j: number = 0; j < rowLength; j++) {
      let neighbors: [number, number][] = getNeighborsEmpty(
        pairGrid,
        [i, j],
        columnLength,
        rowLength
      );
      mazeGraph.set(pairGrid[i][j], neighbors);
    }
  }
  return [pairGrid, mazeGraph];
};

export const generateMazeGraph: (
  rowLength: number,
  columnLength: number,
  grid: node[][],
  wallsDensity: number
) => [[number, number][][], Map<[number, number], [number, number][]>] = (
  rowLength,
  columnLength,
  grid,
  wallsDensity
) => {
  let [pairGrid, mazeGraph] = createMazeGraph(rowLength, columnLength, grid);

  // I. Generate a maze where each cells is reachable (with a DFS)
  let currentWallsCount: number =
    2 * (rowLength - 1) * (columnLength - 1) + rowLength + columnLength - 2;

  // 1. Choose the initial cell, mark it as visited and push it to the stack
  let startNode: [number, number] = pairGrid[0][0];
  let stack: [number, number][] = [startNode];
  let visited: [number, number][] = [startNode];

  // 2. While the stack is not empty
  while (stack.length > 0) {
    // 1. Pop a cell from the stack and make it a current cell
    let currentNode: [number, number] = ensure(stack.pop());
    let currentNonVisitedNeighbors: [number, number][] = getNeighbors(
      pairGrid,
      currentNode,
      rowLength,
      columnLength,
      visited
    );
    // 2. If the current cell has any neighbours which have not been visited
    if (currentNonVisitedNeighbors.length > 0) {
      // 1. Push the current cell to the stack
      stack.push(currentNode);

      // 2. Choose one of the unvisited neighbours
      let randIndex: number = Math.floor(
        Math.random() * currentNonVisitedNeighbors.length
      );
      let neighborNode: [number, number] =
        currentNonVisitedNeighbors[randIndex];

      // 3. Remove the wall between the current cell and the chosen cell
      let currentNodeNeighbors: [number, number][] = ensure(
        mazeGraph.get(currentNode)
      );
      currentNodeNeighbors.push(neighborNode);
      // mazeGraph.set(currentNode, currentNodeNeighbors);

      let neighborNodeNeighbors: [number, number][] = ensure(
        mazeGraph.get(neighborNode)
      );
      neighborNodeNeighbors.push(currentNode);
      // mazeGraph.set(neighborNode, neighborNodeNeighbors);

      // 4. Mark the chosen cell as visited and push it to the stack
      visited.push(neighborNode);
      stack.push(neighborNode);

      // 5. Remove 1 from the currentWallsCount
      currentWallsCount--;
    }
  }

  let maxWallsCount: number = currentWallsCount;
  // II. Remove walls until the desired density is achieved
  while (currentWallsCount * (1 / maxWallsCount) > wallsDensity) {
    // 1. Choosse a node randomly
    let randRow: number = Math.floor(Math.random() * rowLength);
    let randCol: number = Math.floor(Math.random() * columnLength);
    let currentNode: [number, number] = pairGrid[randCol][randRow];

    // 2. Get the cells with a wall with the current cell
    let neighbors: [number, number][] = getNeighborsII(
      pairGrid,
      currentNode,
      rowLength,
      columnLength,
      mazeGraph
    );

    if (neighbors.length > 0) {
      // 3. Choose one of the cells with a wall
      let randIndex: number = Math.floor(Math.random() * neighbors.length);
      let neighborNode: [number, number] =
        pairGrid[neighbors[randIndex][0]][neighbors[randIndex][1]];

      // 4. Remove the wall between the 2 cells
      let currentNodeNeighbors: [number, number][] = ensure(
        mazeGraph.get(currentNode)
      );
      currentNodeNeighbors.push(neighborNode);
      // mazeGraph.set(currentNode, currentNodeNeighbors);

      let neighborNodeNeighbors: [number, number][] = ensure(
        mazeGraph.get(neighborNode)
      );
      neighborNodeNeighbors.push(currentNode);
      // mazeGraph.set(neighborNode, neighborNodeNeighbors);

      currentWallsCount--;
    }
  }
  return [pairGrid, mazeGraph];
};

const getNeighbors: (
  grid: [number, number][][],
  currentNode: [number, number],
  rowLength: number,
  columnLength: number,
  visited: [number, number][]
) => [number, number][] = (
  pairGrid,
  currentNode,
  rowLength,
  columnLength,
  visited
) => {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  let neighbors: [number, number][] = [];
  let neighborX: number = -1;
  let neighborY: number = -1;

  for (const dir of directions) {
    neighborX = currentNode[0] + dir[0];
    neighborY = currentNode[1] + dir[1];
    if (
      neighborX >= 0 &&
      neighborX < columnLength &&
      neighborY >= 0 &&
      neighborY < rowLength &&
      !visited.includes(pairGrid[neighborX][neighborY])
    ) {
      neighbors.push(pairGrid[neighborX][neighborY]);
    }
  }
  return neighbors;
};

export const getNeighborsEmpty: (
  pairGrid: [number, number][][],
  currentNode: [number, number],
  columnLength: number,
  rowLength: number
) => [number, number][] = (pairGrid, currentNode, columnLength, rowLength) => {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  let neighbors: [number, number][] = [];
  let neighborX: number = -1;
  let neighborY: number = -1;

  for (const dir of directions) {
    neighborX = currentNode[0] + dir[0];
    neighborY = currentNode[1] + dir[1];
    if (
      neighborX >= 0 &&
      neighborX < columnLength &&
      neighborY >= 0 &&
      neighborY < rowLength
    ) {
      neighbors.push(pairGrid[neighborX][neighborY]);
    }
  }
  return neighbors;
};

const getNeighborsII: (
  pairGrid: [number, number][][],
  currentNode: [number, number],
  rowLength: number,
  columnLength: number,
  mazeGraph: Map<[number, number], [number, number][]>
) => [number, number][] = (
  pairGrid,
  currentNode,
  rowLength,
  columnLength,
  mazeGraph
) => {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  let neighbors: [number, number][] = [];
  let neighborX: number = -1;
  let neighborY: number = -1;

  for (const dir of directions) {
    neighborX = currentNode[0] + dir[0];
    neighborY = currentNode[1] + dir[1];
    if (
      neighborX >= 0 &&
      neighborX < columnLength &&
      neighborY >= 0 &&
      neighborY < rowLength &&
      !mazeGraph.get(currentNode)?.includes(pairGrid[neighborX][neighborY])
    ) {
      neighbors.push(pairGrid[neighborX][neighborY]);
    }
  }
  return neighbors;
};

function ensure<T>(
  argument: T | undefined | null,
  message: string = "This value was promised to be there."
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}
