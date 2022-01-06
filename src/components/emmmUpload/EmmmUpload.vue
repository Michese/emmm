<template>
  <section class="emmm-upload">
    <input class="emmm-upload__body" type="file" :accept="accept" @change="uploadFile($event.target)" :id="id" />
    <label :for="id" class="emmm-upload__inner">
      <emmm-icon icon="download" :size="65" class="emmm-upload__icon" />
      <span class="emmm-upload__text">Выберите файл или перетащите его в область</span>
    </label>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmIcon } from '@/components';
import toBase64 from '@/helper/toBase64';

@Options({
  name: 'EmmmUpload',
  components: {
    EmmmIcon,
  },
  emits: ['upload'],
})
export default class EmmmUpload extends Vue {
  get id(): string {
    return `upload_${Math.random()}`;
  }

  get accept(): string {
    return 'application/json';
  }

  fileReader = new FileReader();

  async uploadFile(target: HTMLInputElement): Promise<unknown> {
    const fileList: FileList | null = target.files;
    if (!fileList || !fileList[0]) return;
    const file = fileList[0];

    if (file.type === this.accept) {
      this.fileReader.readAsText(file);
    } else {
      console.error('Недопустимый формат файла!');
    }
    target.value = '';
  }
  created(): void {
    this.fileReader.onload = (e: any): void => {
      try {
        const content = e.target.result,
          intern = JSON.parse(content);
        this.$emit('upload', intern);
      } catch (err) {
        console.error('Недопустимый формат файла!');
      }
    };
  }
}
</script>

<style lang="scss" scoped>
.emmm-upload {
  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--light-green-color);
    border-radius: 10px;
    border: 1px dashed var(--blue-color);
    padding: 75px 30px;
    cursor: pointer;
  }

  &__icon {
    margin-bottom: 40px;
    fill: var(--blue-color);
    text-align: center;
  }

  &__text {
    color: var(--blue-color);
  }
}
</style>
