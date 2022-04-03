<template>
  <emmm-sprite />
  <emmm-error-modal ref="errorModal" />
  <div class="app">
    <page-menu class="app__menu"></page-menu>
    <main class="app__main">
      <component :is="menuItems[activePage].to" />
    </main>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageMenu from '@/views/layout/pageMenu/PageMenu.vue';
import { EmmmErrorModal, EmmmSprite } from '@/components';
import { ProvideReactive, Watch } from 'vue-property-decorator';
import { tMenuItems } from '@/types';
import { routerNameEnum } from '@/enums';
import Home from '@/views/home/Home.vue';
import GeometricMethod from '@/views/geometricMethod/GeometricMethod.vue';
import Simplex from '@/views/simplex/Simplex.vue';
import MethodOfPotentials from '@/views/methodOfPotentials/MethodOfPotentials.vue';
import NetworkPlanning from '@/views/networkPlanning/NetworkPlanning.vue';
import RedistributionOfFunds from '@/views/redistributionOfFunds/RedistributionOfFunds.vue';
import InvestmentOfFunds from '@/views/investmentOfFunds/InvestmentOfFunds.vue';

@Options({
  name: 'App',
  components: {
    PageMenu,
    EmmmSprite,
    EmmmErrorModal,
  },
})
export default class App extends Vue {
  declare $refs: {
    errorModal: { showModal: (message: string) => void };
  };

  @ProvideReactive('activePage') activePage: string = routerNameEnum.Home;

  @Watch('activePage', { deep: true }) wActivePage(): void {
    sessionStorage.setItem('activePage', this.activePage);
  }

  @ProvideReactive('menuItems')
  get menuItems(): tMenuItems {
    return {
      [routerNameEnum.Home]: {
        icon: 'home',
        title: 'Главная',
        key: routerNameEnum.Home,
        to: Home,
      },
      [routerNameEnum.GeometricMethod]: {
        icon: 'geometry',
        title: 'Геометрический метод',
        key: routerNameEnum.GeometricMethod,
        to: GeometricMethod,
      },
      [routerNameEnum.Simplex]: {
        icon: 'table',
        title: 'Симплекс-метод',
        key: routerNameEnum.Simplex,
        to: Simplex,
      },
      [routerNameEnum.MethodOfPotentials]: {
        icon: 'car',
        title: 'Метод потенциалов',
        key: routerNameEnum.MethodOfPotentials,
        to: MethodOfPotentials,
      },
      [routerNameEnum.NetworkPlanning]: {
        icon: 'graph',
        title: 'Сетевое планирование',
        key: routerNameEnum.NetworkPlanning,
        to: NetworkPlanning,
      },
      [routerNameEnum.RedistributionOfFunds]: {
        icon: 'time',
        title: 'Перераспределение средств',
        key: routerNameEnum.RedistributionOfFunds,
        to: RedistributionOfFunds,
      },
      [routerNameEnum.InvestmentOfFunds]: {
        icon: 'database',
        title: 'Вложение средств',
        key: routerNameEnum.InvestmentOfFunds,
        to: InvestmentOfFunds,
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
  }

  @ProvideReactive('changePage')
  changePage(component: string): void {
    this.activePage = component;
  }

  @ProvideReactive('openErrorModal')
  openErrorModal(message: string): void {
    this.$refs.errorModal.showModal(message);
  }

  created(): void {
    const activePage = sessionStorage.getItem('activePage');
    if (activePage) this.activePage = activePage;
  }
}
</script>

<style lang="scss">
.app {
  display: flex;
  min-height: 100vh;

  &__main {
    flex: 1 1;
  }
}
</style>
