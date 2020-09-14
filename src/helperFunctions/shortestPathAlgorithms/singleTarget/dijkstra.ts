import { node } from "../../usefulInterfaces";
import { BinaryHeap } from "../../dataStructures/binaryHeap";
import { retrievePath } from "../retrievePath";
import { ensure } from "../../ensureNotUndefined";

export const dijkstraHelper: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [[number, number], number][]>,
  startNode: node,
  targetList: node[]
) => [node[], node[], node, number] = (
  grid,
  pairGrid,
  mazeGraph,
  startNode,
  oldTargetList
) => {
  const m = grid.length,
    n = grid[0].length;
  const targetList: node[] = oldTargetList.slice();
  // Initialize the distances array
  const distances: number[][] = [];
  for (let i: number = 0; i < m; i++) {
    distances.push([]);
    for (let j: number = 0; j < n; j++) {
      distances[i].push(Number.MAX_SAFE_INTEGER - 1);
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
      if (distances[a[0].x][a[0].y] !== distances[b[0].x][b[0].y]) {
        return distances[a[0].x][a[0].y] < distances[b[0].x][b[0].y];
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
    if (targetList.find((targetNode) => targetNode === currentNode)) {
      // Retrieve the shortest path
      const shortestPath = retrievePath(predecessor, startNode, currentNode);
      return [
        visited,
        shortestPath,
        currentNode,
        distances[currentNode.x][currentNode.y],
      ];
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
      // To Do: take into account the weight of the path
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
  return [visited, [], startNode, 0];
};

export const getDistanceMatrix: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [[number, number], number][]>,
  targetList: node[]
) => number[][] = (grid, pairGrid, mazeGraph, targetList) => {
  const result: number[][] = [];
  for (let i: number = 0; i < targetList.length; i++) {
    result.push([]);
    for (let j: number = 0; j < targetList.length; j++) {
      const distance = dijkstraHelper(
        grid,
        pairGrid,
        mazeGraph,
        targetList[i],
        targetList.filter((targetNode: node) => targetNode === targetList[j])
      )[3];
      if (i !== j) result[i].push(distance);
      else result[i].push(0);
    }
  }

  return result;
};

export const dijkstra: (
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
  const [visited, path, , distance] = dijkstraHelper(
    grid,
    pairGrid,
    mazeGraph,
    startNode,
    targetList
  );
  return [[visited, path], distance];
};
