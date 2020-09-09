import { node } from "../usefulInterfaces";
import { dfs } from "./dfs";
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
  "Depth First Search": dfs,
  "Breadth First Search": bfs,
  "Dijkstra's algorithm": dijkstraWithWalls,
};
