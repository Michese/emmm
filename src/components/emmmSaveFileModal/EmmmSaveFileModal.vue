<template>
  <emmm-modal :width="600" ref="modal">
    <section class="emmm-save-file-modal">
      <emmm-icon icon="save" :size="92" class="emmm-save-file-modal__icon" />
      <emmm-input
        placeholder="Введите название файла"
        type="text"
        v-model="download"
        @input="$event => (download = $event.target.value)"
        class="emmm-save-file-modal__input"
      />

      <footer class="emmm-save-file-modal__footer">
        <a :href="href" target="_blank" :download="titleFile" ref="link" tabindex="-1" />
        <emmm-button :disabled="!canSaveFile" :background="'blue'" @click="saveFile"> Сохранить </emmm-button>
        <emmm-button :background="'orange'" @click="closeModal">Закрыть</emmm-button>
      </footer>
    </section>
  </emmm-modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmInput, EmmmModal } from '@/components';
import toBase64 from '@/helper/toBase64';
import { InjectReactive } from 'vue-property-decorator';

@Options({
  name: 'EmmmSaveFileModal',
  components: { EmmmModal, EmmmButton, EmmmInput, EmmmIcon },
})
export default class EmmmSaveFileModal extends Vue {
  declare $refs: {
    modal: { showModal: () => void; closeModal: () => void };
    link: { click: () => void };
  };

  download = '';
  href = '';

  get titleFile(): string {
    return `${this.download}.json`;
  }

  get canSaveFile(): boolean {
    return !!this.download;
  }

  async showModal(json: string): Promise<void> {
    this.download = '';
    const file = new File([json], 'objectUrl.json', { type: 'application/json' });
    const base64 = await toBase64(file);

    if (json && file && base64) {
      this.href = base64 as string;
      this.$refs.modal.showModal();
    } else {
      const errorMessage = 'Ошибка при сохранении файла!';
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      else console.error(errorMessage);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.$refs.modal.closeModal();
  }

  saveFile(): void {
    if (this.canSaveFile) {
      this.$refs.link.click();
      this.closeModal();
    }
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.emmm-save-file-modal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;

  &__icon {
    align-self: center;
    text-align: center;
    margin-bottom: 20px;
    fill: var(--dark-blue-color);
  }

  &__input {
    margin-bottom: 20px;
  }

  &__footer {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
  }
}
</style>
