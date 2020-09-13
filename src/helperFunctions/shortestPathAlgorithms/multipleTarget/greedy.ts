import { node } from "../../usefulInterfaces";
import { dijkstraHelper } from "../singleTarget/dijkstra";

export const greedy: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [[number, number], number][]>,
  startNode: node,
  targetList: node[]
) => [[node[], node[]][], number] = (
  grid,
  pairGrid,
  mazeGraph,
  startNode,
  targetList
) => {
  let currentStartNode: node = startNode,
    totalDistance: number = 0;
  let allVisitedAndPaths: [node[], node[]][] = [];
  while (targetList.length > 0) {
    let [visited, path, endNode, distance] = dijkstraHelper(
      grid,
      pairGrid,
      mazeGraph,
      currentStartNode,
      targetList.slice()
    );
    totalDistance += distance;
    targetList = targetList.filter((targetNode) => targetNode !== endNode);
    currentStartNode = endNode;
    allVisitedAndPaths.push([visited, path]);
  }
  return [allVisitedAndPaths, totalDistance];
};
