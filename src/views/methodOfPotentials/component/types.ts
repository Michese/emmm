import { colorEnum } from '@/components';

type tMethodOfPotentials = {
  parameters: tParameters;
  potentialTables: tPotentialTable[] | null;
  answer: tAnswer | null;
  countErrors: number;
  showResult: boolean;
  nonce?: string;
};

type tPath = {
  row: number;
  column: number;
};

type tPotentialTable = {
  cells: tPotentialTableCell[][];
  step: number;
  path: tPath[];
  minCell: { row: number | null; column: number | null };
};

type tPotentialTableCell = {
  left?: { borderColor: keyof typeof colorEnum | null; value: number | null };
  right?: number | null;
  value: number | null;
  borderColor: keyof typeof colorEnum | null;
};

type tParameters = {
  rows: number | null;
  columns: number | null;
};

type tAnswer = {
  Lmin: number | null;
};

export { tMethodOfPotentials, tPotentialTable, tPotentialTableCell, tParameters, tPath, tAnswer };
