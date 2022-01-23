import { tInvestmentOfFunds } from '@/views/investmentOfFunds/component';
import { initialConditions } from '@/views/investmentOfFunds/component/functions/initialConditions';

function initialInvestmentOfFunds(): tInvestmentOfFunds {
  return {
    Lmin: null,
    answer: null,
    conditions: initialConditions(),
    countErrors: 0,
    firstCase: null,
    secondCase: null,
    showResult: false,
    simplexTables: null,
  };
}

export { initialInvestmentOfFunds };
