<template>
  <section class="answer">
    <span class="answer__top">
      <span class="answer__title">Ответ</span>
      <a href="#" target="_blank" download class="answer__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <span class="answer__subtitle">Критический путь в исходных обозначениях</span>

    <div class="answer__body">
      <div class="answer__inner">
        <connection
          v-for="child in answer.path"
          :key="child.uuid"
          :is-current-step="false"
          :parameters="parameters"
          :can-delete="false"
          :path="child"
          body="A"
        />
      </div>
    </div>

    <span class="answer__subtitle">Критическое время</span>

    <span class="answer__critical-time">
      T<sub>crit</sub> =
      <emmm-input
        class="answer__input"
        type="number"
        :disabled="!isCurrentStep"
        :value="answer.criticalTime.value"
        @input="$event => (answer.criticalTime.value = +$event.target.value)"
      />
    </span>

    <footer v-if="isCurrentStep" class="answer__footer">
      <emmm-button @click="backBtnClick" class="answer__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkAnswer" class="answer__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, ProvideReactive } from 'vue-property-decorator';
import { tAnswer, tParameters } from '@/views/networkPlanning/component';
import { EmmmButton, EmmmIcon, EmmmInput } from '@/components';
import Connection from '@/views/networkPlanning/creatorPath/connection/Connection.vue';

@Options({
  name: 'Answer',
  components: { EmmmButton, EmmmIcon, Connection, EmmmInput },
  emits: ['apply', 'back'],
})
export default class Answer extends Vue {
  @ProvideReactive('isLoading')
  isLoading = true;

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

  @Prop({
    type: Object,
    required: true,
  })
  parameters!: tParameters;

  @ProvideReactive('load') load(): void {
    this.isLoading = true;
  }

  @ProvideReactive('cancelLoad') cancelLoad(): void {
    this.$nextTick(() => {
      this.isLoading = false;
    });
  }

  get checkAnswer(): boolean {
    return this.answer.criticalTime.value !== null;
  }

  applyBtnClick(): void {
    if (this.checkAnswer) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }

  mounted(): void {
    this.isLoading = false;
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

  &__subtitle {
    display: block;
    font-weight: 500;
    margin-bottom: 15px;
  }

  &__body {
    --width-cell: 60px;
    --height-cell: 60px;

    display: flex;
    justify-content: flex-start;
    padding: 15px;
    max-width: 1200px;
    margin: 0 auto 25px;
    overflow-x: auto;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
    position: relative;
  }

  &__plus {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--width-cell);
    width: var(--width-cell);
    background-color: var(--light-green-color);
    font-weight: 500;
    box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
    border: none;
    outline: none;
    border-radius: 50%;
    cursor: pointer;

    &:hover,
    &:focus {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    }

    &:active {
      box-shadow: inset 2px 4px 4px rgba(0, 0, 0, 0.25);
    }
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
</style>
