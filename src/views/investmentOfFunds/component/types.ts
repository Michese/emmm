import { tSimplexTable, tSimplexTableCell } from "@/views/simplex/component";
import { TPreparedFraction } from "@/class";

type tCoefficient = {
  t: number | null;
  x: number | null;
  upperBound: number | null;
};

type tConditions = {
  coefficients: tCoefficient[];
  t2: number | null;
  t4: number | null;
  t6: number | null;
  T0: number | null;
};

type tFirstCase = {
  coef: number | null;
  a: number | null;
  x: number | null;
  isMore: boolean | null;
  t: number | null;
  isComplete: 'complete' | 'uncomplete';
};

type tSecondCaseCondition = {
  coef: number | null;
  differenceTime: number | null;
  t: number | null;
  isMore: boolean | null;
  isComplete: 'complete' | 'uncomplete';
};

type tSecondCase = {
  conditions: tSecondCaseCondition[] | null;
  criticalTime: number | null;
  differenceTime: number | null;
};

type tLmin = {
  coefficients: { x: number | null }[];
  result: number | null;
};

type tAnswer = {
  Lmin: tSimplexTableCell;
  x1: tSimplexTableCell;
  x3: tSimplexTableCell;
  x5: tSimplexTableCell;
  x7: tSimplexTableCell;
};

type tInvestmentOfFunds = {
  conditions: tConditions;
  firstCase: tFirstCase[] | null;
  secondCase: tSecondCase | null;
  Lmin: tLmin | null;
  simplexTables: tSimplexTable[] | null;
  answer: tAnswer | null;
  showResult: boolean;
  countErrors: number;
};

export { tConditions, tInvestmentOfFunds, tAnswer, tCoefficient, tLmin, tFirstCase, tSecondCase, tSecondCaseCondition };
