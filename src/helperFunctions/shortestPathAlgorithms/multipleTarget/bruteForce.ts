import { node } from "../../usefulInterfaces";
import { dijkstra, getDistanceMatrix } from "../singleTarget/dijkstra";
import { greedy } from "./greedy";

export const bruteForceTSP: (
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
  const newTargetList: node[] = targetList.slice();
  newTargetList.unshift(startNode);
  const distancesMatrix: number[][] = getDistanceMatrix(
    grid,
    pairGrid,
    mazeGraph,
    newTargetList
  );
  let path: [node, number][] = [[startNode, 0]];
  let optimalPath: [node, number][] = [];

  let maxCost: number = greedy(
    grid,
    pairGrid,
    mazeGraph,
    startNode,
    targetList
  )[1];
  const maxLength: number = targetList.length + 1;
  const bnbtargets: [node, number][] = targetList.map((targetNode, i) => [
    targetNode,
    i + 1,
  ]);

  const branchAndBound: (
    candidatePath: [node, number][],
    remainingTargets: [node, number][],
    currentCost: number
  ) => void = (candidatePath, remainingTargets, currentCost) => {
    if (candidatePath.length === maxLength) {
      if (currentCost > maxCost) return;
      maxCost = currentCost;
      optimalPath = candidatePath;
      return;
    }
    const newRemainingTargets: [node, number][] = remainingTargets.slice();
    remainingTargets.forEach((targetNodeAndIndex) => {
      let prevId: number = candidatePath[candidatePath.length - 1][1];
      candidatePath.push(targetNodeAndIndex);
      branchAndBound(
        candidatePath.slice(),
        newRemainingTargets.filter(
          (tgAndId) => tgAndId[1] !== targetNodeAndIndex[1]
        ),
        currentCost + distancesMatrix[prevId][targetNodeAndIndex[1]]
      );
      candidatePath.pop();
    });
  };
  branchAndBound(path, bnbtargets, 0);
  console.log(optimalPath);
  return [
    getTrueOptimalPath(
      grid,
      pairGrid,
      mazeGraph,
      optimalPath.map((valueIndexPair) => valueIndexPair[0])
    ),
    maxCost,
  ];
};

const getTrueOptimalPath: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [[number, number], number][]>,
  optimalPath: node[]
) => [node[], node[]][] = (grid, pairGrid, mazeGraph, optimalPath) => {
  let actualPath: [node[], node[]][] = [];
  for (let i: number = 0; i < optimalPath.length - 1; i++) {
    let path = dijkstra(grid, pairGrid, mazeGraph, optimalPath[i], [
      optimalPath[i + 1],
    ])[0][1];
    actualPath.push([[], path.slice()]);
  }
  return actualPath;
};
