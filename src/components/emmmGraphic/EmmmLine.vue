<template>
  <line
    v-if="showingLine"
    :x1="firstPointX"
    :y1="firstPointY"
    :x2="secondPointX"
    :y2="secondPointY"
    :stroke="strokeColor"
    :stroke-width="strokeWidth"
  />
  <line
    v-if="isCorrugated"
    :x1="corrugateFirstPointX"
    :y1="corrugateFirstPointY"
    :x2="corrugateSecondPointX"
    :y2="corrugateSecondPointY"
    :stroke="strokeColor"
    :stroke-width="corrugateStrokeWidth"
    stroke-dasharray="0.1 2"
    stroke-opacity="0.5"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Inject, Prop } from 'vue-property-decorator';
import { GraphicBuilder, TPoint, TLine } from '@/components/emmmGraphic/helper';

@Options({
  name: 'EmmmLine',
})
export default class EmmmLine extends Vue {
  @Prop({
    type: Number,
    required: false,
    default: () => 0.2,
  })
  strokeWidth!: number;

  @Prop({
    type: String,
    required: false,
    default: () => 'black',
  })
  strokeColor!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  showMark!: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  line!: TLine;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCorrugated!: boolean;

  @Prop({
    type: Number,
    required: false,
    default: () => 0.7,
  })
  corrugateStrokeWidth!: number;

  @Inject()
  readonly graphicBuilder!: GraphicBuilder;

  @Inject()
  readonly startPoint!: { x: number; y: number };

  get corrugateLine(): TLine {
    const {
        firstPoint: { x: x1, y: y1 },
        secondPoint: { x: x2, y: y2 },
        more,
        a1,
        a0,
      } = this.line,
      { ratioSizeCell } = this.graphicBuilder;
    return x1 === x2
      ? TLine.createLineByPoints(
          x1 + (more ? 1 : -1) * ((this.corrugateStrokeWidth + this.strokeWidth) / (ratioSizeCell * 2)),
          y1,
          x2 + (more ? 1 : -1) * ((this.corrugateStrokeWidth + this.strokeWidth) / (ratioSizeCell * 2)),
          y2,
          more,
        )
      : TLine.createLineByEquation(
          a0 + Math.abs(a1 || 1) * (more ? 1 : -1) * ((this.corrugateStrokeWidth + this.strokeWidth) / (ratioSizeCell * 2)),
          a1,
          x1,
          x2,
        );
  }

  get firstPoint(): TPoint {
    return this.line.firstPoint;
  }

  get secondPoint(): TPoint {
    return this.line.secondPoint;
  }

  get firstPointX(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.x + this.firstPoint.x * ratioSizeCell;
  }

  get firstPointY(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.y - this.firstPoint.y * ratioSizeCell;
  }

  get secondPointX(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.x + this.secondPoint.x * ratioSizeCell;
  }

  get secondPointY(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.y - this.secondPoint.y * ratioSizeCell;
  }

  get corrugateFirstPointX(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.x + this.corrugateLine.firstPoint.x * ratioSizeCell;
  }

  get corrugateFirstPointY(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.y - this.corrugateLine.firstPoint.y * ratioSizeCell;
  }

  get corrugateSecondPointX(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.x + this.corrugateLine.secondPoint.x * ratioSizeCell;
  }

  get corrugateSecondPointY(): number {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.startPoint.y - this.corrugateLine.secondPoint.y * ratioSizeCell;
  }

  get showingLine(): boolean {
    const minX = Math.min(this.firstPoint.x, this.secondPoint.x),
      maxX = minX === this.firstPoint.x ? this.secondPoint.x : this.firstPoint.x,
      minY = Math.min(this.firstPoint.y, this.secondPoint.y),
      maxY = minY === this.firstPoint.y ? this.secondPoint.y : this.firstPoint.y;
    return (
      this.graphicBuilder.endXUnit >= minX &&
      this.graphicBuilder.startXUnit <= maxX &&
      this.graphicBuilder.endYUnit >= minY &&
      this.graphicBuilder.startYUnit <= maxY
    );
  }

  get title(): string {
    const { x: x1 } = this.firstPoint,
      { x: x2 } = this.secondPoint;
    return x1 === x2 ? `x = ${x1}` : `y = ${this.line.a1}x + ${this.line.a0}`;
  }

  *generateCorrugatedPoints(length: number): Generator<number> {
    const size = length / 100;
    for (let count = 0; count < size; count++) {
      yield count;
    }
  }
}
</script>

<style lang="scss" scoped></style>
