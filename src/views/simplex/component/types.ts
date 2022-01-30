import { colorEnum } from '@/components';
import { TPreparedFraction } from '@/class';

type tSimplex = {
  parameters: tParameters;
  simplexTable: tSimplexTable[] | null;
  answer: tAnswer | null;
  countErrors: number;
  showResult: boolean;
  nonce?: string;
};

type tParameters = {
  rows: number | null;
  columns: number | null;
};

type tSimplexTableCell = {
  borderColor: keyof typeof colorEnum | null;
  value?: TPreparedFraction | null;
  constValue?: string;
};

type tElement = {
  row: number | null;
  column: number | null;
};

type tSimplexTable = {
  cells: tSimplexTableCell[][];
  element: tElement | null;
  isInteger: boolean;
};

type tAnswer = {
  Lmin: tSimplexTableCell;
  x: tSimplexTableCell[];
  y: tSimplexTableCell[];
};

export { tSimplex, tParameters, tSimplexTable, tSimplexTableCell, tElement, tAnswer };
