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
