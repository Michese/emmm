<template>
  <emmm-modal :width="600" ref="modal">
    <section class="emmm-error-modal">
      <emmm-icon class="emmm-error-modal__icon" icon="cross" :size="92" />
      <span class="emmm-error-modal__message">{{ message }}</span>
      <span class="emmm-error-modal__message">Попробуйте еще раз!</span>

      <emmm-button :background="'orange'" @click="closeModal" @keydown.tab.prevent @keydown.shift.tab.prevent ref="closeButton">Закрыть</emmm-button>
    </section>
  </emmm-modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmModal } from '@/components';

@Options({
  name: 'EmmmErrorModal',
  components: { EmmmModal, EmmmIcon, EmmmButton },
})
export default class EmmmErrorModal extends Vue {
  declare $refs: {
    modal: { showModal: () => void; closeModal: () => void };
    closeButton: HTMLButtonElement;
  };

  message = '';

  async showModal(message: string): Promise<void> {
    this.message = message;
    await this.$refs.modal.showModal();
    this.$refs.closeButton.focus();
  }

  closeModal(): void {
    this.$refs.modal.closeModal();
  }
}
</script>

<style lang="scss" scoped>
.emmm-error-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;

  &__icon {
    margin-bottom: 30px;
  }

  &__message {
    display: inline-block;
    font-size: 23px;
    text-align: center;

    &:not(:last-child) {
      margin-bottom: 20px;
    }
    &:last-child {
      margin-bottom: 25px;
    }
  }
}
</style>
