<template>
  <span class="emmm-radio">
    <label :for="id" class="emmm-radio__label" @focus.prevent="() => $refs.input.focus()">
      <input type="radio" :name="name" :id="id" :value="value" v-model="curValue" :disabled="disabled" class="emmm-radio__body" ref="input" />
      <span class="emmm-radio__circle" />
      {{ label }}
    </label>
  </span>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
  name: 'EmmmRadio',
  emits: ['change'],
})
export default class EmmmRadio extends Vue {
  declare $refs: {
    input: HTMLInputElement;
  };

  @Prop({
    type: String,
    required: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
  })
  id!: string;

  @Prop({
    type: String,
    required: false,
    default: () => '',
  })
  label!: string;

  @Prop({
    type: String,
    required: true,
  })
  value!: string;

  @Prop({
    type: String,
    required: true,
  })
  currentValue!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabled!: boolean;

  @Watch('currentValue') wCurrentValue(): void {
    this.curValue = this.currentValue;
  }

  curValue = this.currentValue;
}
</script>

<style lang="scss" scoped>
.emmm-radio {
  display: flex;
  align-items: center;

  &__circle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.5em;
    height: 0.6em;
    width: 0.6em;
    outline: 5px solid var(--light-green-color);
    border: 2px solid var(--white-color);
    border-radius: 50%;
  }

  &__body {
    width: 0;
    height: 0;
  }

  &__label:hover > &__circle {
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
  }

  &__body:focus-visible + &__circle {
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
  }

  &__body:checked + &__circle {
    background-color: var(--blue-color);
  }

  &__body:disabled + &__circle {
    outline: 5px solid var(--gray-color);
    box-shadow: none;
  }

  &__label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
