import { tAnswer } from '@/views/investmentOfFunds/component';

function initialAnswer(): tAnswer {
  return {
    Lmin: { borderColor: null, value: null },
    x1: { borderColor: null, value: null },
    x3: { borderColor: null, value: null },
    x5: { borderColor: null, value: null },
    x7: { borderColor: null, value: null },
  };
}

export { initialAnswer };
