<template>
  <div class="potential-table-cell" :style="cellStyles" :class="cellClasses" @click="focus" ref="cell">
    <div v-if="showInputs" class="potential-table-cell__top">
      <circle-input
        :disabled="disabledLeftInput"
        :value="potentialTableCell.left.value"
        @input="inputCircle('left', $event)"
        :border-color="potentialTableCell.left.borderColor"
      />
      <circle-input :disabled="disabledRightInput" :value="potentialTableCell.right" @input="inputCircle('right', $event)" />
    </div>
    <cell-input ref="cellInput" :disabled="disabledInput" :value="potentialTableCell.value" @input="inputCell" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CellInput from '@/views/methodOfPotentials/potentialTable/potentialTableCell/cellInput/CellInput.vue';
import CircleInput from '@/views/methodOfPotentials/potentialTable/potentialTableCell/circleInput/CircleInput.vue';
import { Prop } from 'vue-property-decorator';
import { tPotentialTableCell } from '@/views/methodOfPotentials/component';
import { colorEnum } from '@/components';

@Options({
  name: 'PotentialTableCell',
  components: { CellInput, CircleInput },
})
export default class PotentialTableCell extends Vue {
  declare $refs: {
    cellInput: { focus: () => void };
  };

  @Prop({
    type: Object,
    required: true,
  })
  potentialTableCell!: tPotentialTableCell;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isMinCell!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabledCell!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabledInput!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabledLeftInput!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabledRightInput!: boolean;

  get showInputs(): boolean {
    return this.potentialTableCell.right !== undefined;
  }

  get cellClasses(): { disabled: boolean; center: boolean; 'is-min-cell': boolean } {
    return { disabled: this.disabledCell, center: !this.showInputs, 'is-min-cell': this.isMinCell };
  }

  get cellStyles(): { borderColor: keyof typeof colorEnum | null } {
    return { borderColor: this.potentialTableCell.borderColor };
  }

  inputCircle(circle: 'left' | 'right', value: string): void {
    if (circle === 'left') {
      if (+value % 100 === this.potentialTableCell.left!.value) {
        this.potentialTableCell.left!.value = null;
        this.$nextTick(() => {
          this.potentialTableCell.left!.value = +value % 100;
        });
      } else {
        this.potentialTableCell.left!.value = +value % 100;
      }
      this.potentialTableCell.left!.borderColor = null;
    } else if (circle === 'right') {
      if (+value % 100 === this.potentialTableCell.right) {
        this.potentialTableCell.right = null;
        this.$nextTick(() => {
          this.potentialTableCell.right = +value % 100;
        });
      } else {
        this.potentialTableCell.right = +value % 100;
      }
    } else throw SyntaxError(`Нет такого значения circle ${circle}`);
  }

  inputCell(value: string): void {
    this.potentialTableCell.borderColor = null;
    this.potentialTableCell.value = parseInt(value);
  }

  focus(): void {
    if (!this.disabledInput) this.$refs.cellInput.focus();
  }
}
</script>

<style lang="scss" scoped>
.potential-table-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--light-green-color);
  outline: 1px solid var(--green-color);
  border: 2px dotted transparent;
  padding: 5px;
  width: var(--width-cell);
  height: var(--height-cell);
  cursor: pointer;

  &__top {
    display: flex;
    justify-content: space-between;
    align-self: stretch;
  }

  &.center {
    justify-content: center;
  }

  &.disabled {
    background-color: var(--turquoise-color);
    cursor: default;
  }

  &.is-min-cell {
    border-color: var(--blue-color);
    background-color: var(--light-green-color);
  }
}
</style>
