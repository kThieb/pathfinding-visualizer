export interface node {
  id: number;
  x: number;
  y: number;
  isStart: boolean;
  hasCheese: boolean;
  isVisited: boolean;
  isShortestPath: boolean;
  successorPosition: string;
}

export interface simplifiedNode {
  x: number;
  y: number;
}
