import { tNewWork, tOldWork } from '@/views/networkPlanning/component';

function generatorNewWorks(sortedOldWorks: (tOldWork & { oldDesignation: number })[], oldWorks: tOldWork[]): tNewWork[] {
  return sortedOldWorks.map(sortedOldWork => ({
    reliesOn: sortedOldWork.reliesOn
      .map(relyOn => ({
        value: relyOn.value ? oldWorks[relyOn.value! - 1].designation!.value : null,
        borderColor: null,
      }))
      .sort((left, right) =>
        left.value === right.value ? 0 : left.value === null ? 1 : right.value === null ? -1 : left.value > right.value ? 1 : -1,
      ),
    time: { value: sortedOldWork.time.value, borderColor: null },
    totalTime: { value: null, borderColor: null },
  }));
}

export { generatorNewWorks };
