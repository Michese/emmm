import { tSecondCaseCondition } from '@/views/investmentOfFunds/component';

function initialSecondCaseCondition(): tSecondCaseCondition {
  return {
    coef: null,
    differenceTime: null,
    t: null,
    isComplete: 'complete',
    isMore: null,
  };
}

export { initialSecondCaseCondition };
