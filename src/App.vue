<template>
  <emmm-sprite />
  <emmm-error-modal ref="errorModal" />
  <div class="app">
    <page-menu class="app__menu"></page-menu>
    <main class="app__main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageMenu from '@/views/layout/pageMenu/PageMenu.vue';
import { EmmmErrorModal, EmmmSprite } from '@/components';
import { Provide } from 'vue-property-decorator';

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

  @Provide()
  openErrorModal(message: string): void {
    this.$refs.errorModal.showModal(message);
  }

  mounted(): void {
    this.openErrorModal('Привет, мир!');
  }
}
</script>

<style lang="scss">
.app {
  display: flex;
  min-height: 100vh;

  &__main {
    flex: 1 1;
    padding: 15px;
  }
}
</style>
