type tParameters = {
  rows: number;
  columns: number | null;
};

type tWork = {
  //
};

type tInvestmentOfFunds = {
  parameters: tParameters;
  works: tWork[] | null;
  answer: tAnswer | null;
  countErrors: number;
  showResult: boolean;
};

type tAnswer = {
  criticalTime: number | null;
};

export { tInvestmentOfFunds };
