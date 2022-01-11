import { tSimplexTableCell } from '@/views/simplex/component';

function* generatorCells(constValue: string, columns: number): Generator<tSimplexTableCell> {
  yield { borderColor: null, constValue: constValue };
  for (let i = 0; i < columns; i++) {
    yield { borderColor: null, value: null };
  }
}

export { generatorCells };
