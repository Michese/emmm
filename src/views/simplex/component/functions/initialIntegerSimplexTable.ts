import { generatorCells, tSimplexTable } from '@/views/simplex/component';

function initialIntegerSimplexTable(previousTable: tSimplexTable, isInteger = true): tSimplexTable {
  const cells = previousTable.cells.map((row, indexRow) =>
    row.map((cell, indexColumn) => {
      return { ...cell };
    }),
  );

  cells.push([...generatorCells(`y<sub>${previousTable.cells.length - 1}</sub>`, previousTable.cells[0].length - 1)]);

  return {
    element: null,
    isInteger: isInteger,
    cells: cells,
  };
}

export { initialIntegerSimplexTable };
