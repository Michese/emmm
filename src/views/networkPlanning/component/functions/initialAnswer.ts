import { tAnswer, tPath } from '@/views/networkPlanning/component';

function initialAnswer(path: tPath[]): tAnswer {
  return {
    criticalTime: { value: null, borderColor: null },
    path,
  };
}

export { initialAnswer };
