import { tRedistributionOfFunds } from '@/views/redistributionOfFunds/component';
import { generatorConditions } from '@/views/redistributionOfFunds/component/functions/generatorConditions';

function initialRedistributionOfFunds(): tRedistributionOfFunds {
  return {
    conditions: [...generatorConditions(3)],
    countErrors: 0,
    firstCase: null,
    secondCase: null,
    showResult: false,
  };
}

export { initialRedistributionOfFunds };
