import { node } from "../usefulInterfaces";

export const bfs: (
  grid: node[][],
  pairGrid: [number, number][][],
  mazeGraph: Map<[number, number], [number, number][]>,
  startNode: node,
  targetNode: node
) => [node[], node[]] = (grid, pairGrid, mazeGraph, startNode, endNode) => {
  const m = grid.length,
    n = grid[0].length;

  // Initialize the predecessor array
  const predecessor: node[] = [];
  predecessor.fill(startNode, 0, m * n);
  predecessor[startNode.id] = startNode;

  // Initialize the visited nodes array
  let visited: node[] = [];

  // Initialize the Queue

  return [visited, []];
};
