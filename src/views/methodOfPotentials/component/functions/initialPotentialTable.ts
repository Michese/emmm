import { tPotentialTable, tPotentialTableCell } from '@/views/methodOfPotentials/component';

function initialPotentialTable(rows: number, columns: number): tPotentialTable {
  function* generatePotentialLastRow(): Generator<tPotentialTableCell> {
    for (let column = 0; column < columns; column++) {
      yield { value: null, borderColor: null };
    }
    yield { value: null, borderColor: null };
  }

  function* generatePotentialRow(): Generator<tPotentialTableCell[]> {
    for (let row = 0; row < rows; row++) {
      yield [...generatePotentialCell()];
    }
    yield [...generatePotentialLastRow()];
  }

  function* generatePotentialCell(): Generator<tPotentialTableCell> {
    for (let column = 0; column < columns; column++) {
      yield { left: { borderColor: null, value: null }, right: null, value: null, borderColor: null };
    }
    yield { value: null, borderColor: null };
  }

  return { cells: [...generatePotentialRow()], step: 1, path: [], minCell: { row: null, column: null } };
}

export { initialPotentialTable };
