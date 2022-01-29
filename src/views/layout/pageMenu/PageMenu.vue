<template>
  <section class="page-menu" :class="pageMenuClasses">
    <nav class="page-menu__nav nav">
      <button class="nav__arrow" @click="arrowClick"> > </button>
      <ul class="nav__list">
        <li v-for="item in menuList" :key="item.key" class="nav__item">
          <div class="nav__link" :class="item.isActive" @click="changePage(item.key)">
            <span>{{ item.title }}</span>
            <EmmmIcon icon="question" class="nav__icon" />
          </div>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { InjectReactive, Watch } from 'vue-property-decorator';
import { Component } from 'vue';
import { tMenuItem, tMenuItems } from '@/types';
import { routerNameEnum } from '@/enums';
import { EmmmIcon, iconNames } from '@/components';
@Options({
  name: 'PageMenu',
  components: { EmmmIcon },
})
export default class PageMenu extends Vue {
  isActiveMenu = true;

  @Watch('isActiveMenu') wIsActiveMenu(): void {
    sessionStorage.setItem('isActiveMenu', JSON.stringify(this.isActiveMenu));
    if (this.isActiveMenu) {
      document.querySelector('html')!.style.setProperty('--container-width', '1200px');
    } else {
      document.querySelector('html')!.style.setProperty('--container-width', '1500px');
    }
  }

  get menuList(): tMenuItem[] {
    return [...this.menuItems].map(item => ({ ...item, isActive: { active: item.key === this.activePage } }));
  }

  get pageMenuClasses(): { 'page-menu_active': boolean } {
    return { 'page-menu_active': this.isActiveMenu };
  }

  arrowClick(): void {
    this.isActiveMenu = !this.isActiveMenu;
  }

  created(): void {
    const isActiveMenuJSON = sessionStorage.getItem('isActiveMenu');
    if (isActiveMenuJSON) {
      this.isActiveMenu = JSON.parse(isActiveMenuJSON);
    }
  }

  @InjectReactive() menuItems!: tMenuItems;
  @InjectReactive() changePage!: (component: Component) => void;
  @InjectReactive() activePage!: routerNameEnum;
}
</script>

<style lang="scss" scoped>
.page-menu {
  width: 350px;
  margin-left: -300px;
  background-color: var(--light-green-color);
  transition: margin-left 0.3s linear;

  &_active {
    margin-left: 0;

    & .nav__arrow {
      transform: rotate(180deg);
    }
  }

  &:hover .nav__arrow {
    display: flex;
  }

  &__nav {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
  }
}

.nav {
  padding-top: 74px;

  &__arrow {
    display: none;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: -15px;
    top: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background-color: var(--blue-color);
    outline: none;
    cursor: pointer;
  }

  &__link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    width: 100%;
    padding: 10px 10px 10px 22px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-align: left;

    &.active {
      background-color: var(--blue-color);
    }
  }

  &__icon {
    min-width: 30px;
    min-height: 30px;
    fill: var(--dark-blue-color);
  }
}
</style>
