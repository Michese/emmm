import { tCase } from '@/views/redistributionOfFunds/component';

function initialCase(): tCase {
  return {
    answer: null,
    system: {
      first: {
        coefficient: null,
        x2: null,
        x3: null,
      },
      fourth: null,
      second: null,
      t: {
        coefficient: null,
        x2: null,
        x3: null,
      },
      third: null,
    },
    vectorPoints: null,
    vector: null,
  };
}

export { initialCase };
