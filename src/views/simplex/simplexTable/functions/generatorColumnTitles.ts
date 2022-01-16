function* generatorColumnTitles(columns: number, isInitial = false): Generator<string> {
  yield ``;

  for (let column = 1; column < columns; column++) {
    yield `B<sub>${column}</sub>`;
  }

  yield isInitial ? `Всего` : 'a<sub>i</sub>';
}

export { generatorColumnTitles };
