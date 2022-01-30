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
        @upload="uploadFile($event)"
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
import {
  radioAnswerEnum,
  tGeometricMethod,
  initialPointsForLines,
  initialPointsForVector,
  initialPointVectorForGraphic,
  initialGeometricMethod,
  initialAnswer,
} from '@/views/geometricMethod/component';
import BuildingStraightLines from '@/views/geometricMethod/buildingStraightLines/BuildingStraightLines.vue';
import { InjectReactive, Watch } from 'vue-property-decorator';
import GeometricMethodGraphic from '@/views/geometricMethod/geometricMethodGraphic/GeometricMethodGraphic.vue';
import BuildingVector from '@/views/geometricMethod/buildingVector/BuildingVector.vue';
import Answer from '@/views/geometricMethod/answer/Answer.vue';
import { abs, checkHashObject, creatorHashJSON } from '@/helper';

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
    let errorMessage = '';
    const {
      condition: { Lmax, inequalities },
    } = this.geometricMethod!;

    if (abs(Lmax.x!) <= 0.001 && abs(Lmax.y!) <= 0.001) {
      Lmax.x = null;
      Lmax.y = null;
      errorMessage = 'Введены недопустимые значения!';
    }

    if (inequalities.some(inequality => abs(inequality.x!) <= 0.001 && abs(inequality.y!) <= 0.001)) {
      inequalities.forEach(inequality => {
        if (abs(inequality.x!) <= 0.001 && abs(inequality.y!) <= 0.001) {
          inequality.x = null;
          inequality.y = null;
        }
      });
      errorMessage = 'Введены недопустимые значения!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal('Введены недопустимые значения!');
    } else {
      this.geometricMethod!.pointsForLines = initialPointsForLines();
      this.toDown();
    }
  }

  buildingStraightLinesApply(): void {
    const {
      pointsForLines,
      condition: { inequalities },
    } = this.geometricMethod!;

    let errorMessage = '';
    inequalities.forEach((inequality, index) => {
      pointsForLines![index].lines.forEach((point, indexPoint) => {
        if (abs(inequality.x! * point.x! + inequality.y! * point.y! - inequality.result!) >= 0.0001) {
          point.x = null;
          point.y = null;
          errorMessage = 'Не все точки лежат на прямых!';
          this.geometricMethod!.countErrors++;
        } else if (
          pointsForLines![index].lines.slice(indexPoint + 1).some(point2 => abs(point.x! - point2.x!) <= 0.001 && abs(point.y! - point2.y!) <= 0.001)
        ) {
          point.x = null;
          point.y = null;
          errorMessage = 'Построение прямой по одной точке невозможно!';
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
      } = this.geometricMethod!,
      { lines } = pointsForVector!;

    const diffY = lines[1].y! - lines[0].y!,
      diffX = lines[1].x! - lines[0].x!;

    let result;

    if (abs(Lmax.x!) <= 0.001 && abs(Lmax.y!) <= 0.001) {
      result = abs(diffX) <= 0.001 && abs(diffY) <= 0.001;
    } else if (abs(Lmax.x!) <= 0.001) {
      result = abs(diffX) <= 0.001 && ((diffY >= 0 && Lmax.y! >= 0) || (diffY < 0 && Lmax.y! < 0));
    } else if (abs(Lmax.y!) <= 0.001) {
      result = abs(diffY) <= 0.001 && ((diffX > 0 && Lmax.x! > 0) || (diffX < 0 && Lmax.x! < 0));
    } else {
      const ratio = (Lmax.y! * diffX) / (Lmax.x! * diffY);
      result =
        abs(Math.round(ratio) - ratio) <= 0.0001 &&
        ((diffX > 0 && Lmax.x! > 0) || (diffX < 0 && Lmax.x! < 0)) &&
        ((diffY > 0 && Lmax.y! > 0) || (diffY < 0 && Lmax.y! < 0));
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
      abs(currentValue - maxValue) <= 0.001 ||
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
        const filteredPoints = pointsOfArea.filter(point => abs(point.x * x! + point.y * y! - maxValue) <= 0.001);
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
            abs(this.geometricMethod!.pointVectorForGraphic!.x - this.geometricMethod!.answer!.points[0].x!) >= 0.001 ||
            abs(this.geometricMethod!.pointVectorForGraphic!.y - this.geometricMethod!.answer!.points[0].y!) >= 0.001
          ) {
            this.geometricMethod!.answer!.points.forEach(point => {
              point!.x = null;
              point!.y = null;
            });
            errorMessage = 'Ответ неверный!';
          }

          if (abs(this.$refs.graphic.maxValue - this.geometricMethod!.answer!.Lmax!) >= 0.001) {
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
            const filteredPoints = pointsOfArea.filter(point => abs(point.x * x! + point.y * y! - maxValue) <= 0.001);
            if (
              filteredPoints.length !== 2 ||
              ((abs(filteredPoints[0].x - answer!.points[0].x!) >= 0.001 ||
                abs(filteredPoints[1].x - answer!.points[1].x!) >= 0.001 ||
                abs(filteredPoints[0].y - answer!.points[0].y!) >= 0.001 ||
                abs(filteredPoints[1].y - answer!.points[1].y!) >= 0.001) &&
                (abs(filteredPoints[0].x - answer!.points[1].x!) >= 0.001 ||
                  abs(filteredPoints[1].x - answer!.points[0].x!) >= 0.001 ||
                  abs(filteredPoints[0].y - answer!.points[1].y!) >= 0.001 ||
                  abs(filteredPoints[1].y - answer!.points[0].y!) >= 0.001))
            ) {
              this.geometricMethod!.answer!.points.forEach(point => {
                point!.x = null;
                point!.y = null;
              });
              errorMessage = 'Ответ неверный!';
            }

            if (abs(answer!.Lmax! - maxValue) > 0.001) {
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

  async uploadFile(geometricMethod: tGeometricMethod): Promise<void> {
    let errorMessage = '';
    if (
      !(
        'condition' in geometricMethod &&
        'pointsForLines' in geometricMethod &&
        'pointsForVector' in geometricMethod &&
        'pointVectorForGraphic' in geometricMethod &&
        'answer' in geometricMethod &&
        'countErrors' in geometricMethod &&
        'showResult' in geometricMethod &&
        'nonce' in geometricMethod
      )
    ) {
      errorMessage = 'Неверный формат данных в файле!';
    } else if (!(await checkHashObject(geometricMethod))) {
      errorMessage = 'Внимание! Попытка жульничества!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.geometricMethod = geometricMethod;
    }
  }

  async saveFile(): Promise<void> {
    const geometricMethodJSON = await creatorHashJSON(this.geometricMethod!);
    this.$refs.saveFileModal.showModal(geometricMethodJSON);
  }

  created(): void {
    const geometricMethodJSON = sessionStorage.getItem('geometricMethod');
    if (geometricMethodJSON) this.geometricMethod = JSON.parse(geometricMethodJSON) as tGeometricMethod;
    else this.fullReset();
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
