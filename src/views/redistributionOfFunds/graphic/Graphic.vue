<template>
  <section class="graphic">
    <span class="graphic__top">
      <span class="graphic__title">График</span>
      <a href="#" target="_blank" download class="graphic__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="graphic__inner">
      <emmm-popover :text="textPopover" ref="popover" />

      <emmm-graphic v-if="graphicBuilder" :graphicBuilder="graphicBuilder" :svg-height="800" :svg-width="800" class="graphic__emmm-graphic">
        <emmm-zone :points="zonePoints" />
        <emmm-line
          v-for="line in lines"
          :key="line"
          :line="line"
          :is-corrugated="true"
          @mouseenter.prevent="mouseEnterEvent(line.marker, $event)"
          @mousemove.prevent="mouseEnterEvent(line.marker, $event)"
          @mouseleave="popover.hiddePopover()"
          @wheel="popover.hiddePopover()"
        />
        <emmm-point
          v-for="(point, index) in pointsOfArea"
          :key="`point__${index}`"
          :point="point"
          fill="var(--blue-color)"
          @mouseenter.prevent="mouseEnterEvent(`${+point.x.toFixed(2)}; ${+point.y.toFixed(2)}`, $event)"
          @mousemove.prevent="mouseEnterEvent(`${+point.x.toFixed(2)}; ${+point.y.toFixed(2)}`, $event)"
          @mouseleave="popover.hiddePopover()"
          @wheel="popover.hiddePopover()"
        />
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
  EmmmPoint,
  EmmmZone,
  EmmmPopover,
  GraphicBuilder,
  TLine,
  TPoint,
  TStaticZoneBuilder,
} from '@/components';
import { Prop, Ref } from 'vue-property-decorator';
import { tCase } from '@/views/redistributionOfFunds/component';

@Options({
  name: 'Graphic',
  components: { EmmmButton, EmmmIcon, EmmmInput, EmmmGraphic, EmmmZone, EmmmLine, EmmmNormalVector, EmmmPoint, EmmmPopover },
  emits: ['apply', 'back'],
})
export default class Graphic extends Vue {
  @Ref('popover') popover!: Vue & { mouseEnterEvent: (event: MouseEvent) => void; hiddePopover: () => void };

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

  textPopover = '';
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
      TLine.createLineByPoints(this.startX, 0, this.endX, 0, true, `y = 0`),
      TLine.createLineByPoints(0, this.startY, 0, this.endY, true, `x = 0`),
      TLine.createLineByEquation(
        this.caseObject.system.first.coefficient! / this.caseObject.system.first.x3!,
        -this.caseObject.system.first.x2! / this.caseObject.system.first.x3!,
        this.startX,
        this.endX,
        this.isMore,
        `${+this.caseObject.system.first.x2!.toFixed(2)}x<sub>2</sub> + ${+this.caseObject.system.first.x3!.toFixed(
          2,
        )}x<sub>3</sub> = ${+this.caseObject.system.first.coefficient!.toFixed(2)}`,
      ),
      TLine.createLineByEquation(
        this.caseObject.system.second!,
        1,
        this.startX,
        this.endX,
        false,
        `x<sub>2</sub> + x<sub>3</sub> = ${+this.caseObject.system.second!.toFixed(2)}`,
      ),
      TLine.createLineByPoints(
        this.caseObject.system.third!,
        this.startY,
        this.caseObject.system.third!,
        this.endY,
        false,
        `x<sub>2</sub> = ${+this.caseObject.system.third!.toFixed(2)}`,
      ),
      TLine.createLineByEquation(
        this.caseObject.system.fourth!,
        0,
        this.startX,
        this.endX,
        false,
        `x<sub>3</sub> = ${+this.caseObject.system.fourth!.toFixed(2)}`,
      ),
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

  mouseEnterEvent(text: string, event: MouseEvent): void {
    if (text) {
      this.textPopover = text;
      this.popover.mouseEnterEvent(event);
    }
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
</style>
