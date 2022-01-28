import { tAnswer, tSimplexTableCell } from '@/views/simplex/component';

function* generatorSimplexTableCell(quantity: number): Generator<tSimplexTableCell> {
  for (let count = 0; count < quantity; count++) {
    yield { borderColor: null, value: null };
  }
}

function initialAnswer(countX: number, countY: number): tAnswer {
  return {
    Lmin: { borderColor: null, value: null },
    x: [...generatorSimplexTableCell(countX)],
    y: [...generatorSimplexTableCell(countY)],
  };
}

export { initialAnswer };
