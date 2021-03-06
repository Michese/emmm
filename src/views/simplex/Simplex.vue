<template>
  <div class="container">
    <section class="simplex">
      <span class="simplex__top">
        <h1 class="simplex__title">Симплекс-метод</h1>
        <a
          href="#"
          target="_blank"
          download
          class="simplex__exclamation-mark exclamation-mark"
          ref="mainIcon"
          @keydown.shift.tab.prevent="() => $refs.clearButton.focus()"
        >
          <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
        </a>
      </span>

      <initial
        v-if="simplex?.parameters"
        :is-current-step="!simplex?.simplexTable"
        :parameters="simplex.parameters"
        @upload="uploadFile"
        @apply="initialApply"
        class="simplex__section"
      />
      <template v-if="simplex?.simplexTable">
        <simplex-table
          :is-current-step="simplex?.simplexTable.length - 1 === indexTable && !this.simplex.answer"
          :previous-table="indexTable > 0 && !simplexTable.isInteger ? simplex?.simplexTable[indexTable - 1] : undefined"
          v-for="(simplexTable, indexTable) in simplex.simplexTable"
          :key="`simplex-table_${indexTable}`"
          :simplex-table="simplexTable"
          @apply="simplexTableApply"
          @back="simplexTableBack"
          @continue="simplexTableContinue"
          class="simplex__section"
        />
      </template>
      <answer v-if="simplex?.answer" :answer="simplex.answer" :is-current-step="!simplex.showResult" @apply="answerApply" @back="answerBack" />
      <emmm-result-section v-if="simplex?.showResult" :errors="simplex.countErrors" @back="resultBack" />
      <emmm-save-file-modal ref="saveFileModal" />
    </section>
  </div>
  <a href="#footer" ref="linkFooter" tabindex="-1" />
  <footer class="simplex__footer" id="footer">
    <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
    <emmm-button :background="`orange`" @click="fullReset" @keydown.tab.exact.prevent="() => $refs.mainIcon.focus()" ref="clearButton"
      >Очистить</emmm-button
    >
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { colorEnum, EmmmButton, EmmmIcon, EmmmResultSection, EmmmSaveFileModal } from '@/components';
import Initial from '@/views/simplex/initial/Initial.vue';
import SimplexTable from '@/views/simplex/simplexTable/SimplexTable.vue';
import {
  tSimplex,
  initialSimplex,
  initialSimplexTableWithPrevious,
  initialElement,
  initialSimplexTableRows,
  initialIntegerSimplexTable,
  initialAnswer,
} from '@/views/simplex/component';
import { InjectReactive, Watch } from 'vue-property-decorator';
import { Fraction } from '@/class';
import Answer from '@/views/simplex/answer/Answer.vue';
import { abs, checkHashObject, creatorHashJSON } from '@/helper';

@Options({
  name: 'Simplex',
  components: { EmmmIcon, Initial, SimplexTable, EmmmButton, EmmmSaveFileModal, EmmmResultSection, Answer },
})
export default class Simplex extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    linkFooter: { click: () => void };
    clearButton: HTMLButtonElement;
    mainIcon: HTMLLinkElement;
  };

  simplex: tSimplex | null = null;

  @Watch('simplex', { deep: true }) wSimplex(): void {
    const simplexJSON = JSON.stringify(this.simplex);
    sessionStorage.setItem('simplex', simplexJSON);
  }

  initialApply(): void {
    const {
      parameters: { columns, rows },
    } = this.simplex!;
    this.simplex!.simplexTable! = [initialSimplexTableRows(rows!, columns!)];
    this.toDown();
  }

  simplexTableApply(): void {
    const simplexTables = this.simplex!.simplexTable!,
      simplexTable = simplexTables[simplexTables.length - 1];
    let errorMessage = '';
    if (
      simplexTable.element &&
      simplexTable.cells.slice(2, simplexTable.cells.length).every(row => row[1].value?.top && new Fraction(row[1].value).valueOf() >= 0) &&
      simplexTable.cells[1].slice(2, simplexTable.cells.length).every(cell => cell.value?.top && new Fraction(cell.value).valueOf() <= 0)
    ) {
      this.simplex!.answer = initialAnswer(simplexTable.cells[0].length - 2, simplexTable.cells.length - 2);
      this.toDown();
    } else if (simplexTable.element) {
      if (
        simplexTable.element!.column! < 2 ||
        simplexTable.element!.row! < 2 ||
        (simplexTable.cells.slice(2, simplexTable.cells.length).some(row => row[1].value!.top < 0) &&
          simplexTable.cells
            .slice(2, simplexTable.cells.length)
            .every(row => row[1].value!.top >= 0 || row[simplexTable.element!.column!].value!.top >= 0)) ||
        (simplexTable.cells.slice(2, simplexTable.cells.length).every(row => row[1].value!.top >= 0) &&
          simplexTable.cells[1][simplexTable.element!.column!].value!.top < 0)
      ) {
        errorMessage = 'Разрешающий элемент выбран неверно!';
      } else {
        const valueFraction = new Fraction(simplexTable.cells[simplexTable.element!.row!][1].value!)
            .division(simplexTable.cells[simplexTable.element!.row!][simplexTable.element!.column!].value!)
            .valueOf(),
          fractions = simplexTable.cells
            .slice(2, simplexTable.cells.length)
            .map(row => new Fraction(row[1].value!).division(row[simplexTable.element!.column!].value!))
            .filter(fraction => fraction.valueOf() > 0),
          minFraction = Math.min(...fractions.map(fraction => fraction.valueOf()), valueFraction > 0 ? valueFraction : Infinity);
        if (abs(valueFraction - minFraction) >= 0.001) {
          errorMessage = 'Разрешающий элемент выбран неверно!';
        }
      }

      if (!errorMessage) {
        this.simplex!.simplexTable!.push(initialSimplexTableWithPrevious(simplexTable, simplexTable.element.row!, simplexTable.element.column!));
        this.toDown();
      }
    } else {
      if (simplexTables.length > 1 && !simplexTable.isInteger) {
        const previousTable = simplexTables[simplexTables.length - 2],
          previousElement = previousTable.element!,
          previousCells = previousTable.cells;

        simplexTable.cells.forEach((row, rowIndex) => {
          row.forEach((cell, columnIndex) => {
            if (!cell.value) return;
            let rightFraction: Fraction;

            if (abs(previousElement.column! - columnIndex) <= 0.001 && abs(previousElement.row! - rowIndex) <= 0.001) {
              rightFraction = new Fraction({ top: 1, bottom: 1 }).division(previousCells[rowIndex][columnIndex].value!);
            } else if (abs(previousElement.column! - columnIndex) <= 0.001) {
              rightFraction = new Fraction(previousCells[rowIndex][columnIndex].value!)
                .multiplication({ top: -1, bottom: 1 })
                .division(previousCells[previousElement.row!][previousElement.column!].value!);
            } else if (abs(previousElement.row! - rowIndex) <= 0.001) {
              rightFraction = new Fraction(previousCells[rowIndex][columnIndex].value!).division(
                previousCells[previousElement.row!][previousElement.column!].value!,
              );
            } else {
              const deductibleFraction = new Fraction(previousCells[previousElement.row!][columnIndex].value!)
                .multiplication(previousCells[rowIndex][previousElement.column!].value!)
                .division(previousCells[previousElement.row!][previousElement.column!].value!);
              rightFraction = new Fraction(previousCells[rowIndex][columnIndex].value!).subtraction(deductibleFraction);
            }

            if (abs(rightFraction.valueOf() - new Fraction(cell.value!).valueOf()) >= 0.001) {
              cell.value = null;
              cell.borderColor = colorEnum.orange;
              errorMessage = 'Пересчет выполнен неверно!';
            }
          });
        });
      } else if (simplexTable.isInteger) {
        const previousTable = simplexTables[simplexTables.length - 2];
        previousTable.cells.forEach((row, rowIndex) =>
          row.forEach((cell, columnIndex) => {
            if (cell.constValue !== undefined) return;
            if (
              abs(cell.value!.top - simplexTable.cells[rowIndex][columnIndex].value!.top) >= 0.001 ||
              abs(cell.value!.bottom - simplexTable.cells[rowIndex][columnIndex].value!.bottom) >= 0.001
            ) {
              simplexTable.cells[rowIndex][columnIndex].value!.top = cell.value!.top!;
              simplexTable.cells[rowIndex][columnIndex].value!.bottom = cell.value!.bottom!;
              errorMessage = 'Начальные условия неизменны!';
            }
          }),
        );
        const maxInteger = Math.floor(
            Math.max(...previousTable.cells.slice(2, previousTable.cells.length).map(row => abs(new Fraction(row[1].value!).valueOf()))),
          ),
          lastRow = simplexTable.cells[simplexTable.cells.length - 1],
          rowsWithMaxInteger = previousTable.cells
            .slice(2, previousTable.cells.length)
            .filter(row => abs(Math.floor(abs(new Fraction(row[1].value!).valueOf())) - maxInteger) <= 0.001)
            .filter(
              row =>
                lastRow[1].value!.top < 0 &&
                abs(
                  new Fraction(row[1].value!).addition(lastRow[1].value!).valueOf() -
                    Math.round(new Fraction(row[1].value!).addition(lastRow[1].value!).valueOf()),
                ) <= 0.001,
            );
        if (rowsWithMaxInteger.length === 0) {
          errorMessage = 'Строка выбрана неверно!';
          lastRow.slice(1, lastRow.length).forEach(cell => (cell.value = null));
        } else {
          const indexRow = rowsWithMaxInteger.findIndex(row =>
            row.every((cell, columnIndex) => {
              return (
                columnIndex === 0 ||
                columnIndex === 1 ||
                (lastRow[columnIndex].value!.top <= 0.001 &&
                  abs(
                    new Fraction(row[columnIndex].value!).addition(lastRow[columnIndex].value!).valueOf() -
                      Math.round(new Fraction(row[columnIndex].value!).addition(lastRow[columnIndex].value!).valueOf()),
                  ) <= 0.001)
              );
            }),
          );
          if (abs(indexRow + 1) <= 0.001) {
            rowsWithMaxInteger.forEach(row =>
              row.forEach((cell, columnIndex) => {
                if (columnIndex < 2) return;
                lastRow[columnIndex].value = null;
                errorMessage = 'Расчет выполнен неверно!';
              }),
            );
          }
        }
      }

      if (!errorMessage) {
        let referencePlanFound = true,
          optimalPlanFound = true;
        simplexTable.cells.slice(2, simplexTable.cells.length).forEach(row => {
          if (row[1].value!.top < 0) {
            referencePlanFound = false;
            row[1].borderColor = colorEnum.orange;
          } else {
            row[1].borderColor = null;
          }
        });

        if (referencePlanFound) {
          simplexTable.cells[1].slice(2, simplexTable.cells[1].length).forEach(cell => {
            if (cell.value!.top > 0) {
              optimalPlanFound = false;
              cell.borderColor = colorEnum.orange;
            } else {
              cell.borderColor = null;
            }
          });
        }

        if (
          referencePlanFound &&
          optimalPlanFound &&
          (simplexTable.cells.slice(2, simplexTable.cells.length).every(row => abs(row[1].value!.bottom - 1) <= 0.001) || simplexTable.element)
        ) {
          this.simplex!.answer = initialAnswer(simplexTable.cells[0].length - 2, simplexTable.cells.length - 2);
          this.toDown();
        } else {
          simplexTable.element = initialElement();
        }
      }
    }

    if (errorMessage) {
      this.simplex!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    }
  }

  simplexTableContinue(): void {
    const simplexTables = this.simplex!.simplexTable!,
      simplexTable = simplexTables[simplexTables.length - 1];

    if (
      simplexTable.cells[1].slice(2, simplexTable.cells[1].length).every(cell => cell.value!.top < 0) &&
      simplexTable.cells.slice(2, simplexTable.cells.length).every(row => row[1].value!.top > 0) &&
      simplexTable.element
    ) {
      this.simplex!.simplexTable!.push(initialIntegerSimplexTable(simplexTable));
      this.toDown();
    }
  }

  simplexTableBack(): void {
    const simplexTables = this.simplex!.simplexTable!,
      simplexTable = simplexTables[simplexTables.length - 1];

    if (simplexTable.element) {
      simplexTable.element = null;
      simplexTable.cells.forEach(row => row.forEach(cell => (cell.borderColor = null)));
    } else if (simplexTables.length === 1) {
      this.simplex!.simplexTable = null;
    } else {
      simplexTables.pop();
    }
  }

  answerApply(): void {
    let errorMessage = '';

    const simplexTables = this.simplex!.simplexTable!,
      simplexTable = simplexTables[simplexTables.length - 1],
      { x, y, Lmin } = this.simplex!.answer!;

    if (
      abs(Lmin.value!.top - simplexTable.cells[1][1].value!.top) >= 0.001 ||
      abs(Lmin.value!.bottom - simplexTable.cells[1][1].value!.bottom) >= 0.001
    ) {
      errorMessage = 'Ошибка!';
      Lmin.value = null;
    }

    simplexTable.cells.slice(2, simplexTable.cells.length).forEach((row, rowIndex) => {
      const match = row[0].constValue!.match(/(?<index>\d+)/iu);
      if (match?.groups?.index) {
        const index = +match.groups.index - 1;

        if (new RegExp('x', 'igu').test(row[0].constValue!)) {
          if (
            abs(x[index].value!.top - simplexTable.cells[rowIndex + 2][1].value!.top) >= 0.001 ||
            abs(x[index].value!.bottom - simplexTable.cells[rowIndex + 2][1].value!.bottom) >= 0.001
          ) {
            errorMessage = 'Ошибка!';
            x[index].value = null;
          }
        } else {
          if (
            abs(y[index].value!.top - simplexTable.cells[rowIndex + 2][1].value!.top) >= 0.001 ||
            abs(y[index].value!.bottom - simplexTable.cells[rowIndex + 2][1].value!.bottom) >= 0.001
          ) {
            errorMessage = 'Ошибка!';
            y[index].value = null;
          }
        }
      } else throw new Error('Ошибка!');
    });

    simplexTable.cells[0].slice(2, simplexTable.cells[0].length).forEach((cell, columnIndex) => {
      const match = cell.constValue!.match(/(?<index>\d+)/iu);
      if (match?.groups?.index) {
        const index = +match.groups.index - 1;

        if (new RegExp('x', 'igu').test(cell.constValue!)) {
          if (abs(+x[index].value!.top) >= 0.001 || abs(x[index].value!.bottom - 1) >= 0.001) {
            errorMessage = 'Ошибка!';
            x[index].value = null;
          }
        } else {
          if (abs(+y[index].value!.top) >= 0.001 || abs(y[index].value!.bottom - 1) >= 0.001) {
            errorMessage = 'Ошибка!';
            y[index].value = null;
          }
        }
      } else throw new Error('Ошибка!');
    });

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.simplex!.countErrors++;
    } else {
      this.simplex!.showResult = true;
      this.toDown();
    }
  }

  answerBack(): void {
    this.simplex!.answer = null;
  }

  resultBack(): void {
    this.simplex!.showResult = false;
  }

  fullReset(): void {
    if (sessionStorage.getItem('simplex')) sessionStorage.removeItem('simplex');
    this.simplex = initialSimplex();
  }

  async uploadFile(simplex: tSimplex): Promise<void> {
    let errorMessage = '';
    if (
      !(
        'parameters' in simplex &&
        'simplexTable' in simplex &&
        'answer' in simplex &&
        'countErrors' in simplex &&
        'showResult' in simplex &&
        'nonce' in simplex
      )
    ) {
      errorMessage = 'Неверный формат данных в файле!';
    } else if (!(await checkHashObject(simplex))) {
      errorMessage = 'Внимание! Попытка жульничества!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.simplex = simplex;
    }
  }

  async saveFile(): Promise<void> {
    const simplexJSON = await creatorHashJSON(this.simplex!);
    this.$refs.saveFileModal.showModal(simplexJSON);
  }

  toDown(): void {
    this.$refs.linkFooter.click();
  }

  setSimplex(simplex: tSimplex): void {
    this.simplex = { ...initialSimplex(), ...simplex };
  }

  created(): void {
    const simplexJSON = sessionStorage.getItem('simplex');
    if (simplexJSON) this.setSimplex(JSON.parse(simplexJSON));
    else this.fullReset();
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.simplex {
  padding: 32px 15px 15px;

  &__top {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
  }

  &__title {
    margin-right: 20px;
    font-size: 48px;
    text-align: center;
  }

  &__section {
    margin-bottom: 25px;
  }

  &__footer {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    gap: 30px;
    position: sticky;
    bottom: 0;
    padding: 10px 30px;
    background-color: var(--white-color);
    z-index: 2;
  }
}

.exclamation-mark {
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
