import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { routerNameEnum } from '@/router/enums';
import Home from '@/views/home/Home.vue';
import GeometricMethod from '@/views/geometricMethod/GeometricMethod.vue';
import Simplex from '@/views/simplex/Simplex.vue';
import MethodOfPotentials from '@/views/methodOfPotentials/MethodOfPotentials.vue';
import NetworkPlanning from '@/views/networkPlanning/NetworkPlanning.vue';
import Instructions from '@/views/instructions/Instructions.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: to => ({ name: routerNameEnum.Home }),
  },
  {
    path: '/home',
    name: routerNameEnum.Home,
    component: Home,
  },
  {
    path: '/geometric-method',
    name: routerNameEnum.GeometricMethod,
    component: GeometricMethod,
  },
  {
    path: '/simplex',
    name: routerNameEnum.Simplex,
    component: Simplex,
  },
  {
    path: '/method-of-potentials',
    name: routerNameEnum.MethodOfPotentials,
    component: MethodOfPotentials,
  },
  {
    path: '/network-planning',
    name: routerNameEnum.NetworkPlanning,
    component: NetworkPlanning,
  },
  {
    path: '/instructions',
    name: routerNameEnum.Instructions,
    component: Instructions,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export * from './enums';
export default router;
