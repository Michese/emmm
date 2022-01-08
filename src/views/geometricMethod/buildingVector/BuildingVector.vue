<template>
  <section class="building-vector">
    <span class="building-vector__top">
      <span class="building-vector__title">Построение вектора</span>
      <a href="#" target="_blank" download class="building-vector__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="building-vector__line line">
      <div class="line__point">
        X
        <emmm-input
          v-for="(point, index) in pointsForVector.lines"
          :key="`vectorX_${index}`"
          :value="point.x"
          type="number"
          @input="$event => (point.x = +$event.target.value)"
          class="line__input"
          :placeholder="`X${index + 1}`"
          :disabled="!isCurrentStep"
        />
      </div>
      <div class="line__point">
        Y
        <emmm-input
          v-for="(point, indexPoint) in pointsForVector.lines"
          :key="`vectorY_${indexPoint}`"
          :value="point.y"
          type="number"
          @input="$event => (point.y = +$event.target.value)"
          class="line__input"
          :placeholder="`Y${indexPoint + 1}`"
          :disabled="!isCurrentStep"
        />
      </div>
    </div>

    <footer v-if="isCurrentStep" class="building-vector__footer">
      <emmm-button @click="backBtnClick" class="building-vector__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkPointsForVector" class="building-vector__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput } from '@/components';
import { Emit, Prop } from 'vue-property-decorator';
import { tPointsForVector } from '@/views/geometricMethod/types';

@Options({
  name: 'BuildingVector',
  components: { EmmmIcon, EmmmInput, EmmmButton },
})
export default class BuildingVector extends Vue {
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
  pointsForVector!: tPointsForVector;

  get checkPointsForVector(): boolean {
    return this.pointsForVector.lines.every(point => point.x !== null && point.y !== null);
  }

  applyBtnClick(): void {
    if (this.checkPointsForVector) this.apply();
  }

  backBtnClick(): void {
    this.back();
  }

  @Emit('apply') apply(): void {
    return;
  }

  @Emit('back') back(): void {
    return;
  }
}
</script>

<style lang="scss" scoped>
.building-vector {
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
