<template>
  <input :type="type" class="emmm-number-input" :placeholder="placeholder" :disabled="disabled" ref="customInput" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

enum typeEnum {
  text = 'text',
  number = 'number',
}

@Options({
  name: 'EmmmInput',
})
export default class EmmmNumberInput extends Vue {
  declare $refs: {
    customInput: HTMLInputElement;
  };

  @Prop({
    type: String,
    required: false,
    default: () => typeEnum.text,
  })
  type!: typeEnum;

  @Prop({
    type: String,
    required: false,
    default: () => '',
  })
  placeholder!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabled!: boolean;

  focus(): void {
    this.$refs.customInput.focus();
  }
}
</script>

<style lang="scss" scoped>
.emmm-number-input {
  padding: 20px 15px;
  width: 100%;
  text-align: center;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: var(--turquoise-color);
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  &::placeholder {
    color: var(--dark-gray-color);
    text-align: center;
  }

  &:focus {
    outline: 2px solid var(--green-color);
  }

  &:disabled {
    background-color: var(--gray-color);
  }
}
</style>
