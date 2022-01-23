import { tCoefficient } from '@/views/investmentOfFunds/component';

function initialCoefficient(): tCoefficient {
  return {
    t: null,
    upperBound: null,
    x: null,
  };
}

export { initialCoefficient };
