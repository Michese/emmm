<template>
  <section class="answer">
    <span class="answer__top">
      <span class="answer__title">Ответ</span>
      <a :href="answerHelp" target="_blank" download="Ответ" class="answer__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="answer__inner">
      <span class="answer__line">
        L<sub>min</sub> = <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="answer.Lmin" class="answer__cell" />
      </span>
      <span class="answer__line">
        X<sub>1</sub> = <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="answer.x1" class="answer__cell" />
      </span>
      <span class="answer__line">
        X<sub>3</sub> = <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="answer.x3" class="answer__cell" />
      </span>
      <span class="answer__line">
        X<sub>5</sub> = <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="answer.x5" class="answer__cell" />
      </span>
      <span class="answer__line">
        X<sub>7</sub> = <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="answer.x7" class="answer__cell" />
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
import { tAnswer } from '@/views/investmentOfFunds/component';
import SimplexTableCell from '@/views/simplex/simplexTable/simplexTableCell/SimplexTableCell.vue';
import answerHelp from './answerHelp';

@Options({
  name: 'Answer',
  components: { SimplexTableCell, EmmmButton, EmmmIcon, EmmmInput },
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
    return (
      this.answer.x1.value !== null &&
      this.answer.x3.value !== null &&
      this.answer.x5.value !== null &&
      this.answer.x7.value !== null &&
      this.answer.Lmin.value !== null
    );
  }

  get answerHelp(): string {
    return answerHelp;
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
    gap: 20px;
    margin-bottom: 20px;
  }

  &__line {
    display: flex;
    align-items: center;
    gap: 5px;

    &:first-child {
      margin-right: 40px;
    }
  }

  &__cell {
    width: 70px;
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
