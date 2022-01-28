<template>
  <defs>
    <marker id="black-arrow" viewBox="0 0 6 6" refX="4" refY="3" orient="auto">
      <path d="M 0 0 L 6 3 L 0 6 z" :style="vectorMarkerStyles" />
    </marker>
  </defs>
  <g @mousedown.stop.prevent="onMouseDown">
    <polyline :points="points" :style="vectorStyles" stroke-width="0.4" marker-end="url(#black-arrow)" />
    <polyline :points="backgroundPoints" fill="transparent" stroke-width="2" />
  </g>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Emit, Inject, InjectReactive, Prop, Watch } from 'vue-property-decorator';
import { GraphicBuilder, TPoint } from '@/components/emmmGraphic/helper';

@Options({
  name: 'EmmmNormalVector',
  emits: ['set-point'],
})
export default class EmmmNormalVector extends Vue {
  declare $parent: Vue & {
    $refs: {
      graphic: HTMLDivElement;
    };
  };

  @Prop({
    type: Object as () => TPoint,
    required: true,
  })
  vector!: TPoint;

  @Prop({
    type: Object as () => TPoint,
    required: true,
  })
  point!: TPoint;

  @Prop({
    type: Boolean,
    required: false,
    default: () => true,
  })
  canMove!: boolean;

  get pointPx(): { x: number; y: number } {
    const { ratioSizeCell } = this.graphicBuilder;
    return { x: this.startPoint.x + this.point.x * ratioSizeCell, y: this.startPoint.y - this.point.y * ratioSizeCell };
  }

  get vectorStyles(): { stroke: string } {
    return { stroke: this.canMove ? 'var(--orange-color)' : 'var(--orange-color)' };
  }

  get vectorMarkerStyles(): { fill: string } {
    return { fill: this.canMove ? 'var(--orange-color)' : 'var(--orange-color)' };
  }

  currentPoint: { x: number; y: number } = { x: 0, y: 0 };
  movePoint: { x: number; y: number } | null = null;

  @Inject()
  readonly graphicBuilder!: GraphicBuilder;

  @Inject()
  readonly startPoint!: { x: number; y: number };

  @Inject()
  readonly svgWidth!: number;

  @Inject()
  readonly svgHeight!: number;

  @InjectReactive('showEndX')
  readonly showEndX!: number;

  @InjectReactive('showEndY')
  readonly showEndY!: number;

  @Watch('pointPx', { immediate: true, deep: true }) wCurrentPoint(): void {
    this.currentPoint.x = this.pointPx.x;
    this.currentPoint.y = this.pointPx.y;
  }

  @Watch('movePoint') wMovePoint(): void {
    if (this.movePoint) {
      this.$parent.$refs.graphic.addEventListener('mouseleave', this.onMouseLeave);
      this.$parent.$refs.graphic.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    } else {
      this.$parent.$refs.graphic.removeEventListener('mouseleave', this.onMouseLeave);
      this.$parent.$refs.graphic.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      const { ratioSizeCell } = this.graphicBuilder;
      const pointUnit = new TPoint(
        (this.currentPoint.x - this.startPoint.x) / ratioSizeCell,
        (this.startPoint.y - this.currentPoint.y) / ratioSizeCell,
      );
      this.setPoint(pointUnit);
    }
  }

  @Emit('set-point') setPoint(point: TPoint): TPoint {
    return point;
  }

  onMouseDown({ offsetX: x, offsetY: y }: MouseEvent): void {
    if (this.canMove) this.movePoint = { x: x, y };
  }

  onMouseMove({ offsetX, offsetY }: MouseEvent): void {
    if (!this.movePoint) return;

    const { x, y } = this.movePoint,
      resultX = this.pointPx.x - ((x - offsetX) * this.showEndX) / this.svgWidth,
      resultY = this.pointPx.y - ((y - offsetY) * this.showEndY) / this.svgHeight;
    this.currentPoint.x = resultX;
    this.currentPoint.y = resultY;
  }

  onMouseLeave(): void {
    this.movePoint = null;
  }

  onMouseUp(): void {
    this.movePoint = null;
  }

  get points(): string {
    if (!this.startPoint) return ``;

    const moreX = Math.abs(this.vector.x) >= Math.abs(this.vector.y),
      { x, y } = this.currentPoint,
      { sizeCellPx } = this.graphicBuilder,
      ratioVectorX = Math.abs(this.vector.x / this.vector.y),
      signX = this.vector.x >= 0,
      signY = this.vector.y >= 0;

    return `${x}, ${y} ${x - ((signY ? 1 : -1) * (moreX ? sizeCellPx / ratioVectorX : sizeCellPx)) / 4}
      ${y - ((signX ? 1 : -1) * (moreX ? sizeCellPx : sizeCellPx * ratioVectorX)) / 4}
    ${x + ((signY ? 1 : -1) * (moreX ? sizeCellPx / ratioVectorX : sizeCellPx)) / 4}, ${
      y + ((signX ? 1 : -1) * (moreX ? sizeCellPx : sizeCellPx * ratioVectorX)) / 4
    } ${x}, ${y} ${x + ((signX ? 1 : -1) * (moreX ? sizeCellPx : sizeCellPx * ratioVectorX)) / 2},
    ${y - ((signY ? 1 : -1) * (moreX ? sizeCellPx / ratioVectorX : sizeCellPx)) / 2}`;
  }

  get backgroundPoints(): string {
    if (!this.startPoint) return ``;

    const moreX = this.vector.x >= this.vector.y,
      { x, y } = this.currentPoint,
      { sizeCellPx } = this.graphicBuilder,
      ratioVectorX = this.vector.x / this.vector.y,
      signX = this.vector.x >= 0,
      signY = this.vector.y >= 0;

    return `${x - ((signY ? 1 : -1) * (moreX ? sizeCellPx / ratioVectorX : sizeCellPx)) / 2}
      ${y - ((signX ? 1 : -1) * (moreX ? sizeCellPx : sizeCellPx * ratioVectorX)) / 2}
    ${x + ((signY ? 1 : -1) * (moreX ? sizeCellPx / ratioVectorX : sizeCellPx)) / 2}, ${
      y + ((signX ? 1 : -1) * (moreX ? sizeCellPx : sizeCellPx * ratioVectorX)) / 2
    } ${x + (signX ? 1 : -1) * (moreX ? sizeCellPx : sizeCellPx * ratioVectorX)},
    ${y - (signY ? 1 : -1) * (moreX ? sizeCellPx / ratioVectorX : sizeCellPx)}`;
  }
}
</script>

<style lang="scss" scoped></style>
