<template>
  <section class="page-menu page-menu_active">
    <nav class="page-menu__nav nav">
      <ul class="nav__list">
        <li v-for="item in menuItems" :key="item.title" class="nav__item">
          <router-link :to="item.to" class="nav__link" active-class="nav__link_active"> {{ item.title }} </router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { RouteLocationRaw } from 'vue-router';
import { routerNameEnum } from '@/router';

type tMenuItem = {
  title: string;
  to: RouteLocationRaw;
};

@Options({
  name: 'PageMenu',
})
export default class PageMenu extends Vue {
  get menuItems(): tMenuItem[] {
    return [
      { title: 'Главная', to: { name: routerNameEnum.Home } },
      { title: 'Геометрический метод', to: { name: routerNameEnum.GeometricMethod } },
      { title: 'Симплекс-метод', to: { name: routerNameEnum.Simplex } },
      { title: 'Метод потенциалов', to: { name: routerNameEnum.MethodOfPotentials } },
      { title: 'Сетевое планирование', to: { name: routerNameEnum.NetworkPlanning } },
      { title: 'Инструкции', to: { name: routerNameEnum.Instructions } },
    ];
  }
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

    &_active {
      background-color: var(--blue-color);
    }
  }
}
</style>
