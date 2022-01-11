<template>
  <div class="container">
    <section class="geometric-method">
      <span class="geometric-method__top">
        <h1 class="geometric-method__title">Геометрический метод</h1>
        <a href="#" target="_blank" download class="geometric-method__exclamation-mark exclamation-mark">
          <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
        </a>
      </span>
      <initial
        v-if="geometricMethod?.condition"
        :is-current-step="!geometricMethod?.pointsForLines"
        :condition="geometricMethod.condition"
        @apply="initialApply"
        @upload="geometricMethod = $event"
        class="geometric-method__initial"
      />
      <building-straight-lines
        v-if="geometricMethod?.pointsForLines"
        :is-current-step="!geometricMethod?.pointsForVector"
        :points-for-lines="geometricMethod.pointsForLines"
        @apply="buildingStraightLinesApply"
        @back="buildingStraightLinesBack"
        class="geometric-method__building-straight-lines"
      />
      <building-vector
        v-if="geometricMethod?.pointsForVector"
        :is-current-step="!geometricMethod?.pointVectorForGraphic"
        :points-for-vector="geometricMethod.pointsForVector"
        @apply="buildingVectorApply"
        @back="buildingVectorBack"
        class="geometric-method__building-vector"
      />
      <geometric-method-graphic
        ref="graphic"
        v-if="geometricMethod?.pointVectorForGraphic"
        :is-current-step="!geometricMethod?.answer"
        :condition="geometricMethod.condition"
        :point-vector-for-graphic="geometricMethod.pointVectorForGraphic"
        :errorCount="geometricMethod"
        @apply="geometricMethodGraphicApply"
        @back="geometricMethodGraphicBack"
        class="geometric-method__geometric-method-graphic"
      />
      <answer
        v-if="geometricMethod?.answer"
        :is-current-step="!geometricMethod.showResult"
        :answer="geometricMethod.answer"
        class="geometric-method__answer"
        @apply="answerApply"
        @back="answerBack"
      />
      <emmm-result-section
        v-if="geometricMethod.showResult"
        :errors="geometricMethod.countErrors"
        @back="resultBack"
        class="geometric-method__emmm-result-section"
      />
      <emmm-save-file-modal ref="saveFileModal" />
    </section>
  </div>
  <a href="#footer" ref="linkFooter" tabindex="-1" />
  <footer v-if="true" class="geometric-method__footer" id="footer">
    <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
    <emmm-button :background="`orange`" @click="fullReset">Очистить</emmm-button>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmResultSection, EmmmSaveFileModal, TLine, TPoint, TStaticZoneBuilder } from '@/components';
import Initial from './initial/Initial.vue';
import { tGeometricMethod } from '@/views/geometricMethod/types';
import BuildingStraightLines from '@/views/geometricMethod/buildingStraightLines/BuildingStraightLines.vue';
import { InjectReactive, Watch } from 'vue-property-decorator';
import initialPointsForLines from '@/views/geometricMethod/initialPointsForLines';
import GeometricMethodGraphic from '@/views/geometricMethod/geometricMethodGraphic/GeometricMethodGraphic.vue';
import BuildingVector from '@/views/geometricMethod/buildingVector/BuildingVector.vue';
import Answer from '@/views/geometricMethod/answer/Answer.vue';
import initialGeometricMethod from '@/views/geometricMethod/initialGeometricMethod';
import initialPointsForVector from '@/views/geometricMethod/initialPointsForVector';
import initialPointVectorForGraphic from '@/views/geometricMethod/initialPointVectorForGraphic';
import initialAnswer from '@/views/geometricMethod/initialAnswer';
import { radioAnswerEnum } from '@/views/geometricMethod/enums';

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
    EmmmSaveFileModal,
    EmmmResultSection,
  },
})
export default class GeometricMethod extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    graphic: { maxValue: number; pointsOfArea: TPoint[]; endX: number; allLines: TLine[] };
    linkFooter: { click: () => void };
  };

  geometricMethod: tGeometricMethod | null = null;

  @Watch('geometricMethod', { deep: true }) wGeometricMethod(): void {
    this.changeGeometricMethod();
  }

  changeGeometricMethod(): void {
    const geometricMethodJSON = JSON.stringify(this.geometricMethod);
    sessionStorage.setItem('geometricMethod', geometricMethodJSON);
  }

  initialApply(): void {
    const {
      condition: { Lmax },
    } = this.geometricMethod!;

    if (Lmax.x !== 0 || Lmax.y !== 0) {
      this.geometricMethod!.pointsForLines = initialPointsForLines();
      this.toDown();
    } else {
      Lmax.x = null;
      Lmax.y = null;
      if (this.openErrorModal) this.openErrorModal('Введены недопустимые значения!');
    }
  }

  buildingStraightLinesApply(): void {
    const {
      pointsForLines,
      condition: { inequalities },
    } = this.geometricMethod!;
    if (!pointsForLines) return;
    if (!inequalities) return;

    let errorMessage = '';
    inequalities.forEach((inequality, index) => {
      pointsForLines[index].lines.forEach((point, indexPoint) => {
        if (
          !(
            inequality.x !== null &&
            inequality.y !== null &&
            inequality.result !== null &&
            point.x !== null &&
            point.y !== null &&
            Math.abs(inequality.x * point.x + inequality.y * point.y - inequality.result) <= 0.0001
          )
        ) {
          point.x = null;
          point.y = null;
          errorMessage = 'Не все точки лежат на прямых!';
          this.geometricMethod!.countErrors++;
        } else if (pointsForLines[index].lines.slice(indexPoint + 1).some(point2 => point.x === point2.x && point.y === point2.y)) {
          point.x = null;
          point.y = null;
          errorMessage = 'Нельзя выбирать одни и те же точки!';
        }
      });
    });

    if (!errorMessage) {
      this.geometricMethod!.pointsForVector = initialPointsForVector();
      this.toDown();
    } else if (this.openErrorModal) this.openErrorModal(errorMessage);
  }

  buildingStraightLinesBack(): void {
    this.geometricMethod!.pointsForLines = null;
  }

  buildingVectorApply(): void {
    const {
      pointsForVector,
      condition: { Lmax },
    } = this.geometricMethod!;
    if (!pointsForVector || Lmax.x === null || Lmax.y === null) return;
    const { lines } = pointsForVector;

    const diffY = lines[1].y! - lines[0].y!,
      diffX = lines[1].x! - lines[0].x!;

    let result;

    if (Lmax.x === 0) {
      result = diffX === 0;
    } else if (Lmax.y === 0) {
      result = diffY === 0;
    } else {
      result = Number.isInteger((Lmax.y * diffX) / (Lmax.x * diffY));
    }

    if (result) {
      this.geometricMethod!.pointVectorForGraphic = initialPointVectorForGraphic();
      this.toDown();
    } else {
      lines.forEach(line => {
        line.y = null;
        line.x = null;
      });
      this.geometricMethod!.countErrors++;
      if (this.openErrorModal) this.openErrorModal('Точки выбраны неверно!');
    }
  }

  buildingVectorBack(): void {
    this.geometricMethod!.pointsForVector = null;
  }

  geometricMethodGraphicApply(): void {
    const {
        pointVectorForGraphic,
        condition: { Lmax },
      } = this.geometricMethod!,
      { maxValue, allLines, pointsOfArea } = this.$refs.graphic;

    const currentValue = pointVectorForGraphic!.x * Lmax.x! + pointVectorForGraphic!.y * Lmax.y!;
    if (
      Math.abs(currentValue - maxValue) <= 0.001 ||
      pointsOfArea.length === 0 ||
      TStaticZoneBuilder.pointsOfIntersection(allLines).some(
        point => allLines.every(line => line.checkPoint(point)) && maxValue < point.x * Lmax.x! + point.y * Lmax.y!,
      )
    ) {
      this.geometricMethod!.answer = initialAnswer();
      this.toDown();
    } else {
      this.geometricMethod!.countErrors++;
      if (this.openErrorModal) this.openErrorModal('Положение вектора выбрано неверно');
      this.geometricMethod!.pointVectorForGraphic = initialPointVectorForGraphic();
    }
  }

  geometricMethodGraphicBack(): void {
    this.geometricMethod!.pointVectorForGraphic = null;
  }

  answerApply(): void {
    let errorMessage = '';

    if (this.geometricMethod!.answer!.radio !== radioAnswerEnum.noSolution) {
      const {
          condition: { Lmax },
        } = this.geometricMethod!,
        { allLines, pointsOfArea, maxValue } = this.$refs.graphic;

      if (
        pointsOfArea.length === 0 ||
        TStaticZoneBuilder.pointsOfIntersection(allLines).some(
          point => allLines.every(line => line.checkPoint(point)) && maxValue < point.x * Lmax.x! + point.y * Lmax.y!,
        )
      ) {
        errorMessage = 'Ответ неверный!';
      } else if (this.geometricMethod!.answer!.radio === radioAnswerEnum.point) {
        const { pointsOfArea, maxValue } = this.$refs.graphic,
          {
            condition: {
              Lmax: { x, y },
            },
          } = this.geometricMethod!;
        const filteredPoints = pointsOfArea.filter(point => Math.abs(point.x * x! + point.y * y! - maxValue) <= 0.001);
        if (filteredPoints.length >= 2) {
          errorMessage = 'Ответ неверный!';
        }
      }
    }

    if (errorMessage) {
      this.geometricMethod!.answer!.points.forEach(point => {
        point!.x = null;
        point!.y = null;
      });
      this.geometricMethod!.answer!.Lmax = null;
    } else {
      switch (this.geometricMethod!.answer!.radio) {
        case radioAnswerEnum.point:
          if (
            Math.abs(this.geometricMethod!.pointVectorForGraphic!.x - this.geometricMethod!.answer!.points[0].x!) > 0.001 ||
            Math.abs(this.geometricMethod!.pointVectorForGraphic!.y - this.geometricMethod!.answer!.points[0].y!) > 0.001
          ) {
            this.geometricMethod!.answer!.points.forEach(point => {
              point!.x = null;
              point!.y = null;
            });
            errorMessage = 'Ответ неверный!';
          }

          if (Math.abs(this.$refs.graphic.maxValue - this.geometricMethod!.answer!.Lmax!) > 0.001) {
            this.geometricMethod!.answer!.Lmax = null;
            errorMessage = 'Ответ неверный!';
          }
          break;
        case radioAnswerEnum.line:
          {
            const { pointsOfArea, maxValue } = this.$refs.graphic,
              {
                answer,
                condition: {
                  Lmax: { x, y },
                },
              } = this.geometricMethod!;
            const filteredPoints = pointsOfArea.filter(point => Math.abs(point.x * x! + point.y * y! - maxValue) <= 0.001);
            if (
              filteredPoints.length !== 2 ||
              ((Math.abs(filteredPoints[0].x - answer!.points[0].x!) > 0.001 ||
                Math.abs(filteredPoints[1].x - answer!.points[1].x!) > 0.001 ||
                Math.abs(filteredPoints[0].y - answer!.points[0].y!) > 0.001 ||
                Math.abs(filteredPoints[1].y - answer!.points[1].y!) > 0.001) &&
                (Math.abs(filteredPoints[0].x - answer!.points[1].x!) > 0.001 ||
                  Math.abs(filteredPoints[1].x - answer!.points[0].x!) > 0.001 ||
                  Math.abs(filteredPoints[0].y - answer!.points[1].y!) > 0.001 ||
                  Math.abs(filteredPoints[1].y - answer!.points[0].y!) > 0.001))
            ) {
              this.geometricMethod!.answer!.points.forEach(point => {
                point!.x = null;
                point!.y = null;
              });
              errorMessage = 'Ответ неверный!';
            }

            if (Math.abs(answer!.Lmax! - maxValue) > 0.001) {
              this.geometricMethod!.answer!.Lmax = null;
              errorMessage = 'Ответ неверный!';
            }
          }
          break;
        case radioAnswerEnum.noSolution: {
          const {
              condition: { Lmax },
            } = this.geometricMethod!,
            { allLines, pointsOfArea, maxValue } = this.$refs.graphic;

          if (
            pointsOfArea.length > 0 &&
            TStaticZoneBuilder.pointsOfIntersection(allLines)
              .filter(point => allLines.every(line => line.checkPoint(point)))
              .every(point => maxValue >= point.x * Lmax.x! + point.y * Lmax.y!)
          ) {
            errorMessage = 'Ответ неверный!';
          }
        }
      }
    }

    if (errorMessage) {
      this.geometricMethod!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.geometricMethod!.showResult = true;
      this.toDown();
    }
  }

  answerBack(): void {
    this.geometricMethod!.answer = null;
  }

  resultBack(): void {
    this.geometricMethod!.showResult = false;
  }

  fullReset(): void {
    if (sessionStorage.getItem('geometricMethod')) sessionStorage.removeItem('geometricMethod');
    this.geometricMethod = initialGeometricMethod();
  }

  toDown(): void {
    this.$refs.linkFooter.click();
  }

  created(): void {
    const geometricMethodJSON = sessionStorage.getItem('geometricMethod');
    if (geometricMethodJSON) this.geometricMethod = JSON.parse(geometricMethodJSON) as tGeometricMethod;
    else this.fullReset();
  }

  saveFile(): void {
    const geometricMethodJSON = JSON.stringify(this.geometricMethod);
    this.$refs.saveFileModal.showModal(geometricMethodJSON);
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.geometric-method {
  padding: 32px 15px 15px;

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

  &__building-vector {
    margin-bottom: 25px;
  }

  &__geometric-method-graphic {
    margin-bottom: 25px;
  }

  &__answer {
    margin-bottom: 30px;
  }

  &__emmm-result-section {
    margin-bottom: 30px;
  }

  &__footer {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    gap: 30px;
    position: sticky;
    bottom: 0;
    padding: 10px 30px;
    background-color: var(--white-color);
  }
}

.exclamation-mark {
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
