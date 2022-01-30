import { radioAnswerEnum } from '@/views/geometricMethod/component/enums';

type tGeometricMethod = {
  condition: tCondition;
  pointsForLines: tPointsForLine[] | null;
  pointsForVector: tPointsForVector | null;
  pointVectorForGraphic: tPointVectorForGraphic | null;
  answer: tAnswer | null;
  countErrors: number;
  showResult: boolean;
  nonce?: string;
};

type tCondition = {
  Lmax: {
    x: number | null;
    y: number | null;
  };
  inequalities: {
    x: number | null;
    y: number | null;
    result: number | null;
  }[];
};

type tPointsForLine = {
  lines: { x: number | null; y: number | null }[];
};

type tPointsForVector = {
  lines: { x: number | null; y: number | null }[];
};

type tPointVectorForGraphic = {
  x: number;
  y: number;
};

type tAnswer = {
  radio: radioAnswerEnum;
  points: { x: number | null; y: number | null }[];
  Lmax: number | null;
};

export { tGeometricMethod, tCondition, tPointsForLine, tPointsForVector, tPointVectorForGraphic, tAnswer };
