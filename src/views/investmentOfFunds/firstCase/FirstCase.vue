<template>
  <section class="first-case">
    <span class="first-case__top">
      <span class="first-case__title">Проверка I условия</span>
      <a href="#" target="_blank" download class="first-case__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="first-case__body">
      <div v-for="(condition, index) in firstCase" :key="`condition_${index}`" class="first-case__condition">
        <span class="first-case__equation">
          t<sub>{{ 2 * index + 1 }} min</sub> =
          <emmm-input
            type="number"
            :disabled="!isCurrentStep || index !== firstCase.length - 1"
            :value="condition.coef"
            @input="$event => (condition.coef = +$event.target.value)"
            class="first-case__input"
          />
          (1 -
          <emmm-input
            type="number"
            :disabled="!isCurrentStep || index !== firstCase.length - 1"
            :value="condition.a"
            @input="$event => (condition.a = +$event.target.value)"
            class="first-case__input"
          />
          &#215;
          <emmm-input
            type="number"
            :disabled="!isCurrentStep || index !== firstCase.length - 1"
            :value="condition.x"
            @input="$event => (condition.x = +$event.target.value)"
            class="first-case__input"
          />
          ) = {{ results[index] }}
          <button
            type="button"
            :disabled="!isCurrentStep || index !== firstCase.length - 1 || condition.isMore"
            @click="condition.isMore = true"
            class="first-case__toggle"
            :class="{ checked: condition.isMore }"
          >
            >
          </button>
          <button
            type="button"
            :disabled="!isCurrentStep || index !== firstCase.length - 1 || (condition.isMore !== null && !condition.isMore)"
            @click="condition.isMore = false"
            class="first-case__toggle"
            :class="{ checked: condition.isMore !== null && !condition.isMore }"
            >&#8804;</button
          >
          t<sub>{{ 2 * index + 2 }}</sub> =
          <emmm-input
            type="number"
            :disabled="!isCurrentStep || index !== firstCase.length - 1"
            :value="condition.t"
            @input="$event => (condition.t = +$event.target.value)"
            class="first-case__input"
          />
        </span>

        <div class="first-case__radio">
          <emmm-radio
            v-for="radioValue in radioValues"
            :key="`radio_${radioValue}`"
            :currentValue="condition.isComplete"
            @input="condition.isComplete = $event.target.value"
            :value="radioValue.value"
            :disabled="!isCurrentStep || index !== firstCase.length - 1"
            :id="`${radioValue.value}-${index}`"
            :name="`condition-radio_${index}`"
            :label="radioValue.title"
          />
        </div>
      </div>
    </div>

    <footer v-if="isCurrentStep" class="first-case__footer">
      <emmm-button @click="backBtnClick" class="first-case__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkFirstCase" class="first-case__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput, EmmmRadio } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tFirstCase } from '@/views/investmentOfFunds/component';

@Options({
  name: 'FirstCase',
  components: { EmmmButton, EmmmIcon, EmmmInput, EmmmRadio },
  emits: ['apply', 'back'],
})
export default class FirstCase extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Array,
    required: true,
  })
  firstCase!: tFirstCase[];

  get checkFirstCase(): boolean {
    const { x, a, t, coef, isMore } = this.firstCase[this.firstCase.length - 1];
    return x !== null && a !== null && t !== null && coef !== null && isMore !== null;
  }

  get results(): string[] {
    return this.firstCase.map(coef =>
      coef.coef !== null && coef.a !== null && coef.x !== null ? (Math.round(coef.coef * (1 - coef.a * coef.x) * 100) / 100).toString() : ' ',
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

  applyBtnClick(): void {
    if (this.checkFirstCase) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.first-case {
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
    margin-bottom: 20px;
  }

  &__input {
    max-width: 110px;
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

.question {
  display: flex;
  align-items: center;

  &__icon {
    fill: var(--dark-blue-color);
    transition: transform linear 0.05s;

    &:hover {
      transform: scale3d(1.2, 1.2, 1.2);
    }
  }
}
</style>
