import { routerNameEnum } from '@/enums';
import { defineAsyncComponent, markRaw } from 'vue';
import { tMenuItems } from '@/types';

export default (function (): tMenuItems {
  return {
    [routerNameEnum.Home]: {
      icon: 'home',
      title: 'Главная',
      key: routerNameEnum.Home,
      to: markRaw(defineAsyncComponent(() => import('@/views/home/Home.vue'))),
    },
    [routerNameEnum.GeometricMethod]: {
      icon: 'geometry',
      title: 'Геометрический метод',
      key: routerNameEnum.GeometricMethod,
      to: markRaw(defineAsyncComponent(() => import('@/views/geometricMethod/GeometricMethod.vue'))),
    },
    [routerNameEnum.Simplex]: {
      icon: 'table',
      title: 'Симплекс-метод',
      key: routerNameEnum.Simplex,
      to: markRaw(defineAsyncComponent(() => import('@/views/simplex/Simplex.vue'))),
    },
    [routerNameEnum.MethodOfPotentials]: {
      icon: 'car',
      title: 'Метод потенциалов',
      key: routerNameEnum.MethodOfPotentials,
      to: markRaw(defineAsyncComponent(() => import('@/views/methodOfPotentials/MethodOfPotentials.vue'))),
    },
    [routerNameEnum.NetworkPlanning]: {
      icon: 'graph',
      title: 'Сетевое планирование',
      key: routerNameEnum.NetworkPlanning,
      to: markRaw(defineAsyncComponent(() => import('@/views/networkPlanning/NetworkPlanning.vue'))),
    },
    [routerNameEnum.RedistributionOfFunds]: {
      icon: 'time',
      title: 'Перераспределение средств',
      key: routerNameEnum.RedistributionOfFunds,
      to: markRaw(defineAsyncComponent(() => import('@/views/redistributionOfFunds/RedistributionOfFunds.vue'))),
    },
    [routerNameEnum.InvestmentOfFunds]: {
      icon: 'database',
      title: 'Вложение средств',
      key: routerNameEnum.InvestmentOfFunds,
      to: markRaw(defineAsyncComponent(() => import('@/views/investmentOfFunds/InvestmentOfFunds.vue'))),
    },
    *[Symbol.iterator]() {
      yield this[routerNameEnum.Home];
      yield this[routerNameEnum.GeometricMethod];
      yield this[routerNameEnum.Simplex];
      yield this[routerNameEnum.MethodOfPotentials];
      yield this[routerNameEnum.NetworkPlanning];
      yield this[routerNameEnum.RedistributionOfFunds];
      yield this[routerNameEnum.InvestmentOfFunds];
    },
  };
})();
