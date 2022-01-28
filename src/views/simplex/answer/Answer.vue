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
        <span class="answer__equation">
          L<sub>min</sub> =
          <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="answer.Lmin" class="answer__cell" />
        </span>
      </span>
      <span class="answer__line">
        <span v-for="(x, index) in answer.x" :key="`x_${index}`" class="answer__equation">
          X<sub>{{ index + 1 }}</sub> =
          <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="x" class="answer__cell" />
        </span>
      </span>

      <span class="answer__line">
        <span v-for="(y, index) in answer.y" :key="`y_${index}`" class="answer__equation">
          Y<sub>{{ index + 1 }}</sub> =
          <simplex-table-cell :disabled="!isCurrentStep" :simplex-table-cell="y" class="answer__cell" />
        </span>
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
import { EmmmButton, EmmmIcon } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tAnswer } from '@/views/simplex/component';
import SimplexTableCell from '@/views/simplex/simplexTable/simplexTableCell/SimplexTableCell.vue';

@Options({
  name: 'Answer',
  components: { EmmmButton, EmmmIcon, SimplexTableCell },
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
    return this.answer.Lmin.value !== null && this.answer.x.every(x => x.value !== null) && this.answer.y.every(y => y.value !== null);
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
    flex-direction: column;
    gap: 10px;
  }

  &__line {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  &__equation {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  &__cell {
    width: 70px;
    height: 70px;
    margin-left: 5px;
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
