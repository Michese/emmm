import { Point } from '@/class';

type TPoint =
  | {
      x: number;
      y: number;
      value?: number;
    }
  | Point;

export { TPoint };
