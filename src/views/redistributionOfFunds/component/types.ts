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

type tSystem = {
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

type tCase = {
  system: tSystem;
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
  nonce?: string;
};

export { tRedistributionOfFunds, tCondition, tCase, tVectorPoint, tVector, tAnswer, tSystem };
