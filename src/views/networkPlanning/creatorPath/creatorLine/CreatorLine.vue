<template>
  <svg :width="length" :height="strokeWidth" xmlns="http://www.w3.org/2000/svg" :style="lineStyles" class="creator_line">
    <polyline
      :points="`0, 5 ${length}, 5 ${length - 8}, 0 ${length}, 5 ${length - 8}, 10 ${length}, 5 0, 5`"
      stroke-width="2"
      :stroke="strokeColor"
    />
  </svg>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
  name: 'CreatorLine',
})
export default class CreatorLine extends Vue {
  @Prop({
    type: Number,
    required: false,
    default: () => 10,
  })
  strokeWidth!: number;

  @Prop({
    type: String,
    required: false,
    default: () => 'var(--blue-color)',
  })
  strokeColor!: string;

  @Prop({
    type: Number,
    required: true,
  })
  x1!: number;

  @Prop({
    type: Number,
    required: true,
  })
  y1!: number;

  @Prop({
    type: Number,
    required: true,
  })
  x2!: number;

  @Prop({
    type: Number,
    required: true,
  })
  y2!: number;

  get lineStyles(): { transform: string } {
    return {
      transform: `translate(${this.x1}px, ${this.y1}px) rotate(${this.degrees}rad)`,
    };
  }

  get length(): number {
    return Math.hypot(this.distanceX, this.distanceY);
  }

  get distanceX(): number {
    return Math.abs(this.x2 - this.x1);
  }

  get distanceY(): number {
    return Math.abs(this.y2 - this.y1);
  }

  get degrees(): number {
    return (this.y2 > this.y1 ? 1 : -1) * Math.acos((this.x2 - this.x1) / this.length) ;
  }
}
</script>

<style lang="scss" scoped>
.creator_line {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 100;
  transform-origin: 0 50%;
}
</style>
