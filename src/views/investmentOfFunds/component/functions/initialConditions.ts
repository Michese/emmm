import { generatorCoefficients, tConditions } from '@/views/investmentOfFunds/component';

function initialConditions(): tConditions {
  return {
    T0: null,
    coefficients: [...generatorCoefficients(4)],
    t2: null,
    t4: null,
    t6: null,
  };
}

export { initialConditions };
