<template>
  <section class="static-graphic" :style="staticGraphicStyles">
    <div class="static-graphic__top">
      <div class="static-graphic__markup-y markup-y">
        <span v-for="markupY in markupsY" :key="markupY" class="markup-y__number" :title="markupY.full">{{ markupY.incomplete }}</span>
      </div>
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="viewBox"
        ref="graphic"
        xmlns="http://www.w3.org/2000/svg"
        class="static-graphic__body"
        @wheel.ctrl.prevent="onWheel"
        @mousedown.alt.prevent="onMouseDown"
        @mousemove.alt.prevent="mouseMoveEvent"
        @mouseup.prevent="movePoint = null"
        @mouseleave.prevent="movePoint = null"
      >
        <polyline :points="framePolyline" fill="none" stroke="gray" stroke-width="0.1" />
        <polyline :points="gridPolyline" fill="none" stroke="gray" stroke-width="0.1" stroke-dasharray="0.2" />
        <polyline v-if="showAxiosX || showAxiosY" :points="axisPolyline" fill="black" stroke="black" stroke-width="0.4" />
        <text v-if="showAxiosY" :x="axisMarkY.x" :y="axisMarkY.y" class="static-graphic__axis-mark">y</text>
        <text v-if="showAxiosX" :x="axisMarkX.x" :y="axisMarkX.y" class="static-graphic__axis-mark">x</text>
        <slot></slot>
      </svg>
    </div>
    <div class="static-graphic__bottom">
      <div class="markup-x">
        <span v-for="markupX in markupsX" :key="markupX" class="markup-x__number" :title="markupX.full">{{ markupX.incomplete }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Provide, ProvideReactive } from 'vue-property-decorator';
import { GraphicBuilder } from '.';
import { EmmmGrid } from '@/components';

@Options({
  name: 'EmmmGraphic',
  components: {
    EmmmGrid,
  },
})
export default class EmmmGraphic extends Vue {
  declare $refs: {
    graphic: HTMLDivElement;
  };

  showStartX = 0;
  @ProvideReactive('showEndX') showEndX = this.widthPx;
  showStartY = 0;
  @ProvideReactive('showEndY') showEndY = this.heightPx;
  movePoint: { x: number; y: number; startX: number; startY: number } | null = null;

  @Provide()
  @Prop({
    type: Number,
    required: false,
    default: () => 300,
  })
  svgWidth!: number;

  @Provide()
  @Prop({
    type: Number,
    required: false,
    default: () => 300,
  })
  svgHeight!: number;

  @Provide()
  @Prop({
    type: Object,
    required: false,
    default: () => new GraphicBuilder(),
  })
  graphicBuilder!: GraphicBuilder;

  @Provide()
  get startPoint(): { x: number; y: number } {
    return {
      x: Math.abs(this.graphicBuilder.startXUnit * this.graphicBuilder.ratioSizeCell),
      y: this.graphicBuilder.endYUnit * this.graphicBuilder.ratioSizeCell,
    };
  }

  @Provide()
  get countCellsX(): number {
    const { sizeCellUnit, startXUnit, endXUnit } = this.graphicBuilder;
    return (endXUnit - startXUnit) / sizeCellUnit;
  }

  @Provide()
  get countCellsY(): number {
    const { sizeCellUnit, startYUnit, endYUnit } = this.graphicBuilder;
    return (endYUnit - startYUnit) / sizeCellUnit;
  }

  @Provide()
  get heightPx(): number {
    const { sizeCellPx } = this.graphicBuilder;
    return this.countCellsY * sizeCellPx;
  }

  @Provide()
  get widthPx(): number {
    const { sizeCellPx } = this.graphicBuilder;
    return this.countCellsX * sizeCellPx;
  }

  get viewBox(): string {
    return `${this.showStartX} ${this.showStartY} ${this.showEndX}, ${this.showEndY}`;
  }

  get staticGraphicStyles(): { maxWidth: string } {
    return {
      maxWidth: `${this.svgWidth + 100}px`,
    };
  }

  get markupsY(): { incomplete: string; full: number }[] {
    const { endYUnit, sizeCellUnit, sizeCellPx } = this.graphicBuilder,
      endY = endYUnit - (50 * this.showEndY * sizeCellUnit) / (this.svgHeight * sizeCellPx) - (this.showStartY * sizeCellUnit) / sizeCellPx;
    return [...this.generateMarkups(this.svgHeight)].map(markup => ({
      incomplete: (endY - (markup * 100 * this.showEndY * sizeCellUnit) / (this.svgHeight * sizeCellPx)).toFixed(2).toString(),
      full: endY - (markup * 100 * this.showEndY * sizeCellUnit) / (this.svgHeight * sizeCellPx),
    }));
  }

  get markupsX(): { incomplete: string; full: number }[] {
    const { startXUnit, sizeCellUnit, sizeCellPx } = this.graphicBuilder,
      startX = startXUnit + (50 * this.showEndX * sizeCellUnit) / (this.svgWidth * sizeCellPx) + (this.showStartX * sizeCellUnit) / sizeCellPx;
    return [...this.generateMarkups(this.svgWidth)].map(markup => ({
      incomplete: (startX + (markup * 100 * this.showEndX * sizeCellUnit) / (this.svgWidth * sizeCellPx)).toFixed(2).toString(),
      full: startX + (markup * 100 * this.showEndX * sizeCellUnit) / (this.svgWidth * sizeCellPx),
    }));
  }

  onWheel({ offsetX, offsetY, deltaY }: WheelEvent): void {
    const min = Math.min(this.widthPx, this.heightPx) / 10,
      half = min / 2,
      ratioX = (offsetX / this.svgWidth) * 2,
      ratioY = (offsetY / this.svgHeight) * 2;
    if (deltaY > 0) {
      this.showStartX -= half * ratioX;
      if (this.showEndX < this.widthPx) this.showEndX += min;
      this.showStartY -= half * ratioY;
      if (this.showEndY < this.heightPx) this.showEndY += min;
      if (this.showStartX < 0) this.showStartX = 0;
      if (this.showStartY < 0) this.showStartY = 0;
    } else if (deltaY < 0 && this.showEndX > this.showStartX && this.showEndY > this.showStartY) {
      this.showStartX += half * ratioX;
      this.showEndX -= min;
      this.showStartY += half * ratioY;
      this.showEndY -= min;
    }
  }

  onMouseDown({ offsetX: x, offsetY: y }: MouseEvent): void {
    this.movePoint = { x, y, startX: this.showStartX, startY: this.showStartY };
  }

  mouseMoveEvent({ offsetX, offsetY }: MouseEvent): void {
    if (!this.movePoint) return;
    const { x, y, startX, startY } = this.movePoint,
      resultX = startX + ((x - offsetX) * this.showEndX) / this.svgWidth,
      resultY = startY + ((y - offsetY) * this.showEndY) / this.svgHeight;

    if (resultX >= -1 && resultX + this.showEndX - 2 <= this.widthPx) this.showStartX = resultX;
    if (resultY >= -1 && resultY + this.showEndY - 2 <= this.heightPx) this.showStartY = resultY;
  }

  *generateMarkups(length: number): Generator<number> {
    const size = length / 100;
    for (let count = 0; count < size; count++) {
      yield count;
    }
  }

  // Grid
  get gridPolyline(): string {
    const { sizeCellPx, sizeCellUnit, startXUnit, endYUnit } = this.graphicBuilder;
    let polyline = `0, 0 0, ${this.heightPx} ${this.widthPx}, ${this.heightPx} ${this.widthPx}, 0`,
      isEnd = true;
    for (let row = ((endYUnit % sizeCellUnit) * sizeCellPx) / sizeCellUnit; row < this.heightPx; isEnd = !isEnd, row += sizeCellPx) {
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
    return { x: this.startPoint.x - 4, y: 2 };
  }

  get axisPolyline(): string {
    const arrowWidth = this.svgWidth / (this.showEndX * 10),
      arrowHeight = this.svgHeight / (this.showEndY * 10);
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

<style lang="scss" scoped>
.static-graphic {
  &__top {
    display: flex;
  }

  &__body {
    background-color: var(--light-green-color);
  }

  &__axis-mark {
    font-size: 0.1em;
  }
}

.markup-y {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-right: 10px;
  width: 100px;

  &__number {
    line-height: 100px;
    font-size: 30px;
    text-align: end;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.markup-x {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  &__number {
    line-height: 100px;
    font-size: 30px;
    text-align: end;
    transform: rotate(-90deg);
    width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
