<template>
  <div v-for="(lineStyles, index) in linesStyles" :key="`line_${index}`" :style="lineStyles" class="creator-path__line" />
  <div
    v-for="(pointStyles, index) in pointsStyles"
    :key="`point_${index}`"
    :style="pointStyles"
    class="creator-path__point"
    :class="index % 2 === 1 ? 'minus' : 'plus'"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
  name: 'CreatorPath',
})
export default class CreatorPath extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  readonly pathElements!: HTMLDivElement[];

  get pointsLocation(): { top: number; left: number }[] {
    return this.pathElements.map(element => ({ top: element.offsetTop + 55, left: element.offsetLeft + 55 }));
  }

  get pointsStyles(): { top: string; left: string }[] {
    return this.pointsLocation.map(element => ({ top: `${element.top - 10}px`, left: `${element.left - 10}px` }));
  }

  get linesStyles(): { top: string; left: string; width?: string; height?: string }[] {
    return [
      ...this.pointsLocation.slice(1, this.pointsLocation.length).map((point, index) => {
        const previousPoint = this.pointsLocation[index],
          top = Math.min(previousPoint.top, point.top) - 2,
          left = Math.min(previousPoint.left, point.left) - 2,
          width = previousPoint.top === point.top ? Math.abs(previousPoint.left - point.left) : undefined,
          height = previousPoint.left === point.left ? Math.abs(previousPoint.top - point.top) : undefined;
        return {
          top: `${top}px`,
          left: `${left}px`,
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }
      }),
      ...(this.lastLine)
    ];
  }

  get lastLine(): { top: string; left: string; width?: string; height?: string }[] {
    if (this.pointsLocation.length <= 2) {
      return [];
    }
    let lastLine: { top: string; left: string; width?: string; height?: string }[] = [];
    const lastPoint = this.pointsLocation[this.pointsLocation.length -1];
    if (this.pointsLocation[0].top === lastPoint.top || this.pointsLocation.length > 2 && this.pointsLocation[0].left === this.pointsLocation[this.pointsLocation.length -1].left) {
      const top = Math.min(this.pointsLocation[0].top, lastPoint.top) - 2,
        left = Math.min(this.pointsLocation[0].left, lastPoint.left) - 2,
        width = this.pointsLocation[0].top === lastPoint.top ? Math.abs(this.pointsLocation[0].left - lastPoint.left) : undefined,
        height = this.pointsLocation[0].left === lastPoint.left ? Math.abs(this.pointsLocation[0].top - lastPoint.top) : undefined;
      lastLine.push({
        top: `${top}px`,
        left: `${left}px`,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      });
    }

    return lastLine;
  }
}
</script>

<style lang="scss" scoped>
.creator-path {
  &__point {
    display: flex;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--blue-color);
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0.8em;
    line-height: 0.1em;
    font-weight: 500;

    &.plus {
      align-items: center;
      &:after {
        content: '+';
      }
    }
    &.minus:after {
      content: '_';
    }
  }

  &__line {
    position: absolute;
    height: 4px;
    width: 4px;
    background-color: var(--blue-color);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
}
</style>
