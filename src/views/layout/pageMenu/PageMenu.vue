<template>
  <section class="page-menu page-menu_active">
    <nav class="page-menu__nav nav">
      <ul class="nav__list">
        <li v-for="item in menuList" :key="item.key" class="nav__item">
          <button type="button" class="nav__link" :class="item.isActive" @click="changePage(item.key)"> {{ item.title }} </button>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { InjectReactive } from 'vue-property-decorator';
import { Component } from 'vue';
import { tMenuItem, tMenuItems } from '@/types';
import { routerNameEnum } from '@/enums';

@Options({
  name: 'PageMenu',
})
export default class PageMenu extends Vue {
  get menuList(): tMenuItem[] {
    return [...this.menuItems].map(item => ({ ...item, isActive: { active: item.key === this.activePage } }));
  }

  @InjectReactive() menuItems!: tMenuItems;
  @InjectReactive() changePage!: (component: Component) => void;
  @InjectReactive() activePage!: routerNameEnum;
}
</script>

<style lang="scss" scoped>
.page-menu {
  min-width: 100px;
  background-color: var(--light-green-color);

  &_active {
    min-width: 340px;
  }

  &__nav {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
  }
}

.nav {
  padding-top: 74px;

  &__link {
    display: flex;
    width: 100%;
    padding: 10px 22px;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &.active {
      background-color: var(--blue-color);
    }
  }
}
</style>
