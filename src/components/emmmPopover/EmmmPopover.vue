<template>
  <div class="emmm-popover__wrapper" @mouseenter="mouseEnterEvent" @mousemove="mouseEnterEvent" @mouseleave="hiddePopover" @wheel="hiddePopover">
    <slot></slot>
  </div>
  <teleport to="body">
    <section v-show="show" class="emmm-popover" :style="popoverStyles" ref="popover">
      <span class="emmm-popover__text" v-html="text" />
    </section>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Ref } from 'vue-property-decorator';

@Options({
  name: 'EmmmPopover',
})
export default class EmmmPopover extends Vue {
  @Ref('popover') popover!: HTMLDivElement;

  @Prop({
    type: String,
    required: true,
  })
  text!: string;

  timeout = 0;
  show = false;
  left = 0;
  top = 0;
  width = 0;
  height = 0;

  mouseEnterEvent(event: { pageY: number; pageX: number }): void {
    this.showPopover(event.pageX, event.pageY);
  }
  get popoverStyles(): { left: string; top: string } {
    return { left: `${this.left}px`, top: `${this.top}px` };
  }

  showPopover(x: number, y: number): void {
    clearTimeout(this.timeout);
    if (!this.width) {
      const { width, height } = this.popover.getBoundingClientRect();
      this.width = width;
      this.height = height;
    }
    this.left = x - this.width / 2;
    this.top = y - this.height - 8;
    this.show = true;
    this.timeout = setTimeout(this.hiddePopover, 10000);
  }

  hiddePopover(): void {
    this.show = false;
    clearTimeout(this.timeout);
  }
}
</script>

<style lang="scss" scoped>
.emmm-popover {
  display: block;
  position: absolute;
  padding: 4px 10px 4px;
  max-height: 50px;
  border: 1px solid var(--blue-color);
  border-radius: 10px;

  z-index: 10000;
  background-color: var(--light-green-color);

  &__text {
    font-weight: 500;
    line-height: 0.9em;
  }

  &__wrapper {
    empty-cells: hide;
  }
}
</style>
