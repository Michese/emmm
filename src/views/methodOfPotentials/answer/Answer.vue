<template>
  <section class="answer">
    <span class="answer__top">
      <span class="answer__title">Ответ</span>
      <a href="#" target="_blank" download class="answer__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="answer__inner">
      <span class="answer__line">
        L<sub>min</sub> =
        <emmm-input
          class="answer__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="answer.Lmin"
          @input="$event => (answer.Lmin = +$event.target.value)"
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
import { tAnswer } from '@/views/methodOfPotentials/component';

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
    required: false,
    default: () => false,
  })
  answer!: tAnswer;

  get checkAnswer(): boolean {
    return this.answer.Lmin !== null;
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

  &__inner {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__line {
    display: flex;
    align-items: center;
  }

  &__input {
    margin-left: 10px;
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
