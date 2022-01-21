<template>
  <div class="connection" ref="conn">
    <div class="connection__column">
      <connection
        v-for="(child, index) in path.childs"
        :key="child.uuid"
        :ref="child.uuid"
        :path="child"
        :parameters="parameters"
        :is-current-step="isCurrentStep"
        @delete="deleteChild(index)"
        :body="body"
      />
    </div>

    <network-table-cell
      :disabled="!isCurrentStep"
      :input-cell="path"
      :can-delete="canDelete"
      :can-add="canAddChild"
      @click="cellClick"
      ref="cell"
      @change="changeReliesOnCell"
      @delete="deleteCell"
      @add="addChild"
      class="connection__parent"
    >
      {{ body }}<sub>{{ path.value }}</sub>
    </network-table-cell>
    <template v-if="arrows.length > 0">
      <creator-line v-for="arrow in arrows" :key="`${arrow.x1}_${arrow.y1}`" :x1="arrow.x1" :y1="arrow.y1" :x2="arrow.x2" :y2="arrow.y2" />
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { InjectReactive, Prop } from 'vue-property-decorator';
import { initialPath, tParameters, tPath } from '@/views/networkPlanning/component';
import NetworkTableCell from '@/views/networkPlanning/networkTableCell/NetworkTableCell.vue';
import CreatorLine from '@/views/networkPlanning/creatorPath/creatorLine/CreatorLine.vue';

@Options({
  name: 'Connection',
  components: { NetworkTableCell, CreatorLine },
  emits: ['delete'],
})
export default class Connection extends Vue {
  declare $refs: {
    [key: string]: Connection & HTMLDivElement;
  };

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  path!: tPath;

  @Prop({
    type: Boolean,
    required: false,
    default: () => true,
  })
  canDelete!: boolean;

  @Prop({
    type: Object,
    required: true,
  })
  parameters!: tParameters;

  @Prop({
    type: String,
    required: false,
    default: () => '',
  })
  body!: string;

  @InjectReactive('isLoading') isLoading!: boolean;
  @InjectReactive('load') load!: () => void;
  @InjectReactive('cancelLoad') cancelLoad!: () => void;
  @InjectReactive('cellClick') cellClick!: () => void;

  get arrows(): { x1: number; x2: number; y1: number; y2: number }[] {
    return !this.isLoading
      ? this.path.childs.map((cell, index) => {
          const previousConn = this.$refs[cell.uuid].$refs.conn,
            previousCell = this.$refs[cell.uuid].$refs.cell.$refs.cell,
            nextColumn = this.$refs.cell.$refs.cell,
            ofset = this.path.childs.length === 3 ? (index - 1) * 20 : this.path.childs.length === 2 ? 20 * (-1 + 2 * index) : 0;
          return {
            x1: previousCell.clientWidth + previousCell.offsetLeft + 20,
            x2: nextColumn.offsetLeft - 20,
            y1: previousCell.clientWidth / 2 + previousCell.offsetTop + previousConn.offsetTop,
            y2: nextColumn.offsetTop + nextColumn.offsetHeight / 2 + ofset,
          };
        })
      : [];
  }

  get canAddChild(): boolean {
    return this.path.childs.length < 3;
  }

  changeReliesOnCell(value: number): void {
    if (this.path!.value === null) {
      this.path!.value = 0;
    } else {
      this.path!.value = null;
    }

    this.$nextTick(() => {
      this.path.value = value <= this.parameters.columns! && value >= 1 ? value : null;
    });
  }

  addChild(): void {
    if (this.path.childs.length < 3) {
      this.load();
      this.path.childs.push(initialPath());
      this.cancelLoad();
    }
  }

  deleteChild(index: number): void {
    this.load();
    this.path.childs.splice(index, 1);
    this.cancelLoad();
  }

  deleteCell(): void {
    this.$emit('delete');
  }
}
</script>

<style lang="scss" scoped>
.connection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 80px;
  position: relative;
  width: 100%;

  &__column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }
}
</style>
