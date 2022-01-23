import { tGeometricMethod } from '@/views/geometricMethod/component/types';
import { initialCondition } from '@/views/geometricMethod/component';

function initialGeometricMethod(): tGeometricMethod {
  return {
    condition: initialCondition(),
    pointsForLines: null,
    pointsForVector: null,
    pointVectorForGraphic: null,
    answer: null,
    countErrors: 0,
    showResult: false,
  };
}

export { initialGeometricMethod };
