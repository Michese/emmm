<template>
  <section class="vector">
    <span class="vector__top">
      <span class="vector__title">Вектор</span>
      <a href="#" target="_blank" download class="vector__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="building-vector__line line">
      <div class="line__point">
        X<sub>2</sub>
        <emmm-input
          v-for="(point, index) in vectorPoints"
          :key="`vectorX_${index}`"
          :value="point.x2"
          type="number"
          @input="$event => (point.x2 = +$event.target.value)"
          class="line__input"
          :placeholder="`${index + 1}`"
          :disabled="!isCurrentStep"
        />
      </div>
      <div class="line__point">
        X<sub>3</sub>
        <emmm-input
          v-for="(point, indexPoint) in vectorPoints"
          :key="`vectorY_${indexPoint}`"
          :value="point.x3"
          type="number"
          @input="$event => (point.x3 = +$event.target.value)"
          class="line__input"
          :placeholder="`${indexPoint + 1}`"
          :disabled="!isCurrentStep"
        />
      </div>
    </div>

    <footer v-if="isCurrentStep" class="vector__footer">
      <emmm-button @click="backBtnClick" class="vector__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkVector" class="vector__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tVectorPoint } from '@/views/redistributionOfFunds/component';

@Options({
  name: 'Vector',
  components: { EmmmButton, EmmmIcon, EmmmInput },
  emits: ['apply', 'back'],
})
export default class Vector extends Vue {
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
  vectorPoints!: tVectorPoint[];

  get checkVector(): boolean {
    return this.vectorPoints.every(point => point.x2 !== null && point.x3 !== null);
  }

  applyBtnClick(): void {
    if (this.checkVector) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.vector {
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__line {
    margin-bottom: 20px;
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
