<template>
  <article class="simplex-table">
    <span class="simplex-table__top">
      <span class="simplex-table__title">{{ top.title }}</span>
      <a v-if="top.href" :href="top.href" target="_blank" :download="top.title" class="simplex-table__question question">
        <emmm-icon class="question__icon" icon="question" :size="40" />
      </a>
    </span>

    <div class="simplex-table__body">
      <div class="simplex-table__inner">
        <div v-for="(row, indexRow) in simplexTable.cells" :key="`table-row_${indexRow}`" class="simplex-table__row">
          <simplex-table-cell
            v-for="(cell, indexCell) in row"
            :key="`table-cell_${indexCell}`"
            :simplex-table-cell="cell"
            :disabled="!isCurrentStep || checkContinue"
            :click-event="clickCellEvent"
            @check="checkElement(indexRow, indexCell)"
            :checked="checkChecked(simplexTable.element, indexRow, indexCell)"
            class="simplex-table__cell"
          />
        </div>
      </div>
      <div class="simplex-table__inner previous-table" v-if="previousTable">
        <div v-for="(row, indexRow) in previousTable.cells" :key="`table-row_${indexRow}`" class="simplex-table__row">
          <simplex-table-cell
            v-for="(cell, indexCell) in row"
            :key="`table-cell_${indexCell}`"
            :simplex-table-cell="cell"
            :disabled="true"
            :checked="checkChecked(previousTable.element, indexRow, indexCell)"
            class="simplex-table__cell"
          />
        </div>
      </div>
    </div>
    <footer v-if="isCurrentStep" class="simplex-table__footer">
      <emmm-button v-if="checkContinue" @click="$emit('continue')" class="simplex-table__back-btn">Целочисленное решение</emmm-button>
      <emmm-button @click="$emit('back')" class="simplex-table__back-btn">Назад</emmm-button>
      <emmm-button @click="applyBtnClick" :disabled="!checkApply" class="simplex-table__apply-btn">Далее</emmm-button>
    </footer>
  </article>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { tElement, tSimplexTable } from '@/views/simplex/component';
import SimplexTableCell from '@/views/simplex/simplexTable/simplexTableCell/SimplexTableCell.vue';
import { EmmmButton, EmmmIcon } from '@/components';
import { Fraction } from '@/class';
import {
  findingOptimalPlan,
  findingReferencePlan,
  findingResolvingElement,
  initial
} from "@/views/simplex/simplexTable/downloads";

@Options({
  name: 'SimplexTable',
  components: { SimplexTableCell, EmmmButton, EmmmIcon },
  emits: ['apply', 'back', 'continue'],
})
export default class SimplexTable extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isCurrentStep!: boolean;

  @Prop({
    type: Object,
    required: false,
  })
  previousTable?: tSimplexTable;

  @Prop({
    type: Object,
    required: true,
  })
  simplexTable!: tSimplexTable;

  get checkApply(): boolean {
    return (
      (this.simplexTable.element && this.simplexTable.element.row !== null && this.simplexTable.element.column !== null) ||
      (!this.simplexTable.element && this.simplexTable.cells.every(row => row.every(cell => cell.constValue !== undefined || cell.value !== null))) ||
      this.checkContinue
    );
  }

  get checkContinue(): boolean {
    return !!this.simplexTable.element && this.currentReferencePlanFound && this.currentOptimalPlanFound;
  }

  get top(): { title: string; href?: string } {
    if (this.simplexTable.element && this.isCurrentStep && !this.checkContinue) {
      return { title: 'Нахождение разрешающего элемента', href: findingResolvingElement };
    } else if (!this.previousTable) {
      return { title: 'Начальные условия', href: initial };
    } else if (this.referencePlanFound) {
      return { title: 'Нахождение оптимального плана', href: findingOptimalPlan };
    } else {
      return { title: 'Нахождение опорного плана', href: findingReferencePlan };
    }
  }

  get referencePlanFound(): boolean {
    return (
      !!this.previousTable &&
      this.previousTable.cells.slice(2, this.previousTable.cells.length).every(row => new Fraction(row[1].value!).valueOf() >= 0)
    );
  }

  get currentReferencePlanFound(): boolean {
    return this.simplexTable.cells
      .slice(2, this.simplexTable.cells.length)
      .every(row => row[1].value?.top && new Fraction(row[1].value).valueOf() >= 0);
  }

  get currentOptimalPlanFound(): boolean {
    return this.simplexTable.cells[1]
      .slice(2, this.simplexTable.cells.length)
      .every(cell => cell.value?.top && new Fraction(cell.value).valueOf() <= 0);
  }

  get clickCellEvent(): 'focus' | 'check' {
    return this.simplexTable.element && this.isCurrentStep ? 'check' : 'focus';
  }

  checkElement(row: number, column: number): void {
    this.simplexTable.element!.row = row;
    this.simplexTable.element!.column = column;
  }

  applyBtnClick(): void {
    if (this.checkApply) this.$emit('apply');
  }

  checkChecked(element: tElement, row: number, column: number): boolean {
    return !!element && element.row === row && element.column === column;
  }
}
</script>

<style lang="scss" scoped>
.simplex-table {
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
    justify-content: space-evenly;
    gap: 15px;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 15px;
  }

  &__row {
    display: flex;
    gap: 5px;
  }

  &__cell {
    flex: 1 1 70px;
    min-width: 70px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__back-btn {
    margin-right: 20px;
  }
}

.previous-table {
  display: none;
}

@media screen and (min-width: 1700px) {
  .previous-table {
    display: flex;
  }
}
</style>
