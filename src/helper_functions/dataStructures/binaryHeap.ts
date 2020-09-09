import { ensure } from "../ensureNotUndefined";

export class BinaryHeap<T> {
  content: ([T, number] | undefined)[];
  scoreFunction: (x: T) => number;
  index: number;

  constructor(scoreFunction: (x: T) => number) {
    this.content = [];
    this.scoreFunction = scoreFunction;
    this.index = 1;
  }

  compare: (a: [T, number], b: [T, number]) => boolean = (a, b) => {
    if (this.scoreFunction(a[0]) !== this.scoreFunction(b[0])) {
      return this.scoreFunction(a[0]) < this.scoreFunction(b[0]);
    }
    return a[1] < b[1];
  };

  push(element: T) {
    this.content.push([element, this.index++]);
    this.bubbleUp(this.content.length - 1);
  }

  pop(): T | undefined {
    let result: [T, number] = ensure(this.content[0]);
    let end: [T, number] | undefined = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return ensure(result)[0];
  }

  remove(node: T) {
    let length: number = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (let i: number = 0; i < length; i++) {
      if (ensure(this.content[i])[0] !== node) continue;
      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      let end: [T, number] | undefined = this.content.pop();
      // If the element we popped was the one we needed to remove,
      // we're done.
      if (i === length - 1) break;
      // Otherwise, we replace the removed element with the popped
      // one, and allow it to float up or sink down as appropriate.
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  }

  size() {
    return this.content.length;
  }

  private bubbleUp(n: number) {
    // Fetch the element that has to be moved.
    let element: [T, number] = ensure(this.content[n]);
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      let parentN: number = Math.floor((n + 1) / 2) - 1,
        parent: [T, number] = ensure(this.content[parentN]);
      // If the parent has a lesser score, things are in order and we
      // are done.
      // if (
      //   score > this.scoreFunction(ensure(parent)[0]) ||
      //   (score === this.scoreFunction(ensure(parent)[0]) &&
      //     ensure(element)[1] > ensure(parent)[1])
      // )
      //   break;
      if (this.compare(parent, element)) break;

      // Otherwise, swap the parent with the current element and
      // continue.
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  }

  private sinkDown(n: number) {
    // Look up the target element and its score.
    let length: number = this.content.length,
      element: [T, number] = ensure(this.content[n]);

    while (true) {
      // Compute the indices of the child elements.
      let child2N: number = (n + 1) * 2,
        child1N: number = child2N - 1;
      let swap: number = n;
      // This is used to store the new position of the element, if any.
      // If the first child exists (is inside the array)...
      if (
        child1N < length &&
        this.compare(ensure(this.content[child1N]), element)
      )
        swap = child1N;
      if (
        child2N < length &&
        this.compare(ensure(this.content[child2N]), ensure(this.content[swap]))
      )
        swap = child2N;

      // If the order is good, we exit the loop
      if (swap === n) break;

      // Otherwise, swap and continue.
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
}
