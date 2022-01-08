<template>
  <section class="emmm-upload">
    <input class="emmm-upload__body" type="file" :accept="accept" @change="uploadFile($event.target)" :id="id" />
    <label
      :for="id"
      class="emmm-upload__inner"
      :class="uploadClasses"
      @dragover.prevent
      @drop.prevent="dropFile"
      @dragenter="onDragEnter"
      @dragleave.self="onDragLeave"
    >
      <emmm-icon icon="download" :size="65" class="emmm-upload__icon" />
      <span class="emmm-upload__text">Выберите файл или перетащите его в область</span>
    </label>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmIcon } from '@/components';
import { InjectReactive } from 'vue-property-decorator';

@Options({
  name: 'EmmmUpload',
  components: {
    EmmmIcon,
  },
  emits: ['upload'],
})
export default class EmmmUpload extends Vue {
  isDrag = false;

  get id(): string {
    return `upload_${Math.random()}`;
  }

  get accept(): string {
    return 'application/json';
  }

  get uploadClasses(): { drag: boolean } {
    return { drag: this.isDrag };
  }

  async uploadFile(target: HTMLInputElement): Promise<void> {
    const fileList: FileList | null = target.files;
    if (!fileList || !fileList[0]) return;

    target.value = '';
  }

  async loadFile(files: FileList): Promise<void> {
    try {
      const file = files[0];
      if (file.type === this.accept) {
        const json = await file.text();
        this.$emit('upload', JSON.parse(json));
      } else throw new Error('Недопустимый формат файла!');
    } catch (e) {
      const errorMessage = 'Недопустимый формат файла!';
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      else console.error('Недопустимый формат файла!');
    }
  }

  dropFile(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer || !event.dataTransfer.files.length) return;

    this.loadFile(event.dataTransfer.files);
    this.onDragLeave();
  }

  onDragEnter(): void {
    this.isDrag = true;
  }

  onDragLeave(): void {
    this.isDrag = false;
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.emmm-upload {
  position: relative;

  &__body {
    display: none;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--light-green-color);
    border-radius: 10px;
    border: 1px dashed var(--blue-color);
    padding: 45px 30px;
    cursor: pointer;
    color: var(--blue-color);
    transition: background-color 0.1s linear;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }

    &.drag {
      background-color: var(--blue-color);
      color: var(--light-green-color);
      box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
    }
  }

  &__icon {
    margin-bottom: 40px;
    fill: currentColor;
    text-align: center;
    transition: fill 0.1s linear;
  }

  &__text {
    color: currentColor;
    transition: color 0.1s linear;
  }
}
</style>
