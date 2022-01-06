<template>
  <input :type="type" class="emmm-number-input" :placeholder="placeholder" :disabled="disabled" />
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
}
</script>

<style lang="scss" scoped>
.emmm-number-input {
  padding: 20px 15px;
  width: 100%;
  text-align: center;
  border: 1px solid var(--black-color);
  border-radius: 10px;
  background-color: var(--gray-color);
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  &::placeholder {
    color: var(--dark-gray-color);
    text-align: center;
  }

  &:focus {
    border: 1px solid var(--blue-color);
    outline: 2px solid var(--blue-color);
  }
}
</style>
