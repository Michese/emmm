<template>
  <div v-if="disabled" class="cell-input disabled">
    {{ value }}
  </div>
  <input v-else type="text" class="cell-input" ref="cellInput" :disabled="disabled" :value="value" @input="input($event.target.value)" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
  name: 'CellInput',
  emits: ['input'],
})
export default class CellInput extends Vue {
  declare $refs: {
    cellInput: HTMLInputElement;
  };

  @Prop({
    required: true,
  })
  value!: number | null;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabled!: boolean;

  @Watch('value') wValue(): void {
    if (this.value === null) {
      this.previous = '';
    }
  }

  previous = '';

  input(value: string): void {
    let validValue = value.replaceAll(/([^0-9-]+)/giu, '');
    if (/-/iu.test(validValue)) {
      if (validValue.match(/-/giu)?.length === 2) {
        validValue = validValue.replaceAll(/-/giu, '');
      } else {
        validValue = '-' + validValue.replaceAll(/-/giu, '');
      }
    }

    if (validValue === '-' || validValue === '-0' || validValue === '') {
      //
    } else if (isNaN(parseInt(validValue)) || validValue === this.previous) {
      this.$nextTick(() => {
        this.$refs.cellInput.value = this.previous;
      });
    } else {
      this.previous = validValue;
      this.$emit('input', validValue);
    }
  }

  focus(): void {
    this.$refs.cellInput.focus();
  }
}
</script>

<style lang="scss" scoped>
.cell-input {
  text-align: center;
  max-width: 60px;
  background-color: transparent;
  border: 2px dotted transparent;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--gray-color);
  }

  &.disabled {
    opacity: 0.6;
  }
}
</style>
