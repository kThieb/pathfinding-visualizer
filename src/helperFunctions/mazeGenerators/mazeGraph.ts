import { ensure } from "../ensureNotUndefined";
import { node } from "../usefulInterfaces";

const MUD_WEIGHT = 5;

const createMazeGraph: (
  rowLength: number,
  columnLength: number,
  grid: node[][]
) => [
  [number, number][][],
  Map<[number, number], [[number, number], number][]>
] = (rowLength, columnLength, grid) => {
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
  let mazeGraph: Map<
    [number, number],
    [[number, number], number][]
  > = new Map();
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
  wallsDensity: number,
  mudDendity: number
) => [
  [number, number][][],
  Map<[number, number], [[number, number], number][]>
] = (rowLength, columnLength, grid, wallsDensity, mudDensity) => {
  let [pairGrid, mazeGraph]: [
    [number, number][][],
    Map<[number, number], [[number, number], number][]>
  ] = createMazeGraph(rowLength, columnLength, grid);

  let currentWallsCount: number =
      2 * (rowLength - 1) * (columnLength - 1) + rowLength + columnLength - 2,
    maxWallsOrMud = currentWallsCount;

  // I. Generate a maze where each cells is reachable (with a DFS)

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
      let currentNodeNeighbors: [[number, number], number][] = ensure(
        mazeGraph.get(currentNode)
      );
      currentNodeNeighbors.push([neighborNode, 1]);

      let neighborNodeNeighbors: [[number, number], number][] = ensure(
        mazeGraph.get(neighborNode)
      );
      neighborNodeNeighbors.push([currentNode, 1]);

      // 4. Mark the ch// mazeGraph.set(neighborNode, neighborNodeNeighbors);osen cell as visited and push it to the stack
      visited.push(neighborNode);
      stack.push(neighborNode);

      // 5. Remove 1 from the currentWallsCount
      currentWallsCount--;
    }
  }

  // II. Remove walls until the desired density is achieved
  let maxWallsCount: number = currentWallsCount;
  while (currentWallsCount * (1 / maxWallsCount) > wallsDensity) {
    // 1. Choose a node randomly
    let randRow: number = Math.floor(Math.random() * rowLength);
    let randCol: number = Math.floor(Math.random() * columnLength);
    let currentNode: [number, number] = pairGrid[randCol][randRow];

    // 2. Get the cells with a wall with the current cell
    let neighbors: [number, number][] = getWalledOffNeighbors(
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
      let currentNodeNeighbors: [[number, number], number][] = ensure(
        mazeGraph.get(currentNode)
      );
      currentNodeNeighbors.push([neighborNode, 1]);

      let neighborNodeNeighbors: [[number, number], number][] = ensure(
        mazeGraph.get(neighborNode)
      );
      neighborNodeNeighbors.push([currentNode, 1]);

      currentWallsCount--;
    }
  }

  // III. Add mud to the graph until we get the desired mud density
  let currentMud: number = 0,
    maxMud: number = maxWallsOrMud - currentWallsCount;
  while (currentMud * (1 / maxMud) < mudDensity) {
    // 1. Choose a node randomly
    let randRow: number = Math.floor(Math.random() * rowLength);
    let randCol: number = Math.floor(Math.random() * columnLength);
    let currentNode: [number, number] = pairGrid[randCol][randRow];

    // 2. Get the neighbors than have no mud
    let neighbors: [[number, number], number][] = ensure(
      mazeGraph.get(currentNode)
    ).filter((item: [[number, number], number]) => item[1] === 1);

    if (neighbors.length > 0) {
      // 3. Get a random neighbor
      let randIndex: number = Math.floor(Math.random() * neighbors.length);
      let neighborNode: [number, number] =
        pairGrid[neighbors[randIndex][0][0]][neighbors[randIndex][0][1]];

      neighbors[randIndex][1] = MUD_WEIGHT;

      let neighborNodeNeighbors: [[number, number], number][] = ensure(
        mazeGraph.get(neighborNode)
      );
      let currentNodeAndDistance: [[number, number], number] = ensure(
        neighborNodeNeighbors.find(
          (item: [[number, number], number]) => item[0] === currentNode
        )
      );
      currentNodeAndDistance[1] = MUD_WEIGHT;
      currentMud++;
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
    [0, -1],
    [-1, 0],
    [0, 1],
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
    [0, -1],
    [-1, 0],
    [0, 1],
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

// This function returns the neighbors which have a wall with the current node
const getWalledOffNeighbors: (
  pairGrid: [number, number][][],
  currentNode: [number, number],
  rowLength: number,
  columnLength: number,
  mazeGraph: Map<[number, number], [[number, number], number][]>
) => [number, number][] = (
  pairGrid,
  currentNode,
  rowLength,
  columnLength,
  mazeGraph
) => {
  const directions = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ];

  let neighbors: [number, number][] = [];
  let neighborX: number = -1;
  let neighborY: number = -1;

  const findCallback: (neighbor: [[number, number], number]) => boolean = (
    neighbor
  ) => {
    return neighbor[0] === pairGrid[neighborX][neighborY];
  };
  for (const dir of directions) {
    neighborX = currentNode[0] + dir[0];
    neighborY = currentNode[1] + dir[1];

    if (
      neighborX >= 0 &&
      neighborX < columnLength &&
      neighborY >= 0 &&
      neighborY < rowLength &&
      // !mazeGraph.get(currentNode)?.includes(pairGrid[neighborX][neighborY])
      !mazeGraph.get(currentNode)?.find(findCallback)
    ) {
      neighbors.push(pairGrid[neighborX][neighborY]);
    }
  }
  return neighbors;
};
