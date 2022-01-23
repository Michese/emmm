import { tAnswer } from '@/views/geometricMethod/component/types';
import { radioAnswerEnum } from '@/views/geometricMethod/component/enums';

function changeRadioAnswer(radio: string): tAnswer {
  if (radio === radioAnswerEnum.point) {
    return { Lmax: null, radio, points: [{ x: null, y: null }] };
  } else if (radio === radioAnswerEnum.line) {
    return {
      Lmax: null,
      radio,
      points: [
        { x: null, y: null },
        { x: null, y: null },
      ],
    };
  } else if (radio === radioAnswerEnum.noSolution) {
    return { Lmax: null, radio, points: [] };
  } else {
    throw new Error('Нет такого значения radio!');
  }
}

export { changeRadioAnswer };
