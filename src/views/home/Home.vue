<template>
  <section class="home">
    <div class="home__main-image main-image">
      <img class="main-image__body" :src="mainImageSrc" alt="main image" />
    </div>
    <h1 class="home__title">Обучающие программы</h1>
    <p class="home__description">На сайте представлены программы для решения задач в рамках курса “Экономико-математические методы и модели”</p>
    <ul class="home__list">
      <li v-for="item in homeItems" :key="item.title" class="home__item">
        <a :href="item.download" target="_blank" download class="home__link">
          <emmm-icon icon="exclamationMark" :size="40" class="home__emmm-icon" />
        </a>
        <span class="home__text">{{ item.title }}</span>
      </li>
    </ul>
    <section class="home__author-section author-section">
      <h2 class="author-section__title">Авторы:</h2>
      <ul class="author-section__list">
        <li v-for="(author, index) in authors" class="author-section__item" :key="index">{{ author }}</li>
      </ul>
    </section>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmIcon } from '@/components';
import mainImage from './mainImage';

type tHomeItem = {
  title: string;
  download: string;
};

@Options({
  name: 'Home',
  components: {
    EmmmIcon,
  },
})
export default class Home extends Vue {
  get mainImageSrc(): string {
    return mainImage;
  }

  get homeItems(): tHomeItem[] {
    return [
      { title: 'Геометрический метод', download: this.mainImageSrc },
      { title: 'Симплекс-метод', download: '' },
      { title: 'Метод потенциалов', download: '' },
      { title: 'Сетевое планирование', download: '' },
      { title: 'Инструкции', download: '' },
    ];
  }

  get authors(): string[] {
    return ['Куликов Вадим', 'Зубкова Надежда'];
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding-top: 57px;

  &__main-image {
    display: flex;
    justify-content: center;
  }

  &__title {
    font-size: 48px;
    margin-bottom: 40px;
    text-align: center;
  }

  &__description {
    display: inline-block;
    width: 100%;
    margin-bottom: 60px;
    text-align: center;
  }

  &__list {
    margin-bottom: 40px;
  }

  &__item {
    display: flex;
    align-items: center;
    align-content: center;

    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }

  &__link {
    display: flex;
    align-content: center;
    margin-right: 20px;
    fill: var(--yellow-color);
  }
}

.main-image {
  margin-bottom: 40px;
}

.author-section {
  &__title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
}
</style>
