<template>
  <circle v-if="showPoint && showingPoint" :cx="x" :cy="y" :r="r" :stroke-width="strokeWidth" :stroke="strokeColor" :fill="fill" />
  <text v-if="showPoint && showingPoint && showMark" :x="x" :y="y" :style="markStyles">{{ mark }}</text>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Inject, Prop } from 'vue-property-decorator';
import { GraphicBuilder, TPoint } from '.';

@Options({
  name: 'EmmmPoint',
})
export default class EmmmPoint extends Vue {
  @Prop({
    type: Number,
    required: false,
    default: () => 0,
  })
  strokeWidth!: number;

  @Prop({
    type: Number,
    required: false,
    default: () => 0.8,
  })
  r!: number;

  @Prop({
    type: String,
    required: false,
    default: () => 'red',
  })
  strokeColor!: string;

  @Prop({
    type: String,
    required: false,
    default: () => 'red',
  })
  fill!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  showMark!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => true,
  })
  showPoint!: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  point!: TPoint;

  @Inject()
  readonly graphicBuilder!: GraphicBuilder;

  @Inject()
  readonly startPoint!: { x: number; y: number };

  get showingPoint(): boolean {
    return (
      this.graphicBuilder.endXUnit >= this.point.x &&
      this.graphicBuilder.startXUnit <= this.point.x &&
      this.graphicBuilder.startYUnit <= this.point.y &&
      this.graphicBuilder.endYUnit >= this.point.y
    );
  }

  get x(): number {
    const { sizeCellPx, sizeCellUnit } = this.graphicBuilder;
    return this.startPoint.x + (this.point.x * sizeCellPx) / sizeCellUnit;
  }

  get y(): number {
    const { sizeCellPx, sizeCellUnit } = this.graphicBuilder;
    return this.startPoint.y - (this.point.y * sizeCellPx) / sizeCellUnit;
  }

  get mark(): string {
    return `(${this.point.x}; ${this.point.y})`;
  }

  get markStyles(): Record<string, unknown> {
    return {
      fontSize: `${this.graphicBuilder.sizeCellPx / 3}px`,
    };
  }
}
</script>

<style lang="scss" scoped></style>
