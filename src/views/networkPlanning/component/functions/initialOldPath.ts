import { createUuid, tOldWork, tPath } from '@/views/networkPlanning/component';

function initialOldPath(newPaths: tPath[], sortedDesignations: (tOldWork & { oldDesignation: number })[]): tPath[] {
  return newPaths.map(newPath => ({
    uuid: createUuid(),
    childs: initialOldPath(newPath.childs, sortedDesignations),
    value: sortedDesignations[newPath.value! - 1].oldDesignation + 1,
    borderColor: null,
  }));
}

export { initialOldPath };
