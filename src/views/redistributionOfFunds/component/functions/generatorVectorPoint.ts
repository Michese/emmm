import { tVectorPoint } from '@/views/redistributionOfFunds/component';
import { initialVectorPoint } from '@/views/redistributionOfFunds/component/functions/initialVectorPoint';

function* generatorVectorPoint(quantity: number): Generator<tVectorPoint> {
  for (let count = 0; count < quantity; count++) {
    yield initialVectorPoint();
  }
}

export { generatorVectorPoint };
