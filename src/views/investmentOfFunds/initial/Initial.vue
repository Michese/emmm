<template>
  <section class="initial">
    <div class="initial__header">
      <template v-if="isCurrentStep">
        <EmmmButton :background="manuallyButtonBgc" @click="manuallyButtonClick" :disabled="isManually">Создать</EmmmButton>
        <EmmmButton :background="loadButtonBgc" @click="loadButtonClick" :disabled="!isManually">Загрузить</EmmmButton>
      </template>
    </div>

    <emmm-upload class="initial__emmm-upload" v-if="!isManually && isCurrentStep" @upload="$emit('upload', $event)" />

    <span class="initial__top">
      <span class="initial__title">Условие</span>
      <a :href="initialHelp" target="_blank" download="Условие" class="initial__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="initial__conditions">
      <div class="initial__column">
        <span v-for="(condition, index) in conditions.coefficients" :key="`condition_${index}`" class="initial__condition">
          t<sub>{{ index * 2 + 1 }}</sub> =
          <emmm-input
            :disabled="!isCurrentStep"
            type="number"
            :value="condition.t"
            @input="$event => (condition.t = +$event.target.value)"
            class="initial__input"
          />
          (1 -
          <emmm-input
            :disabled="!isCurrentStep"
            type="number"
            :value="condition.x"
            @input="$event => (condition.x = +$event.target.value)"
            class="initial__input"
          />
          x<sub>{{ index * 2 + 1 }}</sub>
          ),
        </span>
      </div>
      <div class="initial__column">
        <span v-for="(condition, index) in conditions.coefficients" :key="`condition_${index}`" class="initial__condition">
          0 &#8804; x<sub>{{ index * 2 + 1 }}</sub> &#8804;
          <emmm-input
            :disabled="!isCurrentStep"
            type="number"
            :value="condition.upperBound"
            @input="$event => (condition.upperBound = +$event.target.value)"
            class="initial__input"
          />
        </span>
      </div>
    </div>

    <div class="initial__coefficients">
      <span>
        t<sub>2</sub> =
        <emmm-input
          :disabled="!isCurrentStep"
          type="number"
          :value="conditions.t2"
          @input="$event => (conditions.t2 = +$event.target.value)"
          class="initial__input"
        />
      </span>
      <span>
        t<sub>4</sub> =
        <emmm-input
          :disabled="!isCurrentStep"
          type="number"
          :value="conditions.t4"
          @input="$event => (conditions.t4 = +$event.target.value)"
          class="initial__input"
        />
      </span>
      <span>
        t<sub>6</sub> =
        <emmm-input
          :disabled="!isCurrentStep"
          type="number"
          :value="conditions.t6"
          @input="$event => (conditions.t6 = +$event.target.value)"
          class="initial__input"
        />
      </span>
      <span>
        T<sub>0</sub> =
        <emmm-input
          :disabled="!isCurrentStep"
          type="number"
          :value="conditions.T0"
          @input="$event => (conditions.T0 = +$event.target.value)"
          class="initial__input"
        />
      </span>
    </div>

    <footer v-if="isCurrentStep" class="initial__apply-btn">
      <emmm-button @click="applyBtnClick" :disabled="!checkConditions">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { tConditions } from '@/views/investmentOfFunds/component';
import { colorEnum, EmmmButton, EmmmIcon, EmmmInput, EmmmUpload } from '@/components';
import initialHelp from './initialHelp';

@Options({
  name: 'Initial',
  components: { EmmmButton, EmmmIcon, EmmmUpload, EmmmInput },
  emits: ['apply', 'upload'],
})
export default class Initial extends Vue {
  isManually = true;

  @Prop({
    type: Object,
    required: true,
  })
  conditions!: tConditions;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: tConditions;

  get manuallyButtonBgc(): string {
    return this.isManually ? colorEnum.blue : colorEnum.lightGreen;
  }

  get loadButtonBgc(): string {
    return this.isManually ? colorEnum.lightGreen : colorEnum.blue;
  }

  get checkConditions(): boolean {
    return (
      this.conditions.t2 !== null &&
      this.conditions.t4 !== null &&
      this.conditions.t6 !== null &&
      this.conditions.T0 !== null &&
      this.conditions.coefficients.every(coef => coef.t !== null && coef.x !== null && coef.upperBound !== null)
    );
  }

  get initialHelp(): string {
    return initialHelp;
  }

  manuallyButtonClick(): void {
    this.isManually = true;
  }

  loadButtonClick(): void {
    this.isManually = false;
  }

  applyBtnClick(): void {
    if (this.checkConditions) this.$emit('apply');
  }
}
</script>

<style lang="scss" scoped>
.initial {
  margin-bottom: 25px;

  &__header {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 30px;
  }

  &__emmm-upload {
    margin-bottom: 20px;
  }

  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__conditions {
    display: flex;
    gap: 100px;
    margin-bottom: 20px;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__input {
    max-width: 110px;
  }

  &__coefficients {
    display: flex;
    gap: 25px;
    margin-bottom: 25px;
  }

  &__apply-btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
