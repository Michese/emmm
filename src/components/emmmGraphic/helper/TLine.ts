import { TFigure, TPoint } from '.';

class TLine extends TFigure {
  firstPoint: TPoint;
  secondPoint: TPoint;
  a0: number;
  a1: number;
  more: boolean;

  constructor(firstPoint: TPoint, secondPoint: TPoint, a0 = 0, a1 = 0, more = false) {
    super();
    this.firstPoint = firstPoint;
    this.secondPoint = secondPoint;
    this.a0 = a0;
    this.a1 = a1;
    this.more = more;
  }

  distance(point: TPoint): number {
    const perpendicularPoint = this.perpendicularPoint(point);
    return Math.hypot(point.x - perpendicularPoint.x, point.y - perpendicularPoint.y);
  }

  perpendicularPoint(point: TPoint): TPoint {
    const a1 = -1 / this.a1,
      perpendicularLine = { a1, a0: point.y - a1 * point.x },
      x = (this.a0 - perpendicularLine.a0) / (perpendicularLine.a1 - this.a1),
      y = x * perpendicularLine.a1 + perpendicularLine.a0;
    return new TPoint(x, y);
  }

  resultFunction(x: number): number {
    return this.a0 + this.a1 * x;
  }

  checkPoint(point: TPoint): boolean {
    if (this.firstPoint.x === this.secondPoint.x) return this.firstPoint.x === point.x || this.more === this.firstPoint.x < point.x;

    const y = this.resultFunction(point.x);
    return 0.001 >= Math.abs(point.y - y) || this.more === y < point.y;
  }

  checkPointOnLine(point: TPoint): boolean {
    return this.firstPoint.x === this.secondPoint.x ? this.firstPoint.x === point.x : this.resultFunction(point.x) === point.y;
  }

  setMore(more: boolean): TLine {
    this.more = more;
    return this;
  }

  static createLineByEquation(a0: number, a1: number, startX: number, endX: number, more = false): TLine {
    const startY = a0 + a1 * startX,
      endY = a0 + a1 * endX;
    return new TLine(new TPoint(startX, startY), new TPoint(endX, endY), a0, a1, more);
  }

  static createLineByPoints(startX: number, startY: number, endX: number, endY: number, more = false): TLine {
    return new TLine(new TPoint(startX, startY), new TPoint(endX, endY), 0, 0, more);
  }

  static intersectionPoint(firstLine: TLine, secondLine: TLine): TPoint | null {
    if (firstLine.firstPoint.x === firstLine.secondPoint.x && secondLine.firstPoint.x === secondLine.secondPoint.x) {
      return null;
    } else if (firstLine.firstPoint.x === firstLine.secondPoint.x) {
      return new TPoint(firstLine.firstPoint.x, secondLine.resultFunction(firstLine.firstPoint.x));
    } else if (secondLine.firstPoint.x === secondLine.secondPoint.x) {
      return new TPoint(secondLine.firstPoint.x, firstLine.resultFunction(secondLine.firstPoint.x));
    } else if (secondLine.a1 === firstLine.a1) {
      return null;
    } else {
      const x = (firstLine.a0 - secondLine.a0) / (secondLine.a1 - firstLine.a1);
      return new TPoint(x, firstLine.resultFunction(x));
    }
  }
}

export { TLine };
