import { Component } from 'vue';
import { routerNameEnum } from '@/enums';

type tMenuItem = {
  title: string;
  to: Component;
  key: keyof typeof routerNameEnum;
  active?: boolean;
};

type tMenuItems = {
  [routerNameEnum.Home]: tMenuItem;
  [routerNameEnum.GeometricMethod]: tMenuItem;
  [routerNameEnum.Simplex]: tMenuItem;
  [routerNameEnum.MethodOfPotentials]: tMenuItem;
  [routerNameEnum.NetworkPlanning]: tMenuItem;
  [routerNameEnum.Instructions]: tMenuItem;
  [Symbol.iterator]: () => Generator<tMenuItem, void, unknown>;
};

export { tMenuItem, tMenuItems };
