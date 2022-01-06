import { tAnswer } from '@/views/geometricMethod/types';
import { radioAnswerEnum } from '@/views/geometricMethod/enums';

export default function (radio: string): tAnswer {
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
