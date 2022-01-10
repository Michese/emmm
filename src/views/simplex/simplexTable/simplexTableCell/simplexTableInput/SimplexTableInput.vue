<template>
  <input
    type="text"
    class="simplex-table-input"
    :disabled="disabled"
    ref="input"
    @keydown.enter="$event.target.blur()"
    :value="value"
    @change="onChange($event.target.value)"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Fraction, TPreparedFraction } from '@/class';

@Options({
  name: 'SimplexTableInput',
  emits: ['input', 'change'],
})
export default class SimplexTableInput extends Vue {
  declare $refs: {
    input: HTMLInputElement;
  };

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabled!: boolean;

  @Prop({
    required: true,
  })
  value!: TPreparedFraction | null;

  onChange(value: string): void {
    const preparedValue = value.replaceAll(/,/giu, '.').replaceAll(/[^0-9.\-/]+/giu, '');
    this.$emit('change', Fraction.prepareNumber(preparedValue));
  }

  focus(): void {
    this.$refs.input.focus();
  }
}
</script>

<style lang="scss" scoped>
.simplex-table-input {
  position: absolute;
  top: 0;
  bottom: 0;
  border: 2px dashed var(--blue-color);
  background-color: var(--light-green-color);
  text-align: center;
  outline: none;
  max-width: 100%;
  z-index: -1;

  &:focus {
    transform: scale(1.2);
    max-width: 190%;
    z-index: 1;
    transition-timing-function: linear;
    transition-duration: 0.1s;
    transition-property: max-width, transform;
  }
}
</style>
