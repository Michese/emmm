import { tMethodOfPotentials, initialParameters } from '@/views/methodOfPotentials/component';

function initialMethodOfPotentials(): tMethodOfPotentials {
  return {
    parameters: initialParameters(),
    potentialTables: null,
    countErrors: 0,
    showResult: false,
  };
}

export { initialMethodOfPotentials };
