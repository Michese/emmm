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
        <emmm-line v-for="line in lines" :key="line" :line="line" :is-corrugated="false" />
        <emmm-normal-vector :vector="normalVector.vector" :point="normalVector.point" @set-point="setVectorPoint" />
      </emmm-graphic>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
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
import { Prop } from 'vue-property-decorator';

const startX = -5,
  endX = 25,
  startY = -5,
  endY = 25;

@Options({
  name: 'GeometricMethodGraphic',
  components: {
    EmmmGraphic,
    EmmmPoint,
    EmmmZone,
    EmmmNormalVector,
    EmmmLine,
    EmmmIcon,
  },
})
export default class GeometricMethodGraphic extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  graphicBuilder = new GraphicBuilder().setRangeX(startX, endX).setRangeY(startY, endY);
  point: TPoint = new TPoint(0, 5);
  lines: TLine[] = [
    TLine.createLineByPoints(startX, 0, endX, 0, true),
    TLine.createLineByPoints(0, startY, 0, endY, true),
    TLine.createLineByEquation(1, 3, startX, endX, false),
    TLine.createLineByEquation(4, 0, startX, endX, false),
    TLine.createLineByEquation(9, -2, startX, endX, false),
  ];
  normalVector: {
    vector: TPoint;
    point: TPoint;
  } = {
    vector: new TPoint(2, 1),
    point: new TPoint(0, 0),
  };

  get allLines(): TLine[] {
    return [
      ...this.lines,
      TLine.createLineByPoints(startX, startY, startX, endY, true),
      TLine.createLineByEquation(startY, 0, startX, endX, true),
      TLine.createLineByEquation(endY, 0, startX, endX, false),
      TLine.createLineByPoints(endX, startY, endX, endY, false),
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

  zonePoints: TPoint[] = TStaticZoneBuilder.pointsAxis(this.allLines, startX, endX, startY, endY);

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
  }
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
  }
}

.question {
  display: flex;
  align-items: center;

  &__icon {
    fill: var(--dark-blue-color);
  }
}
</style>
