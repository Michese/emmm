import { tCondition } from '@/views/redistributionOfFunds/component';
import { initialCondition } from '@/views/redistributionOfFunds/component/functions/initialCondition';

function* generatorConditions(quantity: number): Generator<tCondition> {
  for (let count = 0; count < quantity; count++) {
    yield initialCondition();
  }
}

export { generatorConditions };
