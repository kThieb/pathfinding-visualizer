import { node } from "../usefulInterfaces";

export const retrievePath: (
  predecessor: node[],
  startNode: node,
  endNode: node
) => node[] = (predecessor, startNode, endNode) => {
  let shortestPath = [endNode];
  let current = endNode;
  while (current !== startNode) {
    current = predecessor[current.id];
    shortestPath.unshift(current);
  }

  return shortestPath;
};
