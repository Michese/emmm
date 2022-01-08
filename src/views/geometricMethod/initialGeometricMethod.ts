import { tGeometricMethod } from '@/views/geometricMethod/types';
import initialCondition from '@/views/geometricMethod/initialCondition';

export default function (): tGeometricMethod {
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
