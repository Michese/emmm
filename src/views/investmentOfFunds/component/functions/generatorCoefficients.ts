import { tCoefficient, initialCoefficient } from '@/views/investmentOfFunds/component';

function* generatorCoefficients(quantity: number): Generator<tCoefficient> {
  for (let count = 0; count < quantity; count++) {
    yield initialCoefficient();
  }
}

export { generatorCoefficients };
