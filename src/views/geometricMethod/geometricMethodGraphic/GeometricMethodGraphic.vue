<template>
  <section class="geometric-method-graphic">
    <span class="geometric-method-graphic__top">
      <span class="geometric-method-graphic__title">График</span>
      <a href="#" target="_blank" download class="geometric-method-graphic__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>
    <div class="geometric-method-graphic__inner">
      <emmm-graphic
        v-if="graphicBuilder"
        :graphicBuilder="graphicBuilder"
        :svg-height="600"
        :svg-width="600"
        class="geometric-method-graphic__emmm-graphic"
      >
        <emmm-zone :points="zonePoints" />
        <emmm-line v-for="line in lines" :key="line" :line="line" :is-corrugated="true" />
        <emmm-normal-vector :vector="normalVector.vector" :point="normalVector.point" :canMove="isCurrentStep" @set-point="setVectorPoint" />
      </emmm-graphic>
    </div>

    <footer v-if="isCurrentStep" class="geometric-method-graphic__footer">
      <emmm-button @click="$emit('back')" class="geometric-method-graphic__back-btn">Назад</emmm-button>
      <emmm-button @click="$emit('apply')" class="geometric-method-graphic__apply-btn">Далее</emmm-button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  EmmmButton,
  EmmmGraphic,
  EmmmIcon,
  EmmmLine,
  EmmmNormalVector,
  EmmmPoint,
  EmmmZone,
  GraphicBuilder,
  TLine,
  TPoint,
  TStaticZoneBuilder,
} from '@/components';
import { InjectReactive, Prop } from 'vue-property-decorator';
import { tCondition, tPointVectorForGraphic } from '@/views/geometricMethod/component/types';

@Options({
  name: 'GeometricMethodGraphic',
  components: {
    EmmmGraphic,
    EmmmPoint,
    EmmmZone,
    EmmmNormalVector,
    EmmmLine,
    EmmmIcon,
    EmmmButton,
  },
  emits: ['apply', 'back'],
})
export default class GeometricMethodGraphic extends Vue {
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
  pointVectorForGraphic!: tPointVectorForGraphic;

  @Prop({
    type: Object,
    required: true,
  })
  condition!: tCondition;

  graphicBuilder = new GraphicBuilder().setRangeX(this.startX, this.endX).setRangeY(this.startY, this.endY);
  // point: TPoint = new TPoint(0, 5);

  get lines(): TLine[] {
    return [
      TLine.createLineByPoints(this.startX, 0, this.endX, 0, true),
      TLine.createLineByPoints(0, this.startY, 0, this.endY, true),
      ...this.condition.inequalities.map(inequality =>
        TLine.createLineByEquation(inequality.result! / inequality.y!, -inequality.x! / inequality.y!, this.startX, this.endX, false),
      ),
    ];
  }

  normalVector: {
    vector: TPoint;
    point: TPoint;
  } = {
    vector: new TPoint(this.condition.Lmax.x!, this.condition.Lmax.y!),
    point: new TPoint(this.pointVectorForGraphic.x!, this.pointVectorForGraphic.y!),
  };

  get allLines(): TLine[] {
    return [
      ...this.lines,
      TLine.createLineByPoints(this.startX, this.startY, this.startX, this.endY, true),
      TLine.createLineByEquation(this.startY, 0, this.startX, this.endX, true),
      TLine.createLineByEquation(this.endY, 0, this.startX, this.endX, false),
      TLine.createLineByPoints(this.endX, this.startY, this.endX, this.endY, false),
    ];
  }

  get pointsOfIntersection(): TPoint[] {
    return TStaticZoneBuilder.pointsOfIntersection(this.lines);
  }

  perpendicularPoints(point: TPoint): TPoint[] {
    return this.parallelLines.map(line => line.perpendicularPoint(point));
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
    return TStaticZoneBuilder.pointsOfArea(this.condition.inequalities);
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

  zonePoints: TPoint[] = TStaticZoneBuilder.pointsAxis(this.allLines, this.startX, this.endX, this.startY, this.endY);

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
    this.pointVectorForGraphic.x = nearestPoint.x;
    this.pointVectorForGraphic.y = nearestPoint.y;
  }

  get maxValue(): number {
    return Math.max(...this.pointsOfArea.map(point => point.x * this.condition.Lmax.x! + point.y * this.condition.Lmax.y!));
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.geometric-method-graphic {
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
