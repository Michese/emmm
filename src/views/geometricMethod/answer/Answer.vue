<template>
  <section class="answer">
    <span class="answer__top">
      <span class="answer__title">Ответ</span>
      <a href="#" target="_blank" download class="answer__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>
    <div class="answer__inner">
      <div class="answer__radios">
        <emmm-radio
          v-for="radioValue in radioValues"
          :key="`radio_${radioValue}`"
          :currentValue="answer.radio"
          @input="onChangeRadio($event.target.value)"
          :value="radioValue.value"
          :id="radioValue.value"
          name="answer"
          :label="radioValue.title"
          class="answer__radio"
        />
      </div>
      <div v-if="!isNoSolution" class="answer__line line">
        <div class="line__point">
          X
          <emmm-input
            v-for="(point, index) in answer.points"
            :key="`vectorX_${index}`"
            :value="point.x"
            type="number"
            @input="$event => (point.x = +$event.target.value)"
            class="line__input"
            :placeholder="`X${index + 1}`"
            :disabled="!isCurrentStep"
          />
        </div>
        <div class="line__point">
          Y
          <emmm-input
            v-for="(point, indexPoint) in answer.points"
            :key="`vectorY_${indexPoint}`"
            :value="point.y"
            type="number"
            @input="$event => (point.y = +$event.target.value)"
            class="line__input"
            :placeholder="`Y${indexPoint + 1}`"
            :disabled="!isCurrentStep"
          />
        </div>
      </div>
    </div>

    <span class="answer__l-max" v-if="!isNoSolution">
      L<sub>max</sub> =
      <emmm-input
        :value="answer.Lmax"
        type="number"
        @input="$event => (answer.Lmax = +$event.target.value)"
        class="answer__input"
        :disabled="!isCurrentStep"
      />
    </span>

    <footer v-if="isCurrentStep" class="answer__footer">
      <emmm-button @click="backBtnClick" class="answer__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkAnswer" class="answer__apply-btn">Проверить</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput, EmmmRadio } from '@/components';
import { Emit, Prop } from 'vue-property-decorator';
import { tAnswer } from '@/views/geometricMethod/types';
import { radioAnswerEnum } from '@/views/geometricMethod/enums';
import changeRadioAnswer from '@/views/geometricMethod/changeRadioAnswer';

@Options({
  name: 'Answer',
  components: { EmmmIcon, EmmmButton, EmmmRadio, EmmmInput },
  emits: ['apply', 'back'],
})
export default class Answer extends Vue {
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
  answer!: tAnswer;

  get checkAnswer(): boolean {
    switch (this.answer.radio) {
      case radioAnswerEnum.point:
      case radioAnswerEnum.line:
        return !!this.answer.Lmax && this.answer.points.every(point => point.x && point.y);
      case radioAnswerEnum.noSolution:
        return true;
      default:
        throw new Error('Не существует такого значения radio!');
    }
  }

  get radioValues(): { title: string; value: string }[] {
    return [
      {
        title: 'Точка',
        value: radioAnswerEnum.point,
      },
      {
        title: 'Отрезок',
        value: radioAnswerEnum.line,
      },
      {
        title: 'Нет решения',
        value: radioAnswerEnum.noSolution,
      },
    ];
  }

  get isNoSolution(): boolean {
    return this.answer.radio === radioAnswerEnum.noSolution;
  }

  onChangeRadio(value: radioAnswerEnum): void {
    try {
      const { radio, points, Lmax } = changeRadioAnswer(value);
      this.answer.radio = radio;
      this.answer.points = points;
      this.answer.Lmax = Lmax;
    } catch (err) {
      console.error(err);
    }
  }

  applyBtnClick(): void {
    if (this.checkAnswer) this.apply();
  }

  backBtnClick(): void {
    this.back();
  }

  @Emit('apply') apply(): void {
    return;
  }

  @Emit('back') back(): void {
    return;
  }
}
</script>

<style lang="scss" scoped>
.answer {
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__inner {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  &__radios {
    margin-right: 120px;
  }

  &__radio {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  &__l-max {
    margin-bottom: 15px;
  }

  &__input {
    max-width: 100px;
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
  }
}

.line {
  &__point:not(:last-child) {
    margin-bottom: 20px;
  }

  &__input {
    margin-left: 20px;
    max-width: 130px;
    text-align: center;
  }
}
</style>
