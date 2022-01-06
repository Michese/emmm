import { TPoint } from '@/class/Point/types';
import { memoResultPoint, memoShowingPoint, PointBuilder } from '@/class';

export * from '@/class/Point/types';
export * from '@/class/Point/methods';

class Point {
  static DEFAULT_X = 0;
  static DEFAULT_Y = 0;
  point = new Float32Array(2);
  pointBuilder: PointBuilder;
  shiftXPx!: number;
  shiftYPx!: number;
  value?: number;

  constructor(shiftXPx: number, shiftYPx: number, pointBuilder: PointBuilder, { x = Point.DEFAULT_X, y = Point.DEFAULT_Y, value }: TPoint) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.shiftXPx = shiftXPx;
    this.shiftYPx = shiftYPx;
    this.pointBuilder = pointBuilder;
  }

  static distance({ x: x1, y: y1 }: TPoint, { x: x2, y: y2 }: TPoint): number {
    return Math.hypot(x1 - x2, y1 - y2);
  }

  setValue(newValue: number): void {
    this.value = newValue;
  }

  set x(newValue: number) {
    this.point[0] = newValue;
  }

  get x(): number {
    return this.point[0];
  }

  static resultPoint(axis: number, cellSizePx: number, shiftXPx: number, cellSizeUnit: number): number {
    return memoResultPoint(axis, cellSizePx, shiftXPx, cellSizeUnit);
  }

  get resultX(): number {
    return Point.resultPoint(this.x, this.cellSizePx, this.shiftXPx, this.cellSizeUnit);
  }

  set y(newValue: number) {
    this.point[1] = newValue;
  }

  get y(): number {
    return this.point[1];
  }

  get resultY(): number {
    return this.heightPx - Point.resultPoint(this.y, this.cellSizePx, this.shiftYPx, this.cellSizeUnit);
  }

  get cellSizeUnit(): number {
    return this.pointBuilder.cellSizeUnit;
  }

  get heightPx(): number {
    return this.pointBuilder.heightPx;
  }

  get cellSizePx(): number {
    return this.pointBuilder.cellSizePx;
  }

  static showingPoint(start: number, end: number, value: number): boolean {
    return memoShowingPoint(start, end, value);
  }

  get showingPointX(): boolean {
    return Point.showingPoint(this.pointBuilder.beginXUnit, this.pointBuilder.endXUnit, this.x);
  }

  get showingPointY(): boolean {
    return Point.showingPoint(this.pointBuilder.beginYUnit, this.pointBuilder.endYUnit, this.y);
  }

  get showingPoint(): boolean {
    return this.showingPointX && this.showingPointY;
  }

  toResult(): string {
    return `${this.resultX}, ${this.resultY}`;
  }

  valueOf(): TPoint {
    return {
      x: this.x,
      y: this.y,
    };
  }

  toString(): string {
    return `${this.x}, ${this.heightPx - this.y}`;
  }

  toJSON(): TPoint {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

export { Point };
