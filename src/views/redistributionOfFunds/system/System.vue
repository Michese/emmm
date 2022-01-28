<template>
  <section class="system">
    <span class="system__top">
      <span class="system__title">{{ top.title }}</span>
      <a :href="top.href" target="_blank" download class="system__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="system__body">
      <span class="system__line"> t<sub>1</sub> {{ topCondition }} t<sub>2</sub></span>
      <span class="system__line">
        T =
        <emmm-input
          class="system__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="system.t.x2"
          @input="$event => (system.t.x2 = +$event.target.value)"
        />
        x<sub>2</sub> +
        <emmm-input
          class="system__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="system.t.x3"
          @input="$event => (system.t.x3 = +$event.target.value)"
        />
        x<sub>3</sub> +
        <emmm-input
          class="system__input"
          type="number"
          :disabled="!isCurrentStep"
          :value="system.t.coefficient"
          @input="$event => (system.t.coefficient = +$event.target.value)"
        />
        &#10142; min
      </span>

      <div class="system__inner">
        <emmm-icon icon="curly-brace" class="system__curly-brace" />
        <div class="system__column">
          <span class="system__line">
            <emmm-input
              class="system__input"
              type="number"
              :disabled="!isCurrentStep"
              :value="system.first.x2"
              @input="$event => (system.first.x2 = +$event.target.value)"
            />
            x<sub>2</sub> +
            <emmm-input
              class="system__input"
              type="number"
              :disabled="!isCurrentStep"
              :value="system.first.x3"
              @input="$event => (system.first.x3 = +$event.target.value)"
            />
            x<sub>3</sub> {{ topCondition }}
            <emmm-input
              class="system__input"
              type="number"
              :disabled="!isCurrentStep"
              :value="system.first.coefficient"
              @input="$event => (system.first.coefficient = +$event.target.value)"
            />
          </span>

          <span class="system__line">
            x<sub>2</sub> + x<sub>3</sub> &#8804;
            <emmm-input
              class="system__input"
              type="number"
              :disabled="!isCurrentStep"
              :value="system.second"
              @input="$event => (system.second = +$event.target.value)"
            />
          </span>

          <span class="system__line">
            x<sub>2</sub> &#8804;
            <emmm-input
              class="system__input"
              type="number"
              :disabled="!isCurrentStep"
              :value="system.third"
              @input="$event => (system.third = +$event.target.value)"
            />
          </span>

          <span class="system__line">
            x<sub>3</sub> &#8804;
            <emmm-input
              class="system__input"
              type="number"
              :disabled="!isCurrentStep"
              :value="system.fourth"
              @input="$event => (system.fourth = +$event.target.value)"
            />
          </span>

          <span class="system__line"> x<sub>2</sub> &#8805; 0, x<sub>3</sub> &#8805; 0 </span>
        </div>
      </div>
    </div>

    <footer v-if="isCurrentStep" class="system__footer">
      <emmm-button @click="backBtnClick" class="system__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkSystem" class="system__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tSystem } from '@/views/redistributionOfFunds/component';

@Options({
  name: 'System',
  components: { EmmmButton, EmmmIcon, EmmmInput },
  emits: ['apply', 'back'],
})
export default class System extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isMore!: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  system!: tSystem;

  get checkSystem(): boolean {
    return (
      this.system.t.x2 !== null &&
      this.system.t.x3 !== null &&
      this.system.t.coefficient !== null &&
      this.system.first.x2 !== null &&
      this.system.first.x3 !== null &&
      this.system.first.coefficient !== null &&
      this.system.second !== null &&
      this.system.third !== null &&
      this.system.fourth !== null
    );
  }

  get top(): { title: string; href: string } {
    return this.isMore ? { title: 'Случай 1', href: '#' } : { title: 'Случай 2', href: '#' };
  }

  get topCondition(): string {
    return this.isMore ? '≥' : '≤';
  }

  applyBtnClick(): void {
    if (this.checkSystem) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.system {
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

  &__inner {
    display: flex;
    gap: 20px;
  }

  &__curly-brace {
    fill: transparent;
    height: 373px;
  }

  &__column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
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
