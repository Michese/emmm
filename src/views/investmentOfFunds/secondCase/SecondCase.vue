<template>
  <div class="second-case">
    <span class="second-case__top">
      <span class="second-case__title">Проверка II условия</span>
      <a :href="secondCaseHelp" target="_blank" download="Проверка II условия" class="second-case__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="second-case__intermediate-section">
      <span>
        Т<sub>кр</sub> =
        <emmm-input
          :disabled="!isCurrentStep || !!secondCase.conditions"
          type="number"
          :value="secondCase.criticalTime"
          @input="$event => (secondCase.criticalTime = +$event.target.value)"
          class="second-case__input"
        />
      </span>

      <span>
        &#916;Т = Т<sub>кр</sub> - Т<sub>o</sub> =
        <emmm-input
          :disabled="!isCurrentStep || !!secondCase.conditions"
          type="number"
          :value="secondCase.differenceTime"
          @input="$event => (secondCase.differenceTime = +$event.target.value)"
          class="second-case__input"
        />
      </span>
    </div>

    <div class="second-case__body">
      <div v-for="(condition, index) in secondCase.conditions" :key="`condition_${index}`" class="second-case__condition">
        <span class="second-case__equation">
          t<sup>o</sup><sub>{{ 2 * index + 1 }}</sub> - &#916;Т =
          <emmm-input
            type="number"
            :disabled="!isCurrentStep || index !== secondCase.conditions.length - 1"
            :value="condition.coef"
            @input="$event => (condition.coef = +$event.target.value)"
            class="second-case__input"
          />
          -
          <emmm-input
            type="number"
            :disabled="!isCurrentStep || index !== secondCase.conditions.length - 1"
            :value="condition.differenceTime"
            @input="$event => (condition.differenceTime = +$event.target.value)"
            class="second-case__input"
          />
          = {{ results[index] }}
          <button
            type="button"
            :disabled="!isCurrentStep || index !== secondCase.conditions.length - 1 || condition.isMore"
            @click="condition.isMore = true"
            class="second-case__toggle"
            :class="{ checked: condition.isMore }"
          >
            >
          </button>
          <button
            type="button"
            :disabled="!isCurrentStep || index !== secondCase.conditions.length - 1 || (condition.isMore !== null && !condition.isMore)"
            @click="condition.isMore = false"
            class="second-case__toggle"
            :class="{ checked: condition.isMore !== null && !condition.isMore }"
            >&#8804;</button
          >
          t<sub>{{ 2 * index + 2 }}</sub> =
          <emmm-input
            type="number"
            :disabled="!isCurrentStep || index !== secondCase.conditions.length - 1"
            :value="condition.t"
            @input="$event => (condition.t = +$event.target.value)"
            class="second-case__input"
          />
        </span>
        <div class="second-case__radio">
          <emmm-radio
            v-for="radioValue in radioValues"
            :key="`radio_${radioValue}`"
            :currentValue="condition.isComplete"
            @input="condition.isComplete = $event.target.value"
            :value="radioValue.value"
            :disabled="!isCurrentStep || index !== secondCase.conditions.length - 1"
            :id="`${radioValue.value}-${index}`"
            :name="`condition-radio_${index}`"
            :label="radioValue.title"
          />
        </div>
      </div>
    </div>

    <footer v-if="isCurrentStep" class="second-case__footer">
      <emmm-button @click="backBtnClick" class="second-case__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkSecondCase" class="second-case__apply-btn">Далее</emmm-button>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput, EmmmRadio } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tSecondCase } from '@/views/investmentOfFunds/component';
import secondCaseHelp from './secondCaseHelp';

@Options({
  name: 'SecondCase',
  components: { EmmmButton, EmmmIcon, EmmmInput, EmmmRadio },
  emits: ['apply', 'back'],
})
export default class SecondCase extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  secondCase!: tSecondCase;

  get checkSecondCase(): boolean {
    return (
      (this.secondCase.differenceTime !== null && this.secondCase.criticalTime !== null && this.secondCase.conditions === null) ||
      (this.secondCase.conditions !== null &&
        this.secondCase.conditions.every(
          condition => condition.differenceTime !== null && condition.t !== null && condition.isMore !== null && condition.coef !== null,
        ))
    );
  }

  get results(): string[] {
    return this.secondCase.conditions!.map(condition =>
      condition.coef && condition.differenceTime ? (condition.coef - condition.differenceTime).toString() : '',
    );
  }

  get radioValues(): { title: string; value: string }[] {
    return [
      {
        title: 'условие выполнено',
        value: 'complete',
      },
      {
        title: 'условие не выполнено',
        value: 'uncomplete',
      },
    ];
  }

  get secondCaseHelp(): string {
    return secondCaseHelp;
  }

  applyBtnClick(): void {
    if (this.checkSecondCase) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.second-case {
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__intermediate-section {
    display: flex;
    gap: 25px;
    margin-bottom: 25px;
  }

  &__input {
    max-width: 110px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  &__toggle {
    width: 40px;
    height: 40px;
    background-color: var(--light-green-color);
    border: none;
    outline: none;
    border-radius: 10px;
    margin-left: 5px;
    color: var(--gray-color);
    cursor: pointer;

    &:hover,
    &:focus {
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.3);
      color: rgba(0, 0, 0, 1);
    }

    &:disabled {
      background-color: var(--turquoise-color);
      box-shadow: none;
      cursor: default;
      color: var(--gray-color);
    }

    &.checked {
      color: black;
      background-color: var(--light-green-color);
      outline: 2px solid var(--blue-color);
    }
  }

  &__radio {
    margin-top: 15px;
    margin-bottom: 20px;
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
