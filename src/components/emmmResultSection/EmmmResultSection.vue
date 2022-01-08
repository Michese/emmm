<template>
  <section class="emmm-result-section">
    <div class="emmm-result-section__inner">
      <emmm-icon icon="success" :size="92" class="emmm-result-section__icon" />
      <div class="emmm-result-section__body">
        <span class="emmm-result-section__text">Решение найдено!</span>
        <span v-if="errors !== null" class="emmm-result-section__text">Допущено ошибок: {{ errors }}</span>
      </div>
    </div>
    <footer class="emmm-result-section__footer">
      <emmm-button @click="$emit('back')" class="emmm-result-section__back-btn">Назад</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon } from '@/components';
import { Prop } from 'vue-property-decorator';

@Options({
  name: 'EmmmResultSection',
  components: { EmmmIcon, EmmmButton },
  emits: ['back'],
})
export default class EmmmResultSection extends Vue {
  @Prop({
    type: Number,
    required: false,
    default: () => null,
  })
  errors!: number | null;
}
</script>

<style lang="scss" scoped>
.emmm-result-section {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;

  &__inner {
    display: flex;
    margin-bottom: 20px;
  }

  &__icon {
    margin-right: 35px;
    fill: var(--success-color);
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  &__text {
    &:not(:first-child) {
      margin-top: 11px;
    }
  }

  &__footer {
    align-self: flex-end;
  }
}
</style>
