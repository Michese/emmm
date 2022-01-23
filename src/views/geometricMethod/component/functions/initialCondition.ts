import { tCondition } from '@/views/geometricMethod/component/types';

function initialCondition(): tCondition {
  return {
    Lmax: {
      x: null,
      y: null,
    },
    inequalities: [
      { x: null, y: null, result: null },
      { x: null, y: null, result: null },
      { x: null, y: null, result: null },
    ],
  };
}

export { initialCondition };
