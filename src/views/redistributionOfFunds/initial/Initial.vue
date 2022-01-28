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
      <a href="#" target="_blank" download class="initial__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="initial__conditions">
      <div class="initial__column">
        <span v-for="(condition, index) in conditions" :key="`condition_${index}`" class="initial_condition">
          t<sub>{{ index + 1 }}</sub> =
          <emmm-input
            class="initial__input"
            type="number"
            :disabled="!isCurrentStep"
            :value="condition.t"
            @input="$event => (condition.t = +$event.target.value)"
          />
          (1 {{ index === 0 ? '+' : '-' }}
          <emmm-input
            class="initial__input"
            type="number"
            :disabled="!isCurrentStep"
            :value="condition.a"
            @input="$event => (condition.a = +$event.target.value)"
          />
          x<sub>{{ index + 1 }}</sub>
          ),
        </span>
      </div>
      <div class="initial__column">
        <span v-for="(condition, index) in conditions" :key="`condition_${index}`" class="initial_condition">
          0 &#8804; x<sub>{{ index + 1 }}</sub> &#8804;
          <emmm-input
            class="initial__input"
            type="number"
            :disabled="!isCurrentStep"
            :value="condition.x"
            @input="$event => (condition.x = +$event.target.value)"
          />
        </span>
      </div>
    </div>

    <footer v-if="isCurrentStep" class="initial__apply-btn">
      <emmm-button @click="applyBtnClick" :disabled="!checkConditions">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { colorEnum, EmmmButton, EmmmIcon, EmmmUpload, EmmmInput } from '@/components';
import { tCondition } from '@/views/redistributionOfFunds/component';

@Options({
  name: 'Initial',
  components: { EmmmInput, EmmmIcon, EmmmUpload, EmmmButton },
  emits: ['apply', 'upload'],
})
export default class Initial extends Vue {
  isManually = true;

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
  conditions!: tCondition[];

  get manuallyButtonBgc(): string {
    return this.isManually ? colorEnum.blue : colorEnum.lightGreen;
  }

  get loadButtonBgc(): string {
    return this.isManually ? colorEnum.lightGreen : colorEnum.blue;
  }

  get checkConditions(): boolean {
    return this.conditions.every(condition => condition.t !== null && condition.a !== null && condition.x !== null);
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

  &__input {
    max-width: 100px;
  }

  &__conditions {
    display: flex;
    gap: 100px;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__apply-btn {
    display: flex;
    justify-content: flex-end;
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
