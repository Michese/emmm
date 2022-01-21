import { tPath } from '@/views/networkPlanning/component';

function createUuid(): string {
  return `cell_${Math.random() * 1000000}`;
}

function initialPath(): tPath {
  return {
    borderColor: null,
    childs: [],
    uuid: createUuid(),
    value: null,
  };
}

export { initialPath, createUuid };
