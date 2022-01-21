<template>
  <input
    class="network-table-input"
    type="number"
    ref="input"
    @keydown.enter="blur"
    :value="value"
    @input="$event => $emit('input', +$event.target.value)"
    @change="$event => $emit('change', +$event.target.value)"
    :disabled="disabled"
    :maxlength="2"
    :max="max"
    :min="min"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
  name: 'NetworkTableInput',
  emits: ['input', 'change'],
})
export default class NetworkTableInput extends Vue {
  declare $refs: {
    input: HTMLInputElement & { target: { value: string } };
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
  value?: number | null;

  @Prop({
    required: false,
  })
  min?: number;

  @Prop({
    required: false,
  })
  max?: number;

  focus(): void {
    if (!this.disabled && this.value !== undefined) this.$refs.input.focus();
  }

  blur(): void {
    this.$refs.input.blur();
  }
}
</script>

<style lang="scss" scoped>
.network-table-input {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px dashed transparent;
  background-color: var(--light-green-color);
  font-size: 24px;
  font-weight: 500;
  outline: none;
  text-align: center;
  z-index: -1;
  transition: transform 0.1s linear;

  &:focus {
    z-index: 2;
    border-color: var(--turquoise-color);
    transform: scale(1.3);
  }
}
</style>
