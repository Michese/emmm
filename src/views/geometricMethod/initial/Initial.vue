<template>
  <section class="initial">
    <div class="initial__top">
      <template v-if="isCurrentStep">
        <EmmmButton :background="manuallyButtonBgc" @click="manuallyButtonClick" :disabled="isManually">Создать</EmmmButton>
        <EmmmButton :background="loadButtonBgc" @click="loadButtonClick" :disabled="!isManually">Загрузить</EmmmButton>
      </template>
    </div>

    <span class="initial__task-top">
      <span class="initial__title">Условие</span>
      <a href="#" target="_blank" download class="initial__question question" tabindex="-1">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <emmm-upload class="initial__emmm-upload" v-if="!isManually && isCurrentStep" @upload="$emit('upload', $event)" />

    <ul class="initial__inequalities">
      <li class="initial__inequality">
        L =
        <emmm-input
          :value="condition.Lmax.x"
          type="number"
          @input="$event => (condition.Lmax.x = +$event.target.value)"
          class="initial__input"
          :disabled="!isCurrentStep"
        />
        x +
        <emmm-input
          :value="condition.Lmax.y"
          type="number"
          @input="$event => (condition.Lmax.y = +$event.target.value)"
          class="initial__input"
          :disabled="!isCurrentStep"
        />
        y &#10142; max
      </li>
      <li v-for="(inequality, index) in condition.inequalities" :key="`inequality_${index}`" class="initial__inequality">
        <emmm-input
          :value="inequality.x"
          type="number"
          @input="$event => (inequality.x = +$event.target.value)"
          class="initial__input"
          :disabled="!isCurrentStep"
        />
        x +
        <emmm-input
          :value="inequality.y"
          type="number"
          @input="$event => (inequality.y = +$event.target.value)"
          class="initial__input"
          :disabled="!isCurrentStep"
        />
        y &#8804;
        <emmm-input
          :value="inequality.result"
          type="number"
          @input="$event => (inequality.result = +$event.target.value)"
          class="initial__input"
          :disabled="!isCurrentStep"
        />
      </li>
      <li class="initial__inequality">
        <span class="initial__inequality_x">x &#8805; 0</span>
        <span class="initial__inequality_y">y &#8805; 0</span>
      </li>
    </ul>
    <div v-if="isCurrentStep" class="initial__apply-btn">
      <emmm-button @click="applyBtnClick" :disabled="!checkCondition">Далее</emmm-button>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { colorEnum, EmmmButton, EmmmIcon, EmmmInput, EmmmUpload } from '@/components';
import { Emit, Prop } from 'vue-property-decorator';
import { tCondition } from '@/views/geometricMethod/component/types';

@Options({
  name: 'Initial',
  components: {
    EmmmButton,
    EmmmUpload,
    EmmmInput,
    EmmmIcon,
  },
  emits: ['apply', 'upload'],
})
export default class Initial extends Vue {
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
  condition!: tCondition;

  isManually = true;

  get manuallyButtonBgc(): string {
    return this.isManually ? colorEnum.blue : colorEnum.lightGreen;
  }

  get loadButtonBgc(): string {
    return this.isManually ? colorEnum.lightGreen : colorEnum.blue;
  }

  get checkCondition(): boolean {
    return (
      this.condition.Lmax.x !== null &&
      this.condition.Lmax.y !== null &&
      this.condition.inequalities.every(inequality => inequality.x !== null && inequality.y !== null && inequality.result !== null)
    );
  }

  manuallyButtonClick(): void {
    this.isManually = true;
  }

  loadButtonClick(): void {
    this.isManually = false;
  }

  applyBtnClick(): void {
    if (this.checkCondition) this.apply();
  }

  @Emit('apply') apply(): void {
    return;
  }
}
</script>

<style lang="scss" scoped>
.initial {
  &__top {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 30px;
  }

  &__task-top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__emmm-upload {
    margin-bottom: 20px;
  }

  &__input {
    max-width: 100px;
  }

  &__inequalities {
    margin-bottom: 20px;
  }

  &__inequality {
    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &:not(:first-child) {
      margin-left: 1.7em;
    }

    &_x {
      margin-right: 100px;
    }
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
