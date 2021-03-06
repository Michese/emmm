import { Component } from 'vue';
import { routerNameEnum } from '@/enums';

type tMenuItem = {
  icon: string;
  title: string;
  to: Component;
  key: keyof typeof routerNameEnum;
  isActive?: {
    active: boolean;
  };
};

type tMenuItems = {
  [routerNameEnum.Home]: tMenuItem;
  [routerNameEnum.GeometricMethod]: tMenuItem;
  [routerNameEnum.Simplex]: tMenuItem;
  [routerNameEnum.MethodOfPotentials]: tMenuItem;
  [routerNameEnum.NetworkPlanning]: tMenuItem;
  [routerNameEnum.InvestmentOfFunds]: tMenuItem;
  [routerNameEnum.RedistributionOfFunds]: tMenuItem;
  [Symbol.iterator]: () => Generator<tMenuItem, void, unknown>;
};

export { tMenuItem, tMenuItems };
