import memoize from '@/helper/memoize';

const memoCellCount: (lengthPx: number, cellSizePx: number) => number = memoize((lengthPx: number, cellSizePx: number) => {
  return Math.floor(lengthPx / cellSizePx);
});

const memoAxisLengthUnit: (cellCount: number, divisionValue: number) => number = memoize((cellCount: number, divisionValue: number) => {
  return cellCount * divisionValue;
});

const memoShiftCells: (shift: number, cellSize: number) => number = memoize((shift: number, cellSize: number) => {
  return -shift / cellSize;
});

const memoAxisEnd: (axisLength: number, shiftCells: number) => number = memoize((axisLength: number, shiftCells: number) => {
  return axisLength + shiftCells;
});

const memoRemainderShift: (shift: number, divisionValue: number, cellSize: number) => number = memoize(
  (shift: number, divisionValue: number, cellSize: number) => {
    return (shift / divisionValue) % cellSize;
  },
);

const memoShowingPoint: (start: number, end: number, value: number) => boolean = memoize((start: number, end: number, value: number) => {
  return value >= start && end >= value;
});

const memoParseToCoefficient: (x1: number, y1: number, x2: number, y2: number) => { a: number; b: number; c: number } = memoize(
  (x1: number, y1: number, x2: number, y2: number): { a: number; b: number; c: number } => {
    return {
      a: y2 - y1,
      b: x1 - x2,
      c: (y2 - y1) * x1 + (x1 - x2) * y1,
    };
  },
);

const memoResultPoint: (axis: number, cellSizePx: number, shiftXPx: number, cellSizeUnit: number) => number = memoize(
  (axis: number, cellSizePx: number, shiftXPx: number, cellSizeUnit: number): number => {
    return (axis * cellSizePx + shiftXPx) / cellSizeUnit;
  },
);

// functions intersection(): boolean {
//   const x1 = this.firstPoint.x,
//     y1 = this.firstPoint.y,
//     x2 = this.secondPoint.x,
//     y2 = this.secondPoint.y,
//     firstPoints = [
//       { x3: this.pointBuilder.beginXUnit, y3: this.pointBuilder.endYUnit },
//       { x3: this.pointBuilder.endXUnit, y3: this.pointBuilder.beginYUnit },
//     ],
//     secondPoints = [
//       { x4: this.pointBuilder.endXUnit, y4: this.pointBuilder.endYUnit },
//       { x4: this.pointBuilder.beginXUnit, y4: this.pointBuilder.beginYUnit },
//     ];
//
//   return firstPoints.some(({ x3, y3 }) => {
//     return secondPoints.some(({ x4, y4 }) => {
//       let { a: a1, b: b1, c: c1 } = this.parseToCoefficient(x1, y1, x2, y2);
//       let { a: a2, b: b2, c: c2 } = this.parseToCoefficient(x3, y3, x4, y4);
//       if (a1 === 0 && a2 === 0) return false;
//       if (a1 === 0) [a1, a2] = [a2, a1];
//
//       const b = b2 - (a2 / a1) * b1,
//         c = c2 - (a2 / a1) * c1;
//       if (b === 0 && c !== 0) return false;
//       const y = c / b,
//         x = (c1 - b1 * y) / a1;
//       const intersectionPoint = this.pointBuilder.createPoint({ x, y });
//       return intersectionPoint.showingPoint;
//     });
//   });
// }

export {
  memoAxisLengthUnit,
  memoCellCount,
  memoShiftCells,
  memoAxisEnd,
  memoRemainderShift,
  memoShowingPoint,
  memoParseToCoefficient,
  memoResultPoint,
};
