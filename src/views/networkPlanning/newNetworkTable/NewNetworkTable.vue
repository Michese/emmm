<template>
  <section class="new-network-table">
    <div class="container">
      <span class="new-network-table__top">
        <span class="new-network-table__title">Введение новых обозначений</span>
        <a href="#" target="_blank" download class="new-network-table__question question">
          <emmm-icon class="question__icon" icon="question" :size="40" />
        </a>
      </span>
    </div>

    <div class="new-network-table__body">
      <div class="new-network-table__inner">
        <div class="new-network-table__column">
          <network-table-cell :is-first-column="true" :disabled="true"> Работы </network-table-cell>
          <network-table-cell :styles="relyOnStyles" :is-first-column="true" :disabled="true">Опирается<br />на<br />работы</network-table-cell>
          <network-table-cell :is-first-column="true" :disabled="true"> Время </network-table-cell>
          <network-table-cell :is-first-column="true" :disabled="true"> Общее время </network-table-cell>
        </div>

        <div v-for="(newWork, indexColumn) in newWorks" :key="`work_${indexColumn}`" class="new-network-table__column">
          <network-table-cell :disabled="true">
            B<sub>{{ indexColumn + 1 }}</sub>
          </network-table-cell>
          <network-table-cell v-for="(relyOn, indexCell) in newWork.reliesOn" :key="`cell_${indexCell}`" :disabled="true" :input-cell="relyOn">
            B<sub>{{ relyOn.value }}</sub>
          </network-table-cell>
          <network-table-cell :disabled="true" :input-cell="newWork.time">
            {{ newWork.time.value }}
          </network-table-cell>
          <network-table-cell
            :disabled="!isCurrentStep"
            :input-cell="newWork.totalTime"
            @change="changeTotalTime(indexColumn, $event)"
            @click="isCurrentStep && clickTotalTimeCell()"
            :min="1"
          >
            {{ newWork?.totalTime?.value }}
          </network-table-cell>
        </div>
      </div>
    </div>

    <div class="container">
      <footer v-if="isCurrentStep" class="new-network-table__footer">
        <emmm-button @click="backBtnClick" class="new-network-table__back-btn">Назад</emmm-button>
        <emmm-button @click="applyBtnClick" :disabled="!checkNewNetworkTable" class="new-network-table__apply-btn">Далее</emmm-button>
      </footer>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmIcon, EmmmButton } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tNewWork, tOldWork } from '@/views/networkPlanning/component';
import NetworkTableCell from '@/views/networkPlanning/networkTableCell/NetworkTableCell.vue';

@Options({
  name: 'NewNetworkTable',
  components: { EmmmIcon, EmmmButton, NetworkTableCell },
  emits: ['apply', 'back'],
})
export default class NewNetworkTable extends Vue {
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
  newWorks!: tNewWork[];

  @Prop({
    type: Array,
    required: true,
  })
  oldWorks!: tOldWork[];

  get checkNewNetworkTable(): boolean {
    return this.isCurrentStep && this.newWorks.every(work => work.totalTime.value !== null);
  }

  get relyOnStyles(): { height: string } {
    return { height: `calc(var(--gap) * ${this.newWorks[0].reliesOn.length - 1} + var(--height-cell) * ${this.newWorks[0].reliesOn.length})` };
  }

  clickTotalTimeCell(): void {
    this.newWorks.forEach(work => (work.totalTime!.borderColor = null));
  }

  changeTotalTime(indexColumn: number, value: number): void {
    if (this.newWorks[indexColumn].totalTime!.value === null) {
      this.newWorks[indexColumn].totalTime!.value = 0;
    } else {
      this.newWorks[indexColumn].totalTime!.value = null;
    }

    this.$nextTick(() => {
      this.newWorks[indexColumn].totalTime!.value = value >= 1 ? value : null;
    });
  }

  applyBtnClick(): void {
    if (this.checkNewNetworkTable) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.new-network-table {
  --width-cell: 60px;
  --height-cell: 60px;
  --gap: 5px;

  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 20px;
  }

  &__body {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  &__inner {
    display: flex;
    align-items: stretch;
    gap: 5px;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 5px;
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
