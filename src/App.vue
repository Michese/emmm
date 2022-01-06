<template>
  <emmm-sprite />
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
import { EmmmSprite } from '@/components';

@Options({
  name: 'App',
  components: {
    PageMenu,
    EmmmSprite,
  },
})
export default class App extends Vue {}
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
