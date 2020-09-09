import { node } from "../usefulInterfaces";
import { retrievePath } from "./retrievePath";
import { ensure } from "../ensureNotUndefined";

export const dfs: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [number, number][]>,
  startNode: node,
  targetNode: node
) => [node[], node[]] = (grid, pairGrid, mazeGraph, startNode, endNode) => {
  const m = grid.length,
    n = grid[0].length;

  // Initialize the predecessor array
  const predecessor: node[] = [];
  predecessor.fill(startNode, 0, m * n);
  predecessor[startNode.id] = startNode;

  // Initialize the visited nodes array
  let visited: node[] = [];

  // Discovered array
  let discovered: node[] = [startNode];

  // Initialize the stack
  let stack: node[] = [startNode];

  // While the stack is not empty
  while (stack.length > 0) {
    // Get the element in front of the stack
    let currentNode: node = ensure(stack.pop());

    if (visited.find((visitedNode) => visitedNode === currentNode)) continue;

    // Put the currentNode node in the visited set
    visited.push(currentNode);

    // If we found the end node, return the path to it
    if (currentNode === endNode) {
      // Retrieve the shortest path
      const shortestPath = retrievePath(predecessor, startNode, endNode);
      return [visited, shortestPath];
    }

    // iterate through the neighbors of the currentNode node
    for (const neighbor of ensure(
      mazeGraph.get(pairGrid[currentNode.x][currentNode.y])
    )) {
      // Get the coordinates of the neighbor node
      let neighborX: number = neighbor[0],
        neighborY: number = neighbor[1];

      // Check if the node is on the board
      if (
        neighborX < 0 ||
        neighborX >= m ||
        neighborY < 0 ||
        neighborY >= n ||
        discovered.find(
          (discoveredNode) => discoveredNode === grid[neighborX][neighborY]
        )
      )
        continue;

      // Get the node in the grid
      let nextNode: node = grid[neighborX][neighborY];

      // update the predecessor array
      predecessor[nextNode.id] = currentNode;

      // Add the node to the discovered array
      discovered.push(nextNode);

      // Push the nextNode to the stack
      stack.push(nextNode);
    }
  }

  return [visited, []];
};
