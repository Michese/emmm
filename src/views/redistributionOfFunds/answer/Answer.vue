<template>
  <section class="answer">
    <span class="answer__top">
      <span class="answer__title">Ответ</span>
      <a href="#" target="_blank" download class="answer__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="answer__body">
      <span class="answer__line">
        T<sub>0</sub> =
        <emmm-input
          class="answer__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="answer.t0"
          @input="$event => (answer.t0 = +$event.target.value)"
        />
      </span>

      <span class="answer__line">
        x<sub>2</sub> =
        <emmm-input
          class="answer__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="answer.x2"
          @input="$event => (answer.x2 = +$event.target.value)"
        />
      </span>

      <span class="answer__line">
        x<sub>3</sub> =
        <emmm-input
          class="answer__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="answer.x3"
          @input="$event => (answer.x3 = +$event.target.value)"
        />
      </span>
    </div>

    <footer v-if="isCurrentStep" class="answer__footer">
      <emmm-button @click="backBtnClick" class="answer__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkAnswer" class="answer__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tAnswer } from '@/views/redistributionOfFunds/component';

@Options({
  name: 'Answer',
  components: { EmmmButton, EmmmIcon, EmmmInput },
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
    return this.answer.t0 !== null && this.answer.x2 !== null && this.answer.x3 !== null;
  }

  applyBtnClick(): void {
    if (this.checkAnswer) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
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

  &__body {
    display: flex;
    gap: 20px;
  }

  &__input {
    width: 110px;
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
