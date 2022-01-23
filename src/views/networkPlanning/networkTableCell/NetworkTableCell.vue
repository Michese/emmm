<template>
  <div>
    <div class="network-table-cell" :class="cellClasses" :style="cellStyles" @click="focus" ref="cell">
      <template v-if="inputCell === undefined || (!!inputCell && inputCell.value !== null && inputCell.value !== 0)">
        <slot></slot>
      </template>
      <network-table-input
        v-if="inputCell !== undefined && inputCell !== null"
        :min="min"
        :max="max"
        :value="inputCell.value"
        :disabled="disabled"
        @input="input"
        @change="change"
        ref="input"
      />
      <button v-if="canDelete && !disabled" class="network-table-cell__delete" @click.stop="$emit('delete')">_</button>
      <button v-if="canAdd && !disabled" class="network-table-cell__add" @click.stop="$emit('add')">+</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import NetworkTableInput from '@/views/networkPlanning/networkTableCell/networkTableInput/NetworkTableInput.vue';
import { tCellInput } from '@/views/networkPlanning/component';

@Options({
  name: 'NetworkTableCell',
  components: { NetworkTableInput },
  emits: ['input', 'change', 'delete', 'add'],
})
export default class NetworkTableCell extends Vue {
  declare $refs: {
    input: { focus: () => void };
  };

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabled!: boolean;

  @Prop({
    required: false,
  })
  inputCell?: tCellInput | null;

  @Prop({
    required: false,
  })
  min?: number;

  @Prop({
    required: false,
  })
  max?: number;

  @Prop({
    type: Object,
    required: false,
  })
  styles?: CSSStyleRule;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isFirstColumn!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  canDelete!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  canAdd!: boolean;

  get cellClasses(): { first: boolean; disabled: boolean } {
    return { first: this.isFirstColumn, disabled: this.disabled };
  }

  get cellStyles(): CSSStyleRule | any {
    return {
      ...(this.styles ? this.styles : undefined),
      ...(this.inputCell?.borderColor ? { borderColor: `var(--${this.inputCell.borderColor}-color)` } : {}),
    };
  }

  change(value: number): void {
    this.$emit('change', +value);
  }

  input(value: number): void {
    this.$emit('input', +value);
  }

  focus(): void {
    if (!this.disabled && this.inputCell !== undefined) this.$refs.input.focus();
  }
}
</script>

<style lang="scss" scoped>
.network-table-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: var(--width-cell);
  height: var(--height-cell);
  font-size: 16px;
  background-color: var(--light-green-color);
  border: 2px dotted transparent;
  outline: 1px solid var(--green-color);
  cursor: pointer;

  &.first {
    justify-content: flex-start;
    padding-left: 5px;
    width: calc(var(--width-cell) * 2);
  }

  &.disabled {
    background-color: var(--turquoise-color);
    cursor: default;
  }

  &__delete {
    display: none;
    justify-content: center;
    align-items: flex-start;
    position: absolute;
    top: -12px;
    right: -12px;
    height: 25px;
    width: 25px;
    line-height: 0.6em;
    background-color: var(--orange-color);
    border: none;
    outline: none;
    border-radius: 50%;
    cursor: pointer;

    &:hover,
    &:focus {
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
    }

    &:active {
      box-shadow: inset 2px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }

  &__add {
    display: none;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: calc(50% - 12px);
    left: -20px;
    height: 30px;
    width: 30px;
    background-color: var(--blue-color);
    border: none;
    outline: none;
    border-radius: 50%;
    cursor: pointer;

    &:hover,
    &:focus {
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
    }

    &:active {
      box-shadow: inset 2px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }

  &:hover &__add,
  &:hover &__delete,
  &__add:focus,
  &__delete:focus {
    display: flex;
  }
}
</style>
