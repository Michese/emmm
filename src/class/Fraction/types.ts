import { Fraction } from '@/class';

type TPreparedFraction =
  | {
      top: number;
      bottom: number;
    }
  | Fraction;

export { TPreparedFraction };
