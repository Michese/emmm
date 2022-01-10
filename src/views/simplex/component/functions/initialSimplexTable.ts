import { tSimplexTable, tSimplexTableCell } from '@/views/simplex/component';

function initialSimplexTableRows(rows: number, columns: number, isInteger = false): tSimplexTable {
  function* generateFirstRow(): Generator<tSimplexTableCell> {
    yield { borderColor: null, constValue: '' };
    yield { borderColor: null, constValue: 'C' };

    for (let column = 1; column < columns; column++) {
      yield { borderColor: null, constValue: `x<sub>${column}</sub>` };
    }
  }

  function* generatorCells(constValue: string): Generator<tSimplexTableCell> {
    yield { borderColor: null, constValue: constValue };
    for (let i = 0; i < columns; i++) {
      yield { borderColor: null, value: null };
    }
  }

  function* generatorRows(): Generator<tSimplexTableCell[]> {
    yield [...generateFirstRow()];
    yield [...generatorCells(`L`)];
    for (let row = 1; row < rows; row++) {
      yield [...generatorCells(`y<sub>${row}</sub>`)];
    }
  }

  return { cells: [...generatorRows()], element: null, isInteger };
}

export { initialSimplexTableRows };
