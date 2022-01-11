<template>
  <div v-if="isTableCell" class="simplex-table-cell simplex-table-cell_clicked" :class="cellClasses" :style="cellStyles" @click="this[clickEvent]">
    <emmm-fraction v-if="isFraction" :fraction="fraction" class="simplex-table-cell__fraction" :title="fractionTooltip" />
    <template v-else>{{ simplexTableCell.value }}</template>
    <simplex-table-input :disabled="disabled" :value="valueInput" @change="onChange" ref="input" />
  </div>
  <div v-else v-html="simplexTableCell.constValue" class="simplex-table-cell" :class="cellClasses" :style="cellStyles" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { tSimplexTableCell } from '@/views/simplex/component';
import { EmmmFraction } from '@/components';
import SimplexTableInput from '@/views/simplex/simplexTable/simplexTableCell/simplexTableInput/SimplexTableInput.vue';
import { Fraction, TPreparedFraction } from '@/class';

@Options({
  name: 'SimplexTableCell',
  components: { EmmmFraction, SimplexTableInput },
  emits: ['check'],
})
export default class SimplexTableCell extends Vue {
  declare $refs: {
    input: { focus: () => void };
  };

  @Prop({
    type: Object,
    required: true,
  })
  simplexTableCell!: tSimplexTableCell;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabled!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  checked!: boolean;

  @Prop({
    type: String,
    required: false,
    default: () => 'focus',
  })
  clickEvent!: 'focus' | 'check';

  get isTableCell(): boolean {
    return this.simplexTableCell.value !== undefined;
  }

  get isFraction(): boolean {
    return this.simplexTableCell.value !== null;
  }

  get fraction(): Fraction | null {
    return this.isFraction ? new Fraction(this.simplexTableCell.value!) : null;
  }

  get cellStyles(): { borderColor?: string } {
    return {
      borderColor: this.simplexTableCell?.borderColor ? `var(--${this.simplexTableCell.borderColor}-color)` : undefined,
    };
  }

  get cellClasses(): { disabled: boolean; checked: boolean } {
    return { disabled: this.disabled, checked: this.checked };
  }

  get valueInput(): string {
    return this.simplexTableCell.value ? new Fraction(this.simplexTableCell.value).toString() : '';
  }

  get fractionTooltip(): string {
    return this.fraction!.toString();
  }

  onChange(fraction: TPreparedFraction): void {
    this.simplexTableCell.value = fraction;
    if (this.simplexTableCell.borderColor !== null) this.simplexTableCell.borderColor = null;
  }

  check(): void {
    this.$emit('check');
  }

  focus(): void {
    this.$refs.input.focus();
  }
}
</script>

<style lang="scss" scoped>
.simplex-table-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  max-width: 100px;
  height: 70px;
  outline: 1px solid var(--dark-gray-color);
  border: 2px dotted transparent;
  background-color: var(--light-green-color);

  &__fraction {
    font-weight: 500;
    overflow-x: hidden;
    overflow-wrap: unset;
    text-overflow: ellipsis;
  }

  &_clicked {
    cursor: pointer;
    &:hover {
      border-color: var(--blue-color);
    }
  }

  &.disabled {
    background-color: var(--turquoise-color);
    cursor: default;
    &:hover {
      border-color: transparent;
    }
  }

  &.checked {
    outline: 2px solid var(--dark-blue-color);
  }

  &.disabled.checked {
    background-color: var(--light-green-color);
  }
}
</style>
