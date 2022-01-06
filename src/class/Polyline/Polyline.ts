import { Point } from '@/class';

class Polyline {
  readonly #points: Point[];

  constructor(...args: Point[]) {
    this.#points = args;
  }

  add(point: Point): void {
    this.#points.push(point);
  }

  *generatorPolyline(): Generator<string, void, unknown> {
    for (const point of this.#points) {
      yield point.toString();
    }
  }

  toString(): string {
    return this.#points.join(' ');
  }

  toResult(): string {
    return this.#points.reduce((str, point) => str + ' ' + point.toResult(), '');
  }
}

export { Polyline };
