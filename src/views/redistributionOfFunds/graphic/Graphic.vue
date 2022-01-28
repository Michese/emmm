<template>
  <section class="graphic">
    <span class="graphic__top">
      <span class="graphic__title">График</span>
      <a href="#" target="_blank" download class="graphic__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="graphic__inner">
      <emmm-graphic v-if="graphicBuilder" :graphicBuilder="graphicBuilder" :svg-height="800" :svg-width="800" class="graphic__emmm-graphic">
        <emmm-zone :points="zonePoints" />
        <emmm-line v-for="line in lines" :key="line" :line="line" :is-corrugated="true" />
        <emmm-normal-vector :vector="normalVector.vector" :point="normalVector.point" :canMove="isCurrentStep" @set-point="setVectorPoint" />
      </emmm-graphic>
    </div>

    <footer v-if="isCurrentStep" class="graphic__footer">
      <emmm-button @click="backBtnClick" class="graphic__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkGraphic" class="graphic__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  EmmmButton,
  EmmmGraphic,
  EmmmIcon,
  EmmmInput,
  EmmmLine,
  EmmmNormalVector,
  EmmmZone,
  GraphicBuilder,
  TLine,
  TPoint,
  TStaticZoneBuilder,
} from '@/components';
import { Prop } from 'vue-property-decorator';
import { tCase } from '@/views/redistributionOfFunds/component';

@Options({
  name: 'Graphic',
  components: { EmmmButton, EmmmIcon, EmmmInput, EmmmGraphic, EmmmZone, EmmmLine, EmmmNormalVector },
  emits: ['apply', 'back'],
})
export default class Graphic extends Vue {
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
  caseObject!: tCase;

  normalVector: {
    vector: TPoint;
    point: TPoint;
  } = {
    vector: new TPoint(-this.caseObject.system.t.x2!, -this.caseObject.system.t.x3!),
    point: new TPoint(this.caseObject.vector!.x2, this.caseObject.vector!.x3),
  };

  zonePoints: TPoint[] = TStaticZoneBuilder.pointsAxis(this.allLines, this.startX, this.endX, this.startY, this.endY);

  graphicBuilder = new GraphicBuilder().setRangeX(this.startX, this.endX).setRangeY(this.startY, this.endY);

  get checkGraphic(): boolean {
    return true;
  }

  get allLines(): TLine[] {
    return [
      ...this.lines,
      TLine.createLineByPoints(this.startX, this.startY, this.startX, this.endY, true),
      TLine.createLineByEquation(this.startY, 0, this.startX, this.endX, true),
      TLine.createLineByEquation(this.endY, 0, this.startX, this.endX, false),
      TLine.createLineByPoints(this.endX, this.startY, this.endX, this.endY, false),
    ];
  }

  get lines(): TLine[] {
    return [
      TLine.createLineByPoints(this.startX, 0, this.endX, 0, true),
      TLine.createLineByPoints(0, this.startY, 0, this.endY, true),
      TLine.createLineByEquation(
        this.caseObject.system.first.coefficient! / this.caseObject.system.first.x3!,
        -this.caseObject.system.first.x2! / this.caseObject.system.first.x3!,
        this.startX,
        this.endX,
        this.isMore,
      ),
      TLine.createLineByEquation(this.caseObject.system.second!, 1, this.startX, this.endX, false),
      TLine.createLineByPoints(this.caseObject.system.third!, this.startY, this.caseObject.system.third!, this.endY, false),
      TLine.createLineByEquation(this.caseObject.system.fourth!, 0, this.startX, this.endX, false),
    ];
  }

  get parallelLines(): TLine[] {
    if (!this.normalVector.vector) return [];

    if (!this.normalVector.vector.x) {
      return this.lines.filter(line => line.firstPoint.x === line.secondPoint.x);
    }

    const a1 = -this.normalVector.vector.x / this.normalVector.vector.y;
    return this.lines.filter(line => line.a1 === a1);
  }

  get pointsOfArea(): TPoint[] {
    return TStaticZoneBuilder.pointsOfAreaForRedistributionOfFunds([
      TLine.createLineByPoints(-Infinity, 0, Infinity, 0, true),
      TLine.createLineByPoints(0, -Infinity, 0, Infinity, true),
      TLine.createLineByEquation(
        this.caseObject.system.first.coefficient! / this.caseObject.system.first.x3!,
        -this.caseObject.system.first.x2! / this.caseObject.system.first.x3!,
        -Infinity,
        Infinity,
        this.isMore,
      ),
      TLine.createLineByEquation(this.caseObject.system.second!, 1, -Infinity, Infinity, false),
      TLine.createLineByPoints(this.caseObject.system.third!, -Infinity, this.caseObject.system.third!, Infinity, false),
      TLine.createLineByEquation(this.caseObject.system.fourth!, 0, -Infinity, Infinity, false),
    ]);
  }

  get minX(): number {
    return Math.min(...this.pointsOfArea.map(point => point.x), 0);
  }

  get minY(): number {
    return Math.min(...this.pointsOfArea.map(point => point.y), 0);
  }

  get startX(): number {
    return Math.min(this.minX, this.minY) - 5;
  }

  get startY(): number {
    return Math.min(this.minX, this.minY) - 5;
  }

  get maxX(): number {
    return Math.max(...this.pointsOfArea.map(point => point.x), 5);
  }

  get maxY(): number {
    return Math.max(...this.pointsOfArea.map(point => point.y), 5);
  }

  get endX(): number {
    return Math.max(this.maxX, this.maxY) + 5;
  }

  get endY(): number {
    return Math.max(this.maxX, this.maxY) + 5;
  }

  get pointsOfIntersection(): TPoint[] {
    return TStaticZoneBuilder.pointsOfIntersection(this.lines);
  }

  perpendicularPoints(point: TPoint): TPoint[] {
    return this.parallelLines.map(line => line.perpendicularPoint(point));
  }

  setVectorPoint(movePoint: TPoint): void {
    let minDistance = 1,
      nearestPoint: TPoint | null = null;
    const allPoints: TPoint[] = [...this.perpendicularPoints(movePoint), ...this.pointsOfIntersection];
    allPoints.forEach(point => {
      const moveDistance = movePoint.distance(point);
      if (moveDistance < minDistance) {
        minDistance = moveDistance;
        nearestPoint = point;
      }
    });
    nearestPoint = nearestPoint ?? movePoint;
    this.normalVector.point = nearestPoint;
    this.caseObject.vector!.x2 = nearestPoint.x;
    this.caseObject.vector!.x3 = nearestPoint.y;
  }

  get minValue(): number {
    return Math.min(
      ...this.pointsOfArea.map(
        point => point.x * this.caseObject.system.t.x2! + point.y * this.caseObject.system.t.x3! + this.caseObject.system.t.coefficient!,
      ),
    );
  }

  applyBtnClick(): void {
    if (this.checkGraphic) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.graphic {
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__inner {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
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
