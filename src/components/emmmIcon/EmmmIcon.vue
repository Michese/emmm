<template>
  <svg class="icon" :style="iconStyle">
    <use class="icon__inner" :xlink:href="`#${icon}`"></use>
  </svg>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { iconNames } from '@/components';

@Options({
  name: 'EmmmIcon',
})
export default class EmmmIcon extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  icon!: iconNames;

  @Prop({
    type: Number,
    required: false,
    default: () => 20,
  })
  size!: number;

  @Prop({
    type: String,
    required: false,
    default: () => 'px',
  })
  unitSize!: string;

  get iconStyle(): { fontSize: string } {
    return {
      fontSize: `${this.size}${this.unitSize}`,
    };
  }
}
</script>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  width: 1em;
  height: 1em;
}
</style>
