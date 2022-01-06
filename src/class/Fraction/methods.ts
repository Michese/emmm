import memoize from '@/helper/memoize';
import { TPreparedFraction } from '@/class/Fraction/types';
import { Fraction } from '@/class';

function replaceFractionObject(
  { top: oldTop, bottom: oldBottom }: TPreparedFraction,
  { top: newTop, bottom: newBottom }: TPreparedFraction,
): TPreparedFraction {
  return {
    top: newTop ?? oldTop,
    bottom: newBottom || oldBottom,
  };
}

const memoGCD: (a: number, b: number) => number = memoize((a: number, b: number) => {
  if (b > a) [a, b] = [b, a];
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a < 1 ? 1 : a;
});

const memoPrepareNumber: (number: string) => TPreparedFraction = memoize((number: string) => {
  let resultFraction = { top: Fraction.DEFAULT_TOP, bottom: Fraction.DEFAULT_BOTTOM };
  const splittedFraction = Fraction.splitDivisions(number);
  resultFraction = replaceFractionObject(resultFraction, splittedFraction);
  const parsedFraction = Fraction.parseToFraction(resultFraction.top / resultFraction.bottom);
  resultFraction = replaceFractionObject(resultFraction, parsedFraction);
  const slashedFraction = Fraction.slash(resultFraction.top, resultFraction.bottom);
  return replaceFractionObject(resultFraction, slashedFraction);
});

const memoSplitDivisions: (numbers: string) => TPreparedFraction = memoize(numbers => {
  let top = Fraction.DEFAULT_TOP,
    bottom = Fraction.DEFAULT_BOTTOM;

  if (Number.isNaN(+numbers)) {
    numbers.split('/').forEach((number: number, index: number) => {
      index % 2 ? (bottom *= +number) : (top *= +number);
    });

    while (!Number.isInteger(top) && !Number.isInteger(bottom)) {
      top *= 10;
      bottom *= 10;
    }
  } else {
    top = numbers;
  }

  return { top, bottom };
});

const memoSlash: (top: number, bottom: number) => TPreparedFraction = memoize((top, bottom) => {
  const gcdResult = Fraction.gcd(top, bottom);
  return {
    top: top / gcdResult,
    bottom: bottom / gcdResult,
  };
});

const memoParseToFraction: (number: number) => TPreparedFraction = memoize(number => {
  let top = number,
    bottom: number | undefined = Fraction.DEFAULT_BOTTOM;
  if (!Number.isInteger(number)) {
    const precision = Fraction.DEFAULT_PRECISION;
    const integerPart = Math.floor(number);
    const fractionalPart = Math.round((number - integerPart) * precision);
    let roundedDivider = 0;
    let multiplier = 0;
    for (let counter = 1; counter < 10; counter++) {
      const value = fractionalPart / counter;
      const divider = precision / value;
      roundedDivider = Math.round(divider);

      if (Math.abs(roundedDivider - divider) / counter < 0.005) {
        multiplier = counter;
        break;
      }
    }

    if (multiplier) {
      top = integerPart * roundedDivider + multiplier;
      bottom = roundedDivider;
    } else if (fractionalPart % 10 === 0) {
      top = Math.round(number * precision);
      bottom = precision;
    } else {
      top = undefined;
      bottom = undefined;
    }
  }

  return { top, bottom };
});

export { replaceFractionObject, memoPrepareNumber, memoGCD, memoSplitDivisions, memoSlash, memoParseToFraction };
