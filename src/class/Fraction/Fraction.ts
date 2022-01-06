import { TPreparedFraction } from '@/class/Fraction/types';
import { memoGCD, memoParseToFraction, memoPrepareNumber, memoSlash, memoSplitDivisions } from '@/class/Fraction/methods';
export * from '@/class/Fraction/types';
export * from '@/class/Fraction/methods';

class Fraction {
  static DEFAULT_TOP = 1;
  static DEFAULT_BOTTOM = 1;
  static DEFAULT_PRECISION = 100_000;
  fraction = new Int32Array(2);

  constructor({ top = Fraction.DEFAULT_TOP, bottom = Fraction.DEFAULT_BOTTOM }: TPreparedFraction) {
    this.fraction[0] = top;
    this.fraction[1] = bottom;
  }

  subtraction(fraction: TPreparedFraction): Fraction {
    if (this.bottom === fraction.bottom) {
      this.top = this.top - fraction.top;
    } else {
      this.top = this.top * fraction.bottom - this.bottom * fraction.top;
      this.bottom = this.bottom * fraction.bottom;
    }

    this.slash();
    return this;
  }

  static subtraction(firstFraction: TPreparedFraction, secondFraction: TPreparedFraction): Fraction {
    let { top, bottom } = firstFraction;
    if (bottom === secondFraction.bottom) {
      top -= secondFraction.top;
    } else {
      top = top * secondFraction.bottom - bottom * secondFraction.top;
      bottom *= secondFraction.bottom;
    }

    const { top: slashedTop, bottom: slashedBottom } = this.slash(top, bottom);
    return new Fraction({ top: slashedTop, bottom: slashedBottom });
  }

  addition(fraction: TPreparedFraction): Fraction {
    if (this.bottom === fraction.bottom) {
      this.top = this.top + fraction.top;
    } else {
      this.top = this.top * fraction.bottom + this.bottom * fraction.top;
      this.bottom = this.bottom * fraction.bottom;
    }

    this.slash();
    return this;
  }

  static addition(firstFraction: TPreparedFraction, secondFraction: TPreparedFraction): Fraction {
    let { top, bottom } = firstFraction;
    if (bottom === secondFraction.bottom) {
      top += secondFraction.top;
    } else {
      top = top * secondFraction.bottom + bottom * secondFraction.top;
      bottom *= secondFraction.bottom;
    }

    const { top: slashedTop, bottom: slashedBottom } = this.slash(top, bottom);
    return new Fraction({ top: slashedTop, bottom: slashedBottom });
  }

  multiplication(fraction: TPreparedFraction): Fraction {
    this.top = this.top * fraction.top;
    this.bottom = this.bottom * fraction.bottom;
    this.slash();
    return this;
  }

  static multiplication(firstFraction: TPreparedFraction, secondFraction: TPreparedFraction): Fraction {
    let { top, bottom } = firstFraction;
    top *= secondFraction.top;
    bottom *= secondFraction.bottom;

    const { top: slashedTop, bottom: slashedBottom } = this.slash(top, bottom);
    return new Fraction({ top: slashedTop, bottom: slashedBottom });
  }

  division(fraction: TPreparedFraction): Fraction {
    this.top = this.top * fraction.bottom;
    this.bottom = this.bottom * fraction.top;
    this.slash();
    return this;
  }

  static division(firstFraction: TPreparedFraction, secondFraction: TPreparedFraction): Fraction {
    let { top, bottom } = firstFraction;
    top *= secondFraction.bottom;
    bottom *= secondFraction.top;

    const { top: slashedTop, bottom: slashedBottom } = this.slash(top, bottom);
    return new Fraction({ top: slashedTop, bottom: slashedBottom });
  }

  set top(newValue: number) {
    this.fraction[0] = newValue;
  }

  get top(): number {
    return this.fraction[0];
  }

  set bottom(newValue: number) {
    this.fraction[1] = newValue;
  }

  get bottom(): number {
    return this.fraction[1];
  }

  static gcd(a: number, b: number): number {
    return memoGCD(a, b);
  }

  static prepareNumber(number: string): TPreparedFraction {
    return memoPrepareNumber(number);
  }

  static splitDivisions(numbers: string): TPreparedFraction {
    return memoSplitDivisions(numbers);
  }

  static slash(top: number, bottom: number): TPreparedFraction {
    return memoSlash(top, bottom);
  }

  static parseToFraction(number: number): TPreparedFraction {
    return memoParseToFraction(number);
  }

  slash(): Fraction {
    const { top, bottom } = Fraction.slash(this.top, this.bottom);
    this.top = top;
    this.bottom = bottom;
    return this;
  }

  toJSON(): TPreparedFraction {
    return {
      top: this.top,
      bottom: this.bottom,
    };
  }

  toString(): string {
    return `${this.top}${this.bottom > 1 ? '/' + this.bottom : ''}`;
  }

  valueOf(): number {
    return this.top / this.bottom;
  }
}

export { Fraction };
