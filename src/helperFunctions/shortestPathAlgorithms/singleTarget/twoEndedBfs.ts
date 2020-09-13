import { node } from "../../usefulInterfaces";
import { retrieveTwoEndedPath } from "../retrievePath";
import { ensure } from "../../ensureNotUndefined";

export const twoEndedBfs: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [[number, number], number][]>,
  startNode: node,
  targetList: node[]
) => [node[], node[]] = (grid, pairGrid, mazeGraph, startNode, targetList) => {
  const m = grid.length,
    n = grid[0].length;

  // Initialize the predecessor array
  const predecessor: node[] = [];
  for (let i: number = 0; i < m * n; i++) {
    predecessor.push(startNode);
  }
  predecessor[startNode.id] = startNode;

  const successor: node[] = [];
  for (let i: number = 0; i < m * n; i++) {
    successor.push(targetList[0]);
  }
  successor[targetList[0].id] = targetList[0];

  const source: node[] = [];
  for (let i: number = 0; i < m * n; i++) {
    source.push(targetList[0]);
  }
  source[startNode.id] = startNode;
  source[targetList[0].id] = targetList[0];

  // Initialize the visited nodes array
  let visited: node[] = [];

  // Initialize the discovered array
  let discovered: node[] = [startNode, targetList[0]];

  // Initialize the Queue TODO: IMPLEMENT A BETTER VERSION OF THE QUEUE WITH O(1) OPERATIONS
  let q: node[] = [startNode, targetList[0]];

  // While the queue is not empty
  while (q.length > 0) {
    // Get the element in front of the queue
    let currentNode: node = ensure(q.shift());

    if (visited.find((visitedNode) => visitedNode === currentNode)) continue;

    // Put the currentNode node in the visited set
    visited.push(currentNode);

    // iterate through the neighbors of the currentNode node
    for (const neighbor of ensure(
      mazeGraph.get(pairGrid[currentNode.x][currentNode.y])
    )) {
      // Get the coordinates of the neighbor node
      let neighborX: number = neighbor[0][0],
        neighborY: number = neighbor[0][1];

      if (neighborX < 0 || neighborX >= m || neighborY < 0 || neighborY >= n)
        continue;

      // Get the node in the grid
      let nextNode: node = grid[neighborX][neighborY];

      // Store the result of the find function for later
      const foundNode: node | undefined = visited.find(
        (visitedNode) => visitedNode === nextNode
      );

      // If we found the end node, return the path to it
      if (foundNode && source[currentNode.id] !== source[foundNode.id]) {
        if (source[currentNode.id] === startNode)
          predecessor[nextNode.id] = currentNode;
        else successor[nextNode.id] = currentNode;
        // Retrieve the shortest path
        const shortestPath = retrieveTwoEndedPath(
          predecessor,
          successor,
          nextNode,
          startNode,
          targetList[0]
        );
        return [visited, shortestPath];
      }

      if (
        discovered.find(
          (discoveredNode) => discoveredNode === grid[neighborX][neighborY]
        )
      )
        continue;

      source[nextNode.id] = source[currentNode.id];

      if (source[currentNode.id] === startNode) {
        // update the predecessor array
        predecessor[nextNode.id] = currentNode;
      } else {
        successor[nextNode.id] = currentNode;
      }

      // Add the node to the visited nodes
      discovered.push(nextNode);

      // Push the next node to the queue
      q.push(nextNode);
    }
  }

  return [visited, []];
};
