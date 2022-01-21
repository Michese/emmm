import { tOldWork, generatorReliesOn } from '@/views/networkPlanning/component';

function* generatorOldWorks(countWorks: number, countRows: number): Generator<tOldWork> {
  for (let countWork = 0; countWork < countWorks; countWork++) {
    yield {
      designation: null,
      reliesOn: [...generatorReliesOn(countRows)],
      time: { value: null, borderColor: null },
    };
  }
}

export { generatorOldWorks };
