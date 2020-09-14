import { node } from "../../usefulInterfaces";
import { retrieveDistance, retrievePath } from "../retrievePath";
import { ensure } from "../../ensureNotUndefined";

export const bfs: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [[number, number], number][]>,
  startNode: node,
  targetList: node[]
) => [[node[], node[]], number] = (
  grid,
  pairGrid,
  mazeGraph,
  startNode,
  targetList
) => {
  const m = grid.length,
    n = grid[0].length;

  // Initialize the predecessor array
  const predecessor: node[] = [];
  for (let i: number = 0; i < m * n; i++) {
    predecessor.push(startNode);
  }
  predecessor[startNode.id] = startNode;

  // Initialize the visited nodes array
  let visited: node[] = [];

  // Initialize the discovered array
  let discovered: node[] = [startNode];

  // Initialize the Queue TODO: IMPLEMENT A BETTER VERSION OF THE QUEUE WITH O(1) OPERATIONS
  let q: node[] = [startNode];

  // While the queue is not empty
  while (q.length > 0) {
    // Get the element in front of the queue
    let currentNode: node = ensure(q.shift());

    if (visited.find((visitedNode) => visitedNode === currentNode)) continue;

    // Put the currentNode node in the visited set
    visited.push(currentNode);

    // If we found the end node, return the path to it
    if (targetList.find((targetNode) => currentNode === targetNode)) {
      // Retrieve the shortest path
      const shortestPath = retrievePath(predecessor, startNode, currentNode);
      return [
        [visited, shortestPath],
        retrieveDistance(shortestPath, pairGrid, mazeGraph),
      ];
    }

    // iterate through the neighbors of the currentNode node
    for (const neighbor of ensure(
      mazeGraph.get(pairGrid[currentNode.x][currentNode.y])
    )) {
      // Get the coordinates of the neighbor node
      let neighborX: number = neighbor[0][0],
        neighborY: number = neighbor[0][1];

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

      // Add the node to the visited nodes
      discovered.push(nextNode);

      // Push the next node to the queue
      q.push(nextNode);
    }
  }

  return [[visited, []], 0];
};
