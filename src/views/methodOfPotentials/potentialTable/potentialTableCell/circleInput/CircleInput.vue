<template>
  <div v-if="disabled" class="circle-input disabled" :style="circleInputStyles">
    {{ value }}
  </div>
  <input
    v-else
    type="text"
    class="circle-input"
    :style="circleInputStyles"
    ref="circleInput"
    :disabled="disabled"
    :value="value"
    @click.stop
    @input="input($event.target.value)"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { colorEnum } from '@/components';

@Options({
  name: 'CircleInput',
  emits: ['input'],
})
export default class CircleInput extends Vue {
  declare $refs: {
    circleInput: HTMLInputElement;
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

  @Prop({
    required: false,
    default: () => null,
  })
  borderColor!: keyof typeof colorEnum | null;

  @Watch('value') wValue(): void {
    if (this.value === null) {
      this.previous = '';
    }
  }

  previous = '';

  get circleInputStyles(): { borderColor: string | undefined } {
    return { borderColor: this.borderColor ? `var(--${this.borderColor}-color)` : undefined }
  }

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
        this.$refs.circleInput.value = this.previous;
      });
    } else {
      this.previous = validValue;
      this.$emit('input', validValue);
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-input {
  width: 40px;
  height: 40px;
  text-align: center;
  font-weight: 500;
  border-radius: 50%;
  border: 3px dotted transparent;
  outline: none;
  background-color: var(--blue-color);
  transition-duration: 0.1s;
  transition-property: transform;
  transition-timing-function: linear;

  &:focus {
    transform: scale(1.625);
    border: 1px dotted var(--gray-color);
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
  }

  &.disabled,
  &:disabled {
    opacity: 0.7;
  }
}
</style>
