import { tPotentialTable } from '@/views/methodOfPotentials/component';

function initialNextTable(previous: tPotentialTable, isInitialize = false): tPotentialTable {
  return {
    step: 1,
    path: [],
    minCell: { row: null, column: null },
    cells: previous.cells.map(row =>
      row.map(cell =>
        cell.right === undefined
          ? { value: null, borderColor: null }
          : {
              left: { borderColor: null, value: null },
              right: cell.right,
              value: isInitialize && cell.value !== 0 ? cell.value : null,
              borderColor: null,
            },
      ),
    ),
  };
}

export { initialNextTable };
