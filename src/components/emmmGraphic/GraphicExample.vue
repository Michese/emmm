<template>
  <emmm-graphic :graphicBuilder="graphicBuilder" :svg-height="600" :svg-width="600" class="graphic-example__static-graphic">
    <emmm-zone :points="zonePoints" />
    <static-line v-for="line in lines" :key="line" :line="line" :is-corrugated="false" />
    <emmm-normal-vector :vector="normalVector.vector" :point="normalVector.point" @set-point="setVectorPoint" />
  </emmm-graphic>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import StaticLine from '@/components/emmmGraphic/EmmmLine.vue';
import CreatorLine from '@/components/emmmCreatorLine/EmmmCreatorLine.vue';
import { EmmmGraphic, GraphicBuilder, EmmmPoint, TPoint, TLine, EmmmZone, TStaticZoneBuilder, EmmmNormalVector } from '.';

const startX = -5,
  endX = 25,
  startY = -5,
  endY = 25;

@Options({
  name: 'GraphicExample',
  components: {
    EmmmGraphic,
    CreatorLine,
    EmmmPoint,
    StaticLine,
    EmmmZone,
    EmmmNormalVector,
  },
})
export default class Home extends Vue {
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
.graphic-example {
  &__static-graphic {
    margin-top: 100px;
    margin-left: 100px;
  }
}
</style>
