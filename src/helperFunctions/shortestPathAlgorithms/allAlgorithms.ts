import { node } from "../usefulInterfaces";
import { dfs } from "./singleTarget/dfs";
import { bfs } from "./singleTarget/bfs";
import { dijkstra } from "./singleTarget/dijkstra";
import { aStar } from "./singleTarget/aStar";
import { greedy } from "./multipleTarget/greedy";
import { bruteForceTSP } from "./multipleTarget/bruteForce";
import { twoEndedBfs } from "./singleTarget/twoEndedBfs";

export const singleTargetAlgorithms: {
  [key: string]: (
    grid: node[][],
    pairGrid: [number, number][][],
    mazeGraph: Map<[number, number], [[number, number], number][]>,
    startNode: node,
    targetList: node[]
  ) => [node[], node[]];
} = {
  "Depth First Search": dfs,
  "Breadth First Search": bfs,
  "Dijkstra's algorithm": dijkstra,
  "A* algorithm": aStar,
  "Meet in the Middle BFS": twoEndedBfs,
};

export const multipleTargetsAlgorithms: {
  [key: string]: (
    grid: node[][],
    pairGrid: [number, number][][],
    mazeGraph: Map<[number, number], [[number, number], number][]>,
    startNode: node,
    targetList: node[]
  ) => [[node[], node[]][], number];
} = {
  "Nearest Neighbors Heuristic": greedy,
  "Brute Force Algorithm": bruteForceTSP,
};
