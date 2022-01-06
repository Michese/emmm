<template>
  <teleport to="body">
    <svg :width="length" :height="strokeWidth" xmlns="http://www.w3.org/2000/svg" :style="lineStyles" class="creator_line" />
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
  name: 'EmmmCreatorLine',
})
export default class EmmmCreatorLine extends Vue {
  @Prop({
    type: Number,
    required: false,
    default: () => 2,
  })
  strokeWidth!: number;

  @Prop({
    type: String,
    required: false,
    default: () => 'red',
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

  get lineStyles(): { backgroundColor: string; transform: string } {
    return {
      backgroundColor: this.strokeColor,
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
    return Math.acos(this.distanceX / this.length);
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
