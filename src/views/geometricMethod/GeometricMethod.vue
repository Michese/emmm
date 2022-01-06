<template>
  <div class="container">
    <section class="geometric-method">
      <span class="geometric-method__top">
        <h1 class="geometric-method__title">Геометрический метод</h1>
        <a href="#" target="_blank" download class="geometric-method__exclamation-mark exclamation-mark">
          <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
        </a>
      </span>
      <initial v-if="condition" :is-current-step="true" :condition="condition" @apply="initialApply" class="geometric-method__initial" />
      <building-straight-lines
        v-if="pointsForLines"
        :is-current-step="true"
        :points-for-lines="pointsForLines"
        @apply="buildingStraightLinesApply"
        @back="buildingStraightLinesBack"
        class="geometric-method__building-straight-lines"
      />
      <building-vector v-if="pointsForVector" :is-current-step="true" :points-for-vector="pointsForVector" />
      <geometric-method-graphic v-if="pointVectorForGraphic" :is-current-step="true" class="geometric-method__geometric-method-graphic" />
      <answer v-if="answer" :is-current-step="true" :answer="answer" class="geometric-method__answer" />
      <footer v-if="true" class="geometric-method__footer">
        <emmm-button @click="saveFile">Сохранить</emmm-button>
        <emmm-button :background="`orange`" @click="fullReset">Отчистить</emmm-button>
      </footer>
    </section>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon } from '@/components';
import Initial from './initial/Initial.vue';
import { tAnswer, tCondition, tGeometricMethod, tPointsForLine, tPointsForVector, tPointVectorForGraphic } from '@/views/geometricMethod/types';
import BuildingStraightLines from '@/views/geometricMethod/buildingStraightLines/BuildingStraightLines.vue';
import { Watch } from 'vue-property-decorator';
import initialPointsForLines from '@/views/geometricMethod/initialPointsForLines';
import initialCondition from '@/views/geometricMethod/initialCondition';
import initialPointsForVector from '@/views/geometricMethod/initialPointsForVector';
import GeometricMethodGraphic from '@/views/geometricMethod/geometricMethodGraphic/GeometricMethodGraphic.vue';
import BuildingVector from '@/views/geometricMethod/buildingVector/BuildingVector.vue';
import Answer from '@/views/geometricMethod/answer/Answer.vue';
import initialPointVectorForGraphic from '@/views/geometricMethod/initialPointVectorForGraphic';
import initialAnswer from '@/views/geometricMethod/initialAnswer';
import toBase64 from '@/helper/toBase64';

@Options({
  name: 'GeometricMethod',
  components: {
    BuildingVector,
    EmmmIcon,
    Initial,
    BuildingStraightLines,
    GeometricMethodGraphic,
    Answer,
    EmmmButton,
  },
})
export default class GeometricMethod extends Vue {
  condition: tCondition | null = null;
  pointsForLines: tPointsForLine[] | null = null;
  pointsForVector: tPointsForVector | null = null;
  pointVectorForGraphic: tPointVectorForGraphic | null = null;
  answer: tAnswer | null = null;

  @Watch('condition', { deep: true }) wCondition(): void {
    this.changeGeometricMethod();
  }

  @Watch('pointsForLines', { deep: true }) wPointsForLines(): void {
    this.changeGeometricMethod();
  }

  @Watch('pointsForVector', { deep: true }) wPointsForVector(): void {
    this.changeGeometricMethod();
  }

  @Watch('pointVectorForGraphic', { deep: true }) wPointVectorForGraphic(): void {
    this.changeGeometricMethod();
  }

  @Watch('answer', { deep: true }) wAnswer(): void {
    this.changeGeometricMethod();
  }

  get geometricMethod(): tGeometricMethod {
    return {
      condition: this.condition!,
      pointsForLines: this.pointsForLines,
      pointsForVector: this.pointsForVector,
      pointVectorForGraphic: this.pointVectorForGraphic,
      answer: this.answer,
    };
  }

  changeGeometricMethod(): void {
    const geometricMethodJSON = JSON.stringify(this.geometricMethod);
    sessionStorage.setItem('geometricMethod', geometricMethodJSON);
  }

  initialApply(): void {
    this.pointsForLines = initialPointsForLines();
    this.pointsForVector = initialPointsForVector();
    this.pointVectorForGraphic = initialPointVectorForGraphic();
    this.answer = initialAnswer();
    console.log('initialApply');
  }

  buildingStraightLinesApply(): void {
    console.log('buildingStraightLinesApply');
  }

  buildingStraightLinesBack(): void {
    console.log('buildingStraightLinesApply');
  }

  fullReset(): void {
    this.condition = initialCondition();
    if (this.pointsForLines) this.pointsForLines = null;
    if (this.pointsForVector) this.pointsForVector = null;
    if (this.pointVectorForGraphic) this.pointVectorForGraphic = null;
    if (this.answer) this.answer = null;
    if (sessionStorage.getItem('geometricMethod')) sessionStorage.removeItem('geometricMethod');
  }

  created(): void {
    const geometricMethodJSON = sessionStorage.getItem('geometricMethod');
    if (geometricMethodJSON) {
      const { condition, pointsForLines, pointsForVector, pointVectorForGraphic, answer } = JSON.parse(geometricMethodJSON) as tGeometricMethod;
      this.condition = condition;
      this.pointsForLines = pointsForLines;
      this.pointsForVector = pointsForVector;
      this.pointVectorForGraphic = pointVectorForGraphic;
      this.answer = answer;
    } else {
      this.fullReset();
    }
  }

  async saveFile(): Promise<void> {
    const geometricMethodJSON = JSON.stringify(this.geometricMethod),
      file = new File([geometricMethodJSON], 'objectUrl.json', { type: 'application/json' });
    const objectUrl = await toBase64(file);
    if (objectUrl) {
      const link = document.createElement('a');
      link.setAttribute('href', objectUrl as string);
      link.setAttribute('target', '_blank');
      link.setAttribute('download', 'objectUrl.json');
      link.click();
    }
  }
}
</script>

<style lang="scss" scoped>
.geometric-method {
  padding-top: 32px;

  &__top {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
  }

  &__title {
    margin-right: 20px;
    font-size: 48px;
    text-align: center;
  }

  &__initial {
    margin-bottom: 25px;
  }

  &__building-straight-lines {
    margin-bottom: 25px;
  }

  &__geometric-method-graphic {
    margin-bottom: 25px;
  }

  &__answer {
    margin-bottom: 30px;
  }

  &__footer {
    display: flex;
    justify-content: space-evenly;
    gap: 30px;
    position: sticky;
    bottom: 0;
    padding: 30px;
    background-color: var(--white-color);
  }
}

.exclamation-mark {
  display: flex;
  align-items: center;

  &__icon {
    fill: var(--yellow-color);
  }
}
</style>
