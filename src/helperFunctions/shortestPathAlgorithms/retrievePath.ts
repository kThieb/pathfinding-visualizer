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
