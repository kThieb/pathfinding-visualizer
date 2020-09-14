import { node } from "../../usefulInterfaces";
import { BinaryHeap } from "../../dataStructures/binaryHeap";
import { retrievePath } from "../retrievePath";
import { ensure } from "../../ensureNotUndefined";

export const aStar: (
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
  const endNode: node = targetList[0];

  // Initialize the distances array
  const distances: number[][] = [];
  for (let i: number = 0; i < m; i++) {
    distances.push([]);
    for (let j: number = 0; j < n; j++) {
      distances[i].push(Number.MAX_SAFE_INTEGER);
    }
  }

  distances[startNode.x][startNode.y] = 0;

  // Initialize the predecessor array
  const predecessor: node[] = [];
  for (let i: number = 0; i < m * n; i++) {
    predecessor.push(startNode);
  }
  predecessor[startNode.id] = startNode;

  // Initialize the visited nodes array
  let visited: node[] = [];

  //   Initialize the Binary Heap
  let pq: BinaryHeap<node> = new BinaryHeap<node>(
    (a: [node, number], b: [node, number]) => {
      let dA: number = manhattanDistance(a[0], endNode),
        dB: number = manhattanDistance(b[0], endNode);
      if (distances[a[0].x][a[0].y] + dA !== distances[b[0].x][b[0].y] + dB) {
        return distances[a[0].x][a[0].y] + dA < distances[b[0].x][b[0].y] + dB;
      }
      return a[1] < b[1];
    }
  );

  pq.push(startNode);

  while (pq.size() > 0) {
    let currentNode: node = ensure(pq.pop());

    // add the current node to the visited nodes
    visited.push(currentNode);

    // If we found the endNode, return the shortest path to it
    if (currentNode === endNode) {
      // Retrieve the shortest path
      const shortestPath = retrievePath(predecessor, startNode, endNode);
      return [[visited, shortestPath], distances[endNode.x][endNode.y]];
    }

    // Get the coordinates of the nodes
    let currentX: number = currentNode.x;
    let currentY: number = currentNode.y;

    // Iterate the neighbors of the node
    for (const neighbor of ensure(
      mazeGraph.get(pairGrid[currentX][currentY])
    )) {
      // Get the coordinates of the neighbor node
      let neighborX: number = neighbor[0][0],
        neighborY: number = neighbor[0][1];

      // Check if the coordinates are valid
      if (neighborX < 0 || neighborX >= m || neighborY < 0 || neighborY >= n)
        continue;

      let nextNode: node = grid[neighborX][neighborY];

      // Calculate the distance between the current node and the next node
      let currentDistance: number = distances[currentX][currentY] + neighbor[1];

      // If the distance is less than the distance in the array distances,
      // change it and change the predecessor of the next node to be the current one
      if (currentDistance < distances[neighborX][neighborY]) {
        predecessor[nextNode.id] = currentNode;
        distances[neighborX][neighborY] = currentDistance;
      }

      // If the node is not yet visited, remove it from the heap and
      // put it back in with its new distance as the score function
      if (!visited.find((visitedNode) => visitedNode === nextNode)) {
        pq.remove(nextNode);
        pq.push(nextNode);
      }
    }
  }
  return [[visited, []], 0];
};

const manhattanDistance: (a: node, b: node) => number = (a, b) => {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
};
