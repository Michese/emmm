<template>
  <polyline :points="pointsPolyline" fill-rule="nonzero" class="static-zone" fill="var(--light-blue-color)" stroke="none" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Inject, Prop } from 'vue-property-decorator';
import { GraphicBuilder, TPoint } from '@/components/emmmGraphic/helper';

@Options({
  name: 'EmmmZone',
})
export default class EmmmZone extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  points!: TPoint[];

  @Inject()
  readonly graphicBuilder!: GraphicBuilder;

  @Inject()
  readonly startPoint!: { x: number; y: number };

  get pointsPolyline(): string {
    const { ratioSizeCell } = this.graphicBuilder;
    return this.points.map(point => `${this.startPoint.x + point.x * ratioSizeCell}, ${this.startPoint.y - point.y * ratioSizeCell}`).join(' ');
  }
}
</script>

<style lang="scss" scoped></style>
