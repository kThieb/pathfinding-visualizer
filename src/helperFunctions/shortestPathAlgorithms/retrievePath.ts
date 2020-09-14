import { ensure } from "../ensureNotUndefined";
import { node } from "../usefulInterfaces";

export const retrievePath: (
  predecessor: node[],
  startNode: node,
  endNode: node
) => node[] = (predecessor, startNode, endNode) => {
  let shortestPath = [endNode];
  let current: node = endNode;
  while (current.x !== startNode.x || current.y !== startNode.y) {
    current = predecessor[current.id];
    shortestPath.unshift(current);
  }

  return shortestPath;
};

export const retrieveTwoEndedPath: (
  predecessor: node[],
  successor: node[],
  middleNode: node,
  startNode: node,
  endNode: node
) => node[] = (predecessor, successor, middleNode, startNode, endNode) => {
  let shortestPath = [middleNode];
  let current: node = middleNode;
  while (current.x !== startNode.x || current.y !== startNode.y) {
    current = predecessor[current.id];
    shortestPath.unshift(current);
  }
  current = middleNode;
  while (current.x !== endNode.x || current.y !== endNode.y) {
    current = successor[current.id];
    shortestPath.push(current);
  }
  return shortestPath;
};

export const retrieveDistance: (
  path: node[],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [[number, number], number][]>
) => number = (path, pairGrid, mazeGraph) => {
  let distance: number = 0;
  for (let i: number = 1; i < path.length; i++) {
    let predNode: node = path[i - 1],
      currNode: node = path[i];
    let pred: [number, number] = pairGrid[predNode.x][predNode.y],
      curr: [number, number] = pairGrid[currNode.x][currNode.y];
    let neighbor: [[number, number], number] = ensure(
      ensure(mazeGraph.get(pred)).find(
        (neighborEdge) =>
          neighborEdge[0][0] === curr[0] && neighborEdge[0][1] === curr[1]
      )
    );
    distance += neighbor[1];
  }
  return distance;
};
