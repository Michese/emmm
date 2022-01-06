<template>
  <teleport to="body">
    <div v-if="isShow" class="modal" v-bodyoverflow @click.prevent.stop="closeModal">
      <section class="modal__inner" @click.stop :style="modalStyles">
        <slot></slot>
      </section>
    </div>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Provide } from 'vue-property-decorator';

@Options({
  name: 'EmmmModal',
})
export default class EmmmModal extends Vue {
  isShow = false;
  @Prop({
    type: Number,
    required: false,
    default: () => 500,
  })
  width!: number;

  @Prop({
    type: String,
    required: false,
    default: 'px',
  })
  widthUnitSize!: string;

  @Prop({
    type: Number,
    required: false,
    default: () => 500,
  })
  height!: number;

  @Prop({
    type: String,
    required: false,
    default: 'px',
  })
  heightUnitSize!: string;

  get modalStyles(): {
    'max-height': string;
    'max-width': string;
  } {
    return {
      'max-height': `${this.height}${this.heightUnitSize}`,
      'max-width': `${this.width}${this.widthUnitSize}`,
    };
  }

  @Provide()
  showModal(): void {
    this.isShow = true;
  }

  @Provide()
  closeModal(): void {
    this.isShow = false;
  }
}
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);

  &__inner {
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
  }
}
</style>
