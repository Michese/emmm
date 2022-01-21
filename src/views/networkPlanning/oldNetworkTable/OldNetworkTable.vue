<template>
  <section class="old-network-table">
    <div class="container">
      <span class="old-network-table__top">
        <span class="old-network-table__title">Исходная таблица</span>
        <a href="#" target="_blank" download class="old-network-table__question question">
          <emmm-icon class="question__icon" icon="question" :size="40" />
        </a>
      </span>
    </div>

    <div class="old-network-table__body">
      <div class="old-network-table__inner">
        <div class="old-network-table__column">
          <network-table-cell :is-first-column="true" :disabled="true"> Работы </network-table-cell>
          <network-table-cell :styles="relyOnStyles" :is-first-column="true" :disabled="true">Опирается<br />на<br />работы</network-table-cell>
          <network-table-cell :is-first-column="true" :disabled="true"> Время </network-table-cell>
          <network-table-cell :is-first-column="true" :disabled="true"> Новые<br />обозначения </network-table-cell>
        </div>

        <div v-for="(oldWork, indexColumn) in oldWorks" :key="`work_${indexColumn}`" class="old-network-table__column">
          <network-table-cell :disabled="true">
            A<sub>{{ indexColumn + 1 }}</sub>
          </network-table-cell>
          <network-table-cell
            v-for="(relyOn, indexCell) in oldWork.reliesOn"
            :key="`cell_${indexCell}`"
            :disabled="!isInitial"
            :input-cell="relyOn"
            @click="clickReliesOnCell"
            @change="isInitial && changeReliesOnCell(indexColumn, indexCell, $event)"
            :min="1"
            :max="oldWorks.length"
          >
            A<sub>{{ relyOn.value }}</sub>
          </network-table-cell>
          <network-table-cell
            :disabled="!isInitial"
            :input-cell="oldWork.time"
            :min="1"
            :max="99"
            @click="isInitial && clickTimeCell"
            @change="changeTime(indexColumn, $event)"
          >
            {{ oldWork.time?.value ?? '' }}
          </network-table-cell>
          <network-table-cell
            :disabled="!isEnteringNewDesignations || !checkDesignationCellArray[indexColumn]"
            @click="isEnteringNewDesignations && checkDesignationCellArray[indexColumn] && clickDesignationCell(indexColumn)"
            :min="1"
            :max="oldWorks.length"
          >
            <span v-if="oldWork.designation?.value">
              B<sub>{{ oldWork.designation.value }}</sub>
            </span>
          </network-table-cell>
        </div>
      </div>
    </div>

    <div class="container">
      <footer v-if="isCurrentStep" class="old-network-table__footer">
        <emmm-button @click="backBtnClick" class="old-network-table__back-btn">Назад</emmm-button>
        <emmm-button @click="applyBtnClick" :disabled="!checkOldNetworkTable" class="old-network-table__apply-btn">Далее</emmm-button>
      </footer>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon } from '@/components';
import { Prop } from 'vue-property-decorator';
import { tNewWork, tOldWork } from '@/views/networkPlanning/component';
import NetworkTableCell from '@/views/networkPlanning/networkTableCell/NetworkTableCell.vue';

@Options({
  name: 'OldNetworkTable',
  components: { NetworkTableCell, EmmmIcon, EmmmButton },
  emits: ['apply', 'back'],
})
export default class OldNetworkTable extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Array,
    required: false,
  })
  newWorks!: tNewWork[] | null;

  @Prop({
    type: Array,
    required: true,
  })
  oldWorks!: tOldWork[];

  get relyOnStyles(): { height: string } {
    return { height: `calc(var(--gap) * ${this.oldWorks[0].reliesOn.length - 1} + var(--height-cell) * ${this.oldWorks[0].reliesOn.length})` };
  }

  get checkOldNetworkTable(): boolean {
    return (
      (this.isInitial && this.oldWorks.every(work => work.time.value !== null)) ||
      (this.isEnteringNewDesignations && this.oldWorks.every(work => work.designation!.value !== null))
    );
  }

  get isInitial(): boolean {
    return this.isCurrentStep && this.oldWorks.every(work => work.designation === null);
  }

  get isEnteringNewDesignations(): boolean {
    return this.isCurrentStep && this.oldWorks.every(work => work.designation);
  }

  get currentNewDesignations(): number {
    return this.oldWorks.map(work => (work.designation ? work.designation.value : null)).filter(designation => designation !== null).length + 1;
  }

  get checkDesignationCellArray(): boolean[] {
    return this.oldWorks.map((work, index) => this.checkDesignationCell(index));
  }

  clickReliesOnCell(): void {
    this.oldWorks.forEach(work => work.reliesOn.forEach(relyOn => (relyOn.borderColor = null)));
  }

  clickTimeCell(): void {
    this.oldWorks.forEach(work => (work.time.borderColor = null));
  }

  checkDesignationCell(indexColumn: number): boolean {
    return this.oldWorks[indexColumn].reliesOn.every(
      relyOn =>
        relyOn.value === null || (this.oldWorks[relyOn.value! - 1].designation!.value !== null && this.checkDesignationCell(relyOn.value! - 1)),
    );
  }

  clickDesignationCell(index: number): void {
    if (this.oldWorks[index].designation!.value === null) {
      this.oldWorks[index].designation!.value = this.currentNewDesignations;
    } else {
      const currentNewDesignations = this.oldWorks[index].designation!.value!;
      this.oldWorks.forEach(work => {
        if (work.designation!.value && work.designation!.value >= currentNewDesignations) {
          work.designation!.value = null;
        }
      });
    }
  }

  changeReliesOnCell(indexColumn: number, indexCell: number, value: number): void {
    if (this.oldWorks[indexColumn].reliesOn[indexCell].value === null) {
      this.oldWorks[indexColumn].reliesOn[indexCell].value = 0;
    } else {
      this.oldWorks[indexColumn].reliesOn[indexCell].value = null;
    }

    this.$nextTick(() => {
      this.oldWorks[indexColumn].reliesOn[indexCell].value = value <= this.oldWorks.length && value >= 1 ? value : null;
    });
  }

  changeTime(indexColumn: number, value: number): void {
    if (this.oldWorks[indexColumn].time.value === null) {
      this.oldWorks[indexColumn].time.value = 0;
    } else {
      this.oldWorks[indexColumn].time.value = null;
    }

    this.$nextTick(() => {
      this.oldWorks[indexColumn].time.value = value <= 99 && value >= 1 ? value : null;
    });
  }

  changeDesignations(indexColumn: number, value: number): void {
    if (this.oldWorks[indexColumn].designation!.value === null) {
      this.oldWorks[indexColumn].designation!.value = 0;
    } else {
      this.oldWorks[indexColumn].designation!.value = null;
    }

    this.$nextTick(() => {
      this.oldWorks[indexColumn].designation!.value = value <= this.oldWorks.length && value >= 1 ? value : null;
    });
  }

  applyBtnClick(): void {
    if (this.checkOldNetworkTable) this.$emit('apply');
  }

  backBtnClick(): void {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.old-network-table {
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
