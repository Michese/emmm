import { tAnswer } from '@/views/geometricMethod/component/types';
import { changeRadioAnswer } from '@/views/geometricMethod/component';

function initialAnswer(): tAnswer {
  return changeRadioAnswer('point');
}

export { initialAnswer };
