import { colorEnum } from '@/components';

type tParameters = {
  rows: number | null;
  columns: number | null;
};

type tCellInput = {
  value: number | null;
  borderColor: keyof typeof colorEnum | null;
};

type tOldWork = {
  reliesOn: tCellInput[];
  time: tCellInput;
  designation: tCellInput | null;
};

type tNewWork = {
  reliesOn: tCellInput[];
  time: tCellInput;
  totalTime: tCellInput;
};

type tPath = {
  uuid: string;
  childs: tPath[];
  value: number | null;
  borderColor: keyof typeof colorEnum | null;
};

type tNetworkPlanning = {
  parameters: tParameters;
  oldWorks: tOldWork[] | null;
  newWorks: tNewWork[] | null;
  path: tPath[] | null;
  answer: tAnswer | null;
  countErrors: number;
  showResult: boolean;
};

type tAnswer = {
  criticalTime: tCellInput;
  path: tPath[];
};

export { tNetworkPlanning, tAnswer, tOldWork, tNewWork, tPath, tParameters, tCellInput };
