function* generatorRowTitles(rows: number, isInitial = false): Generator<string> {
  for (let row = 1; row < rows; row++) {
    yield `A<sub>${row}</sub>`;
  }

  yield isInitial ? `Всего` : 'b<sub>i</sub>';
}

export { generatorRowTitles };
