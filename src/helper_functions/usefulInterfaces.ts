export interface node {
  id: number;
  x: number;
  y: number;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isShortestPath: boolean;
  hasCheese: boolean;
}

export interface simplifiedNode {
  x: number;
  y: number;
}
