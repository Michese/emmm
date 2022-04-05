<template>
  <article class="potential-table">
    <div class="container">
      <span class="potential-table__top">
        <span class="potential-table__title">{{ top.title }}</span>
        <a v-if="top.href" :href="top.href" target="_blank" download class="potential-table__question question">
          <emmm-icon class="question__icon" icon="question" :size="40" />
        </a>
      </span>
    </div>

    <div class="potential-table__body">
      <div class="potential-table__inner">
        <div class="potential-table__row">
          <span
            v-for="(columnTitle, indexRow) in columnTitles"
            :key="`potential-table__column-${indexRow}`"
            class="potential-table__column"
            v-html="columnTitle"
          />
        </div>
        <div v-for="(cells, indexRow) in potentialTable.cells" :key="`potential-table__row-${indexRow}`" class="potential-table__row">
          <span :key="`potential-table__row-title_${indexRow}`" class="potential-table__row-title" v-html="rowTitles[indexRow]" />
          <potential-table-cell
            v-for="(cell, indexColumn) in cells"
            :key="`potential-table__cell-${indexColumn}`"
            :ref="`cell_${indexRow}_${indexColumn}`"
            @click="
              clickCell() ||
                (checkPathEnabled(indexRow, indexColumn) && addToPath(indexRow, indexColumn)) ||
                (checkMinCell(indexRow, indexColumn) && clickMinCell(indexRow, indexColumn))
            "
            :is-min-cell="potentialTable.minCell.row === indexRow && potentialTable.minCell.column === indexColumn"
            :disabled-left-input="!(!isInitialize && potentialTable.step === 3)"
            :disabled-right-input="!(isInitialize && potentialTable.step === 1)"
            :disabled-input="
              !(
                (isInitialize && potentialTable.step === 1 && (indexRow === potentialTable.cells.length - 1 || indexColumn === cells.length - 1)) ||
                (isInitialize && potentialTable.step === 2 && indexRow !== potentialTable.cells.length - 1 && indexColumn !== cells.length - 1) ||
                (!isInitialize && potentialTable.step === 1 && indexRow !== potentialTable.cells.length - 1 && indexColumn !== cells.length - 1) ||
                (!isInitialize &&
                  potentialTable.step === 2 &&
                  (indexRow === potentialTable.cells.length - 1 || indexColumn === cells.length - 1) &&
                  !(indexRow === potentialTable.cells.length - 1 && indexColumn === cells.length - 1))
              )
            "
            :disabled-cell="
              !(
                (isInitialize && potentialTable.step === 1 && (indexRow === potentialTable.cells.length - 1 || indexColumn === cells.length - 1)) ||
                (isInitialize && potentialTable.step === 2 && indexRow !== potentialTable.cells.length - 1 && indexColumn !== cells.length - 1) ||
                (!isInitialize && potentialTable.step === 1 && indexRow !== potentialTable.cells.length - 1 && indexColumn !== cells.length - 1) ||
                (!isInitialize &&
                  potentialTable.step === 2 &&
                  (indexRow === potentialTable.cells.length - 1 || indexColumn === cells.length - 1) &&
                  !(indexRow === potentialTable.cells.length - 1 && indexColumn === cells.length - 1)) ||
                checkPathEnabled(indexRow, indexColumn) ||
                checkMinCell(indexRow, indexColumn)
              )
            "
            :potential-table-cell="cell"
          />
        </div>
        <creator-path v-if="pathElements.length > 0" :path-elements="pathElements" />
      </div>
    </div>

    <div class="container">
      <footer v-if="isCurrentStep" class="potential-table__footer">
        <emmm-button @click="backBtnClick" class="potential-table__back-btn">Назад</emmm-button>
        <emmm-button @click="applyBtnClick" :disabled="!checkPotentialTable" class="potential-table__apply-btn">Далее</emmm-button>
      </footer>
    </div>
  </article>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { tPotentialTable } from '@/views/methodOfPotentials/component';
import PotentialTableCell from '@/views/methodOfPotentials/potentialTable/potentialTableCell/PotentialTableCell.vue';
import { EmmmButton, EmmmIcon } from '@/components';
import { generatorColumnTitles, generatorRowTitles } from '@/views/simplex/simplexTable/functions';
import CreatorPath from '@/views/methodOfPotentials/potentialTable/creatorPath/CreatorPath.vue';

@Options({
  name: 'PotentialTable',
  components: { PotentialTableCell, EmmmIcon, EmmmButton, CreatorPath },
  emits: ['apply', 'back'],
})
export default class PotentialTable extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  potentialTable!: tPotentialTable;

  @Prop({
    type: Number,
    required: true,
  })
  numberTable!: number;

  isLoading = true;

  get isCurrentStep(): boolean {
    return (this.isInitialize && this.potentialTable.step < 3) || (!this.isInitialize && this.potentialTable.step < 6);
  }

  get top(): { title: string; href: string } {
    return this.isInitialize ? { title: 'Исходная таблица', href: '#' } : { title: 'Шаг', href: '#' };
  }

  get columnTitles(): string[] {
    return [...generatorColumnTitles(this.potentialTable.cells[0].length, this.isInitialize)];
  }

  get rowTitles(): string[] {
    return [...generatorRowTitles(this.potentialTable.cells.length, this.isInitialize)];
  }

  get checkPotentialTableInitialize(): boolean {
    return (
      this.isInitialize &&
      ((this.potentialTable.step === 1 &&
        this.potentialTable.cells
          .slice(0, this.potentialTable.cells.length - 1)
          .every(row => row[row.length - 1].value !== null && row.slice(0, row.length - 1).every(cell => cell.right !== null)) &&
        this.potentialTable.cells[this.potentialTable.cells.length - 1].every(cell => cell.value !== null)) ||
        this.potentialTable.step === 2)
    );
  }

  get checkPotentialTable(): boolean {
    return (
      this.checkPotentialTableInitialize ||
      (!this.isInitialize &&
        (this.potentialTable.step === 1 ||
          (this.potentialTable.step === 2 &&
            this.potentialTable.cells.slice(0, this.potentialTable.cells.length - 1).every(row => row[row.length - 1].value !== null) &&
            this.potentialTable.cells[this.potentialTable.cells.length - 1]
              .slice(0, this.potentialTable.cells[this.potentialTable.cells.length - 1].length - 1)
              .every(cell => cell.value !== null)) ||
          (this.potentialTable.step === 3 &&
            this.potentialTable.cells
              .slice(0, this.potentialTable.cells.length - 1)
              .every(row => row.slice(0, row.length - 1).every(cell => cell.left!.value !== null))) ||
          (this.potentialTable.step === 4 &&
            this.potentialTable.path.length > 3 &&
            (this.potentialTable.path[this.potentialTable.path.length - 1].row === this.potentialTable.path[0].row ||
              this.potentialTable.path[this.potentialTable.path.length - 1].column === this.potentialTable.path[0].column)) ||
          (this.potentialTable.step === 5 && this.potentialTable.minCell.row !== null && this.potentialTable.minCell.column !== null)))
    );
  }

  clickCell(): false {
    this.potentialTable.cells.forEach(row => row.forEach(cell => (cell.borderColor = null)));
    return false;
  }

  checkMinCell(row: number, column: number): boolean {
    return (
      !this.isInitialize &&
      this.potentialTable.step === 5 &&
      this.potentialTable.path.some((path, index) => path.row === row && path.column === column && index % 2 === 1)
    );
  }

  clickMinCell(row: number, column: number): void {
    this.potentialTable.minCell.row = row;
    this.potentialTable.minCell.column = column;
  }

  get isInitialize(): boolean {
    return this.numberTable === 0;
  }

  get pathElements(): HTMLDivElement[] {
    return !this.isLoading
      ? this.potentialTable.path.map(
          ({ row, column }) => (this.$refs[`cell_${row}_${column}`] as Vue & { $refs: { cell: HTMLDivElement } }).$refs.cell,
        )
      : [];
  }

  addToPath(row: number, column: number): void {
    const index = this.potentialTable.path.findIndex(path => path.row === row && path.column === column);
    if (index === -1) {
      this.potentialTable.path.push({ row, column });
    } else {
      this.potentialTable.path.splice(index, this.potentialTable.path.length - index);
    }
  }

  checkPathEnabled(row: number, column: number): boolean {
    return (
      !this.isInitialize &&
      this.potentialTable.step === 4 &&
      !!this.potentialTable.cells[row][column].right &&
      ((this.potentialTable.path.length === 0 &&
        this.potentialTable.cells[row][column].left!.value! > this.potentialTable.cells[row][column].right!) ||
        (this.potentialTable.path.length > 0 &&
          (this.potentialTable.path.some(path => path.row === row && path.column === column) ||
            (!!this.potentialTable.cells[row][column].value &&
              (this.potentialTable.path.reduce((total, path) => (path.row === row ? total + 1 : total), 0) === 1 ||
                this.potentialTable.path.reduce((total, path) => (path.column === column ? total + 1 : total), 0) === 1) &&
              (this.potentialTable.path[this.potentialTable.path.length - 1].row === row ||
                this.potentialTable.path[this.potentialTable.path.length - 1].column === column)))))
    );
  }

  applyBtnClick(): void {
    if (this.checkPotentialTable) this.apply();
  }

  backBtnClick(): void {
    this.back();
  }

  @Emit('apply') apply(): void {
    return;
  }

  @Emit('back') back(): void {
    return;
  }

  mounted(): void {
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.potential-table {
  --width-cell: 110px;
  --height-cell: 110px;
  --min-width-cell: 80px;

  margin-bottom: 20px;

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
    margin-bottom: 20px;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    position: relative;
  }

  &__column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--width-cell);
    padding: 25px;

    &:first-child {
      width: var(--min-width-cell);
    }
  }

  &__row {
    display: flex;
    align-items: stretch;
    gap: 5px;

    &-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--height-cell);
      width: var(--min-width-cell);
      padding: 25px;
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
</style>
