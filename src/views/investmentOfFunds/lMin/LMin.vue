<template>
  <section class="l-min">
    <span class="l-min__top">
      <span class="l-min__title">Решение задачи линейного программирования</span>
      <a href="#" target="_blank" download class="l-min__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="l-min__body">
      <span class="l-min__line"> L = X<sub>1</sub> + X<sub>3</sub> + X<sub>5</sub> + X<sub>7</sub> &#10142; min </span>
      <span class="l-min__line">
        <template v-for="(coef, index) in lMin.coefficients" :key="`coefficient_${index}`">
          -
          <emmm-input
            :disabled="!isCurrentStep"
            :value="coef.x"
            @input="$event => (coef.x = +$event.target.value)"
            class="l-min__input"
            type="number"
          />
          X<sub>{{ index * 2 + 1 }}</sub>
        </template>
        &#8804; -
        <emmm-input
          :disabled="!isCurrentStep"
          :value="lMin.result"
          @input="$event => (lMin.result = +$event.target.value)"
          class="l-min__input"
          type="number"
        />
      </span>
      <span v-for="(coef, index) in coefficients" :key="`coefficient_${index}`" class="l-min__line">
        0 &#8804; X<sub>{{ index * 2 + 1 }}</sub> &#8804; {{ coef.upperBound }}
      </span>
    </div>

    <footer v-if="isCurrentStep" class="l-min__footer">
      <emmm-button @click="backBtnClick" class="l-min__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkLMin" class="l-min__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tCoefficient, tLmin } from '@/views/investmentOfFunds/component';

@Options({
  name: 'LMin',
  components: { EmmmButton, EmmmIcon, EmmmInput },
  emits: ['apply', 'back'],
})
export default class LMin extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Object,
    required: false,
    default: () => false,
  })
  lMin!: tLmin;

  @Prop({
    type: Array,
    required: true,
  })
  coefficients!: tCoefficient[];

  get checkLMin(): boolean {
    return this.lMin.result !== null && this.lMin.coefficients.every(coef => coef.x !== null);
  }

  applyBtnClick(): void {
    if (this.checkLMin) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.l-min {
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__input {
    max-width: 110px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__back-btn {
    margin-right: 20px;
  }
}
</style>
