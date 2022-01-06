import { TFigure } from '.';

class TPoint extends TFigure {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  distance(point: TPoint): number {
    return Math.hypot(point.x - this.x, point.y - this.y);
  }
}

export { TPoint };
