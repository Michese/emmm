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
import initialMenuItems from '@/initialMenuItems';

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
    return initialMenuItems;
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
