import { initialParameters, tNetworkPlanning } from '@/views/networkPlanning/component';

function initialNetworkPlanning(): tNetworkPlanning {
  return {
    answer: null,
    countErrors: 0,
    newWorks: null,
    oldWorks: null,
    path: null,
    parameters: initialParameters(),
    showResult: false,
  };
}

export { initialNetworkPlanning };
