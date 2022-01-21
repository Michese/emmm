import { tCellInput } from '@/views/networkPlanning/component';

function* generatorReliesOn(countReliesOn: number): Generator<tCellInput> {
  for (let count = 0; count < countReliesOn; count++) {
    yield { value: null, borderColor: null };
  }
}

export { generatorReliesOn };
