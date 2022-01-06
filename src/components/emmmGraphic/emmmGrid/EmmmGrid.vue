<template>
  <polyline :points="framePolyline" fill="none" stroke="gray" stroke-width="0.2" />
  <polyline :points="gridPolyline" fill="none" stroke="gray" stroke-width="0.2" stroke-dasharray="0.2" />
  <polyline v-if="showAxiosX || showAxiosY" :points="axisPolyline" fill="black" stroke="black" stroke-width="0.3" />
  <text v-if="showAxiosY" :x="axisMarkY.x" :y="axisMarkY.y" :style="axiosMarkStyles">y</text>
  <text v-if="showAxiosX" :x="axisMarkX.x" :y="axisMarkX.y" :style="axiosMarkStyles">x</text>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Inject } from 'vue-property-decorator';
import { GraphicBuilder } from '../index';

@Options({
  name: 'EmmmGrid',
})
export default class EmmmGrid extends Vue {
  @Inject()
  graphicBuilder!: GraphicBuilder;

  @Inject()
  readonly countCellsX!: number;

  @Inject()
  readonly countCellsY!: number;

  @Inject()
  readonly heightPx!: number;

  @Inject()
  readonly widthPx!: number;

  @Inject()
  readonly startPoint!: { x: number; y: number };

  get gridPolyline(): string {
    const { sizeCellPx, sizeCellUnit, startXUnit, startYUnit } = this.graphicBuilder;
    let polyline = `0, 0 0, ${this.heightPx} ${this.widthPx}, ${this.heightPx} ${this.widthPx}, 0`,
      isEnd = true;

    for (let row = (startYUnit % sizeCellUnit) * sizeCellPx; row < this.heightPx; isEnd = !isEnd, row += sizeCellPx) {
      polyline += ` ${isEnd ? this.widthPx : 0}, ${row} ${isEnd ? 0 : this.widthPx}, ${row}`;
    }
    if (isEnd) polyline += ` ${this.widthPx}, ${this.heightPx}`;

    for (let column = (startXUnit % sizeCellUnit) * sizeCellPx, isEnd = true; column < this.widthPx; column += sizeCellPx, isEnd = !isEnd) {
      polyline += ` ${column}, ${isEnd ? this.heightPx : 0} ${column}, ${isEnd ? 0 : this.heightPx}`;
    }

    return polyline;
  }

  get framePolyline(): string {
    return `0, 0 0, ${this.heightPx} ${this.widthPx}, ${this.heightPx} ${this.widthPx}, 0 0, 0`;
  }

  get showAxiosX(): boolean {
    return this.graphicBuilder.startYUnit <= 0 && this.graphicBuilder.endYUnit >= 0;
  }

  get showAxiosY(): boolean {
    return this.graphicBuilder.startXUnit <= 0 && this.graphicBuilder.endXUnit >= 0;
  }

  get axisMarkX(): { x: number; y: number } {
    return { x: this.widthPx - 2, y: this.startPoint.y - 3 };
  }

  get axisMarkY(): { x: number; y: number } {
    return { x: this.startPoint.x - 3, y: 2 };
  }

  get axiosMarkStyles(): Record<string, unknown> {
    const { sizeCellPx } = this.graphicBuilder;
    return {
      fontSize: `${sizeCellPx / 3}px`,
    };
  }

  get axisPolyline(): string {
    const arrowWidth = 2,
      arrowHeight = 3;
    let polyline = '';
    if (this.showAxiosY) {
      polyline += `${this.startPoint.x}, ${this.heightPx} ${this.startPoint.x}, 0 ${this.startPoint.x - arrowWidth}, ${arrowHeight} ${
        this.startPoint.x
      }, 0 ${this.startPoint.x + arrowWidth}, ${arrowHeight} ${this.startPoint.x}, 0 ${this.startPoint.x}, ${this.startPoint.y} `;
    }
    if (this.showAxiosX) {
      polyline += `0, ${this.startPoint.y} ${this.widthPx}, ${this.startPoint.y} ${this.widthPx - arrowHeight}, ${this.startPoint.y - arrowWidth} ${
        this.widthPx
      }, ${this.startPoint.y} ${this.widthPx - arrowHeight}, ${this.startPoint.y + arrowWidth} ${this.widthPx}, ${this.startPoint.y} `;
    }

    if (this.showAxiosY) {
      polyline += `${this.startPoint.x}, ${this.startPoint.y} ${this.startPoint.x}, ${this.heightPx}`;
    } else {
      polyline += `0, ${this.startPoint.y}`;
    }

    return polyline;
  }
}
</script>

<style lang="scss" scoped></style>
