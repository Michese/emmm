type tCondition = {
  t: number | null;
  a: number | null;
  x: number | null;
};

type tVector = {
  x2: number;
  x3: number;
};

type tAnswer = {
  t0: number | null;
  x2: number | null;
  x3: number | null;
};

type tVectorPoint = {
  x2: number | null;
  x3: number | null;
};

type tCase = {
  system: {
    t: {
      x2: number | null;
      x3: number | null;
      coefficient: number | null;
    };
    first: {
      x2: number | null;
      x3: number | null;
      coefficient: number | null;
    };
    second: number | null;
    third: number | null;
    fourth: number | null;
  };
  vectorPoints: tVectorPoint[] | null;
  vector: tVector | null;
  answer: tAnswer | null;
};

type tRedistributionOfFunds = {
  conditions: tCondition[];
  firstCase: tCase | null;
  secondCase: tCase | null;
  countErrors: number;
  showResult: boolean;
};

export { tRedistributionOfFunds, tCondition, tCase, tVectorPoint, tVector, tAnswer };
