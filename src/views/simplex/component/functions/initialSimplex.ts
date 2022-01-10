import { tSimplex } from '@/views/simplex/component';
import { initialParameters } from '@/views/simplex/component/functions/initialParameters';

function initialSimplex(): tSimplex {
  return {
    parameters: initialParameters(),
    simplexTable: null,
    answer: null,
    countErrors: 0,
    showResult: false,
  };
}

export { initialSimplex };
