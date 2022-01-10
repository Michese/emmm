import { tSimplexTable } from '@/views/simplex/component';

function initialSimplexTableWithPrevious(
  previousTable: tSimplexTable,
  reverseRow: number | null = null,
  reverseColumn: number | null = null,
  isInteger = false,
): tSimplexTable {
  const topConstValue = previousTable.cells[0][previousTable.element!.column!].constValue,
    leftConstValue = previousTable.cells[previousTable.element!.row!][0].constValue;

  return {
    element: null,
    isInteger: isInteger,
    cells: previousTable.cells.map((row, indexRow) =>
      row.map((cell, indexColumn) => {
        return cell.value
          ? { borderColor: null, value: null }
          : indexRow === 0 && indexColumn === reverseColumn
          ? { borderColor: null, constValue: leftConstValue }
          : indexRow === reverseRow && indexColumn === 0
          ? { borderColor: null, constValue: topConstValue }
          : { ...cell };
      }),
    ),
  };
}

export { initialSimplexTableWithPrevious };
