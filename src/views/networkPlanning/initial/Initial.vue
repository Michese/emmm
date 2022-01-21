<template>
  <section class="initial">
    <div class="initial__top">
      <template v-if="isCurrentStep">
        <EmmmButton :background="manuallyButtonBgc" @click="manuallyButtonClick" :disabled="isManually">Создать</EmmmButton>
        <EmmmButton :background="loadButtonBgc" @click="loadButtonClick" :disabled="!isManually">Загрузить</EmmmButton>
      </template>
    </div>

    <emmm-upload class="initial__emmm-upload" v-if="!isManually && isCurrentStep" @upload="$emit('upload', $event)" />

    <span class="initial__title">Параметры задачи</span>
    <div class="initial__parameters">
      <div class="initial__titles">
        <span class="initial__parameter">Количество рангов</span>
        <span class="initial__parameter">Количество видов работ</span>
      </div>
      <div class="initial__inputs">
        <emmm-input
          class="initial__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="parameters.rows"
          @change="onInput('rows', $event.target.value)"
          :max="maxNum"
          :min="minNum"
        />
        <emmm-input
          class="initial__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="parameters.columns"
          @change="onInput('columns', $event.target.value)"
          :max="maxNum"
          :min="minNum"
        />
      </div>
    </div>

    <div v-if="isCurrentStep" class="initial__apply-btn">
      <emmm-button @click="applyBtnClick" :disabled="!checkParameters">Далее</emmm-button>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { colorEnum, EmmmButton, EmmmIcon, EmmmInput, EmmmUpload } from '@/components';
import { tParameters } from '@/views/networkPlanning/component';

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
  parameters!: tParameters;

  isManually = true;

  get manuallyButtonBgc(): string {
    return this.isManually ? colorEnum.blue : colorEnum.lightGreen;
  }

  get loadButtonBgc(): string {
    return this.isManually ? colorEnum.lightGreen : colorEnum.blue;
  }

  get checkParameters(): boolean {
    return this.parameters.columns !== null;
  }

  get maxNum(): number {
    return 15;
  }

  get minNum(): number {
    return 3;
  }

  manuallyButtonClick(): void {
    this.isManually = true;
  }

  loadButtonClick(): void {
    this.isManually = false;
  }

  applyBtnClick(): void {
    if (this.checkParameters) this.$emit('apply');
  }

  parseInt(num: string): number {
    const parsedNumber = Number.parseInt(num);
    return parsedNumber > this.maxNum ? this.maxNum : parsedNumber < this.minNum ? this.minNum : parsedNumber;
  }

  onInput(key: 'rows' | 'columns', value: string): void {
    this.parameters[key] = null;

    this.$nextTick(() => {
      this.parameters[key] = this.parseInt(value);
    });
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

  &__emmm-upload {
    margin-bottom: 20px;
  }

  &__title {
    margin-bottom: 20px;
  }

  &__parameters {
    display: flex;
  }

  &__parameter {
    display: block;
    text-align: right;
  }

  &__titles {
    margin-right: 25px;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
  }

  &__input {
    max-width: 100px;
  }

  &__input,
  &__parameter {
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom: 15px;
  }

  &__apply-btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
