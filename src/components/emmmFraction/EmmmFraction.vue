<template>
  <span class="fraction">
    <span class="fraction__top">{{ fraction.top }}</span>
    <span v-if="showingFraction" class="fraction__bottom">{{ fraction.bottom }}</span>
  </span>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Fraction as FractionConstructor } from '@/class';

@Options({
  name: 'Fraction',
})
export default class Fraction extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  fraction!: FractionConstructor;

  get showingFraction(): boolean {
    return this.fraction.bottom > 1;
  }
}
</script>

<style lang="scss" scoped>
.fraction {
  display: inline-block;
  text-align: center;

  &__bottom {
    border-top: 1px solid #000;
    display: block;
  }
}
</style>
