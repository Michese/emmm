<template>
  <section class="building-straight-lines">
    <span class="building-straight-lines__top">
      <span class="building-straight-lines__title">Построение прямых</span>
      <a href="#" target="_blank" download class="building-straight-lines__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>
    <div class="building-straight-lines__lines">
      <div v-for="(pointsForLine, index) in pointsForLines" :key="`pointsForLine_${index}`" class="building-straight-lines__line line">
        <span class="line__title">Прямая {{ index + 1 }}</span>
        <div class="line__point">
          X
          <emmm-input
            v-for="(point, indexPoint) in pointsForLine.lines"
            :key="`point_${index}_${indexPoint}`"
            :value="point.x"
            type="number"
            @input="$event => (point.x = +$event.target.value)"
            class="line__input"
            :placeholder="`X${indexPoint + 1}`"
            :disabled="!isCurrentStep"
          />
        </div>
        <div class="line__point">
          Y
          <emmm-input
            v-for="(point, indexPoint) in pointsForLine.lines"
            :key="`point_${index}_${indexPoint}`"
            :value="point.y"
            type="number"
            @input="$event => (point.y = +$event.target.value)"
            class="line__input"
            :placeholder="`Y${indexPoint + 1}`"
            :disabled="!isCurrentStep"
          />
        </div>
      </div>
    </div>

    <footer v-if="isCurrentStep" class="building-straight-lines__footer">
      <emmm-button @click="backBtnClick" class="building-straight-lines__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkPointsForLines" class="building-straight-lines__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { tPointsForLine } from '@/views/geometricMethod/types';
import { EmmmButton, EmmmIcon, EmmmInput } from '@/components';

@Options({
  name: 'BuildingStraightLines',
  components: {
    EmmmInput,
    EmmmButton,
    EmmmIcon,
  },
  emits: ['apply', 'back'],
})
export default class BuildingStraightLines extends Vue {
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
  pointsForLines!: tPointsForLine[];

  get checkPointsForLines(): boolean {
    return this.pointsForLines.every(pointsForLine => pointsForLine.lines.every(point => point.x !== null && point.y !== null));
  }

  applyBtnClick(): void {
    if (this.checkPointsForLines) this.apply();
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
.building-straight-lines {
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }

  &__title {
    margin-right: 20px;
  }

  &__lines {
    display: flex;
    justify-content: space-between;
    gap: 30px;
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
  }
}

.line {
  &__title {
    margin-left: 1.7em;
    margin-bottom: 30px;
  }

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
