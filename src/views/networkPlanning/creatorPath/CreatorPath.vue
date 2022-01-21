<template>
  <section class="creator-path">
    <div class="container">
      <span class="creator-path__top">
        <span class="creator-path__title">Критический путь в новых обозначениях</span>
        <a href="#" target="_blank" download class="creator-path__question question">
          <emmm-icon class="question__icon" icon="question" :size="40" />
        </a>
      </span>
    </div>

    <div class="creator-path__body">
      <div class="creator-path__inner">
        <button v-if="isCurrentStep" type="button" class="creator-path__plus" @click="addToStart" :disabled="disabledButtons">+</button>
        <connection
          v-for="(child, index) in path"
          :key="child.uuid"
          :is-current-step="isCurrentStep"
          :parameters="parameters"
          :can-delete="canDelete"
          @delete="deleteCell(index)"
          :path="child"
          body="B"
        />
        <button v-if="isCurrentStep" type="button" class="creator-path__plus" @click="addToEnd" :disabled="disabledButtons">+</button>
      </div>
    </div>

    <div class="container">
      <footer v-if="isCurrentStep" class="creator-path__footer">
        <emmm-button @click="backBtnClick" class="creator-path__back-btn">Назад</emmm-button>
        <emmm-button @click="applyBtnClick" :disabled="!checkPath" class="creator-path__apply-btn">Далее</emmm-button>
      </footer>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, ProvideReactive } from 'vue-property-decorator';
import { initialPath, tParameters, tPath } from '@/views/networkPlanning/component';
import { EmmmButton, EmmmIcon } from '@/components';
import NetworkTableCell from '@/views/networkPlanning/networkTableCell/NetworkTableCell.vue';
import CreatorLine from '@/views/networkPlanning/creatorPath/creatorLine/CreatorLine.vue';
import Connection from '@/views/networkPlanning/creatorPath/connection/Connection.vue';

@Options({
  name: 'CreatorPath',
  components: { Connection, EmmmIcon, EmmmButton, NetworkTableCell, CreatorLine },
  emits: ['apply', 'back'],
})
export default class CreatorPath extends Vue {
  @ProvideReactive('isLoading')
  isLoading = true;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Array,
    required: true,
  })
  path!: tPath[];

  @Prop({
    type: Object,
    required: true,
  })
  parameters!: tParameters;

  @ProvideReactive('load') load(): void {
    this.isLoading = true;
  }

  @ProvideReactive('cancelLoad') cancelLoad(): void {
    this.$nextTick(() => {
      this.isLoading = false;
    });
  }

  @ProvideReactive('cellClick') cellClick(): void {
    this.allPath.forEach(cell => (cell.borderColor = null));
  }

  get checkPath(): boolean {
    return !this.isLoading && this.allPath.some(cell => cell.value !== null);
  }

  get disabledButtons(): boolean {
    return this.path.length >= 3;
  }

  get canDelete(): boolean {
    return this.path.length > 1;
  }

  get allPath(): tPath[] {
    return [...this.allChilds(this.path)];
  }

  *allChilds(childs: tPath[]): Generator<tPath> {
    for (const child of childs) {
      yield child;
      yield* this.allChilds(child.childs);
    }
  }

  addToEnd(): void {
    this.load();
    this.path.push(initialPath());
    this.cancelLoad();
  }

  addToStart(): void {
    this.load();
    this.path.unshift(initialPath());
    this.cancelLoad();
  }

  deleteCell(index: number): void {
    this.load();
    this.path.splice(index, 1);
    this.cancelLoad();
  }

  applyBtnClick(): void {
    if (this.checkPath) {
      this.load();
      const indexes = this.path.map((path, index) => (path.value === null ? index : null)).filter(path => path !== null);
      indexes.forEach((index, indexArray) => this.path.splice(index! - indexArray, 1));

      for (const path of this.allPath) {
        path.childs = path.childs.filter(child => child.value !== null);
      }
      this.$emit('apply');

      if (this.path.length === 0) this.path.push(initialPath());
      this.cancelLoad();
    }
  }

  backBtnClick(): void {
    this.$emit('back');
  }

  mounted(): void {
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.creator-path {
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__body {
    --width-cell: 60px;
    --height-cell: 60px;

    display: flex;
    justify-content: flex-start;
    padding: 15px;
    max-width: 1200px;
    margin: 0 auto 25px;
    overflow-x: auto;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
    position: relative;
  }

  &__plus {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--width-cell);
    width: var(--width-cell);
    background-color: var(--light-green-color);
    font-weight: 500;
    box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
    border: none;
    outline: none;
    border-radius: 50%;
    cursor: pointer;

    &:hover,
    &:focus {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    }

    &:active {
      box-shadow: inset 2px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__back-btn {
    margin-right: 20px;
  }
}

.question {
  display: flex;
  align-items: center;

  &__icon {
    fill: var(--dark-blue-color);
    transition: transform linear 0.05s;

    &:hover {
      transform: scale3d(1.2, 1.2, 1.2);
    }
  }
}
</style>
