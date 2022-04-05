<template>
  <button class="emmm-button" :style="buttonStyles" type="button" :disabled="disabled" ref="customButton"><slot></slot></button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { colorEnum } from '@/components';

@Options({
  name: 'EmmmButton',
})
export default class EmmmButton extends Vue {
  declare $refs: {
    customButton: HTMLButtonElement;
  };

  @Prop({
    type: String,
    required: false,
    default: () => colorEnum.lightGreen,
  })
  background!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  disabled!: boolean;

  get buttonStyles(): { backgroundColor: string } {
    return {
      backgroundColor: `var(--${this.background}-color)`,
    };
  }

  focus(): void {
    this.$refs.customButton.focus();
  }
}
</script>

<style lang="scss" scoped>
.emmm-button {
  padding: 15px 40px;
  border-radius: 30px;
  border: none;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  &:hover:not(&:disabled) {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    opacity: 0.9;
  }

  &:active {
    box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  }

  &:disabled {
    cursor: default;
  }

  &:focus {
    outline: 2px solid var(--blue-color);
  }
}
</style>
