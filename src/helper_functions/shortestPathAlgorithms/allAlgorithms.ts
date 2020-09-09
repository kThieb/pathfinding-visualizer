import { node } from "../usefulInterfaces";
import { bfs } from "./bfs";
import { dijkstraWithWalls } from "./dijkstra";

export const algorithms: {
  [key: string]: (
    grid: node[][],
    pairGrid: [number, number][][],
    mazeGraph: Map<[number, number], [number, number][]>,
    startNode: node,
    targetNode: node
  ) => [node[], node[]];
} = {
  bfs: bfs,
  dijkstraWithWalls: dijkstraWithWalls,
};
