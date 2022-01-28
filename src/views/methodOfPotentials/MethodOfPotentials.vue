<template>
  <section class="method-of-potentials">
    <span class="method-of-potentials__top">
      <h1 class="method-of-potentials__title">Метод потенциалов</h1>
      <a href="#" target="_blank" download class="method-of-potentials__exclamation-mark exclamation-mark">
        <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
      </a>
    </span>

    <div class="container">
      <initial
        v-if="methodOfPotentials?.parameters"
        :is-current-step="!methodOfPotentials?.potentialTables"
        :parameters="methodOfPotentials.parameters"
        @upload="setMethodOfPotentials"
        @apply="initialApply"
        class="method-of-potentials__section"
      />
    </div>

    <template v-if="methodOfPotentials?.potentialTables">
      <potential-table
        v-for="(potentialTable, index) in methodOfPotentials.potentialTables"
        :key="`potential-table_${index}`"
        :potential-table="potentialTable"
        :number-table="index"
        @apply="potentialTablesApply"
        @back="potentialTablesBack"
      />
    </template>
    <div class="container">
      <answer
        v-if="methodOfPotentials?.answer"
        :is-current-step="!methodOfPotentials?.showResult"
        :answer="methodOfPotentials.answer"
        @apply="answerApply"
        @back="answerBack"
        class="method-of-potentials__section"
      />

      <emmm-result-section v-if="methodOfPotentials?.showResult" :errors="methodOfPotentials.countErrors" @back="resultBack" />
    </div>
    <a href="#footer" ref="linkFooter" tabindex="-1" />
    <footer v-if="true" class="method-of-potentials__footer" id="footer">
      <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
      <emmm-button :background="`orange`" @click="fullReset">Очистить</emmm-button>
    </footer>
    <emmm-save-file-modal ref="saveFileModal" />
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  tMethodOfPotentials,
  initialPotentialTable,
  initialMethodOfPotentials,
  initialNextTable,
  initialAnswer,
} from '@/views/methodOfPotentials/component';
import { colorEnum, EmmmButton, EmmmIcon, EmmmSaveFileModal, EmmmResultSection } from '@/components';
import { InjectReactive, Watch } from 'vue-property-decorator';
import Initial from '@/views/methodOfPotentials/initial/Initial.vue';
import PotentialTable from '@/views/methodOfPotentials/potentialTable/PotentialTable.vue';
import Answer from '@/views/methodOfPotentials/answer/Answer.vue';

@Options({
  name: 'MethodOfPotentials',
  components: { EmmmIcon, EmmmButton, EmmmSaveFileModal, Initial, PotentialTable, EmmmResultSection, Answer },
})
export default class MethodOfPotentials extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    linkFooter: { click: () => void };
  };

  methodOfPotentials: tMethodOfPotentials | null = null;

  @Watch('methodOfPotentials', { deep: true }) wMethodOfPotentials(): void {
    const methodOfPotentialsJSON = JSON.stringify(this.methodOfPotentials);
    sessionStorage.setItem('methodOfPotentials', methodOfPotentialsJSON);
  }

  get potentialTablesApply(): () => void {
    return this.methodOfPotentials!.potentialTables!.length > 1 ? this.usuallyPotentialTablesApply : this.initialPotentialTablesApply;
  }

  get potentialTablesBack(): () => void {
    return this.initialPotentialTablesBack;
  }

  initialApply(): void {
    const {
      parameters: { columns, rows },
    } = this.methodOfPotentials!;
    this.methodOfPotentials!.potentialTables! = [initialPotentialTable(rows!, columns!)];
    this.toDown();
  }

  initialPotentialTablesApply(): void {
    let errorMessage = '';
    const potentialTables = this.methodOfPotentials!.potentialTables!,
      potentialTable = potentialTables[potentialTables.length - 1];

    if (potentialTable.step === 1) {
      const totalRow = potentialTable.cells.slice(0, potentialTable.cells.length - 1).reduce((total, row) => row[row.length - 1].value! + total, 0);
      const totalColumn = potentialTable.cells[potentialTable.cells.length - 1]
        .slice(0, potentialTable.cells[potentialTable.cells.length - 1].length - 1)
        .reduce((total, cell) => cell.value! + total, 0);
      if (
        potentialTable.cells[potentialTable.cells.length - 1][potentialTable.cells[potentialTable.cells.length - 1].length - 1].value !== totalRow ||
        potentialTable.cells[potentialTable.cells.length - 1][potentialTable.cells[potentialTable.cells.length - 1].length - 1].value !== totalColumn
      ) {
        potentialTable.cells[potentialTable.cells.length - 1][potentialTable.cells[potentialTable.cells.length - 1].length - 1].value = null;
        potentialTable.cells[potentialTable.cells.length - 1][potentialTable.cells[potentialTable.cells.length - 1].length - 1].borderColor =
          colorEnum.orange;
        errorMessage = 'Начальные условия некорректны!';
      }

      if (!errorMessage) {
        potentialTable.step++;
      }
    } else if (potentialTable.step === 2) {
      potentialTable.cells.forEach(row => {
        const totalRow = row.slice(0, row.length - 1).reduce((total, cell) => total + (cell.value === null ? 0 : cell.value!), 0);
        if (totalRow !== row[row.length - 1].value) {
          errorMessage = 'Таблица заполнена неверно!';
          row.slice(0, row.length - 1).forEach(cell => {
            if (cell.value !== null) {
              if (cell.value !== 0) cell.borderColor = colorEnum.orange;
              cell.value = null;
            }
          });
        }
      });

      if (!errorMessage) {
        const nextTable = initialNextTable(potentialTable, true);
        nextTable.step++;
        this.methodOfPotentials!.potentialTables!.push(nextTable);
        potentialTable.step++;
        this.toDown();
      }
    } else {
      throw new Error('Нет такого шага!');
    }

    if (errorMessage) {
      this.methodOfPotentials!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    }
  }

  usuallyPotentialTablesApply(): void {
    let errorMessage = '';
    const potentialTables = this.methodOfPotentials!.potentialTables!,
      potentialTable = potentialTables[potentialTables.length - 1];
    if (potentialTable.step === 1) {
      const previousTable = potentialTables[potentialTables.length - 2];

      potentialTable.cells.slice(0, potentialTable.cells.length - 1).forEach((row, rowIndex) =>
        row.slice(0, row.length - 1).forEach((cell, columnIndex) => {
          const pathIndex = previousTable.path.findIndex(path => path.row === rowIndex && path.column === columnIndex),
            previousCell = previousTable.cells[rowIndex][columnIndex],
            previousCellValue = previousCell.value === null ? 0 : previousCell.value,
            cellValue = cell.value === null ? 0 : cell.value;
          if (
            cellValue !==
            previousCellValue +
              (pathIndex >= 0
                ? (pathIndex % 2 === 1 ? -1 : 1) * previousTable.cells[previousTable.minCell.row!][previousTable.minCell.column!].value!
                : 0)
          ) {
            cell.value = null;
            cell.borderColor = colorEnum.orange;
            errorMessage = 'Таблица заполнена неверно!';
          }
        }),
      );

      potentialTable.cells
        .slice(0, potentialTable.cells.length - 1)
        .forEach(row => row.slice(0, row.length - 1).forEach(cell => cell.value === 0 && (cell.value = null)));

      if (!errorMessage) {
        potentialTable.step++;
      }
    } else if (potentialTable.step === 2) {
      potentialTable.cells.slice(0, potentialTable.cells.length - 1).forEach((row, rowIndex) =>
        row.slice(0, row.length - 1).forEach((cell, columnIndex) => {
          if (
            cell.value !== null &&
            cell.value !== 0 &&
            potentialTable.cells[rowIndex][potentialTable.cells[rowIndex].length - 1].value! +
              potentialTable.cells[potentialTable.cells.length - 1][columnIndex].value! !==
              cell.right
          ) {
            potentialTable.cells[rowIndex][potentialTable.cells[rowIndex].length - 1].value = null;
            potentialTable.cells[rowIndex][potentialTable.cells[rowIndex].length - 1].borderColor = colorEnum.orange;
            potentialTable.cells[potentialTable.cells.length - 1][columnIndex].value = null;
            potentialTable.cells[potentialTable.cells.length - 1][columnIndex].borderColor = colorEnum.orange;
            errorMessage = 'Таблица заполнена неверно!';
          }
        }),
      );

      if (!errorMessage) {
        potentialTable.step++;
      }
    } else if (potentialTable.step === 3) {
      let isEnd = true;
      const result = potentialTable.cells
        .slice(0, potentialTable.cells.length - 1)
        .every((row, rowIndex) =>
          row
            .slice(0, row.length - 1)
            .every(
              (cell, columnIndex) =>
                potentialTable.cells[rowIndex][potentialTable.cells[rowIndex].length - 1].value! +
                  potentialTable.cells[potentialTable.cells.length - 1][columnIndex].value! ===
                cell.left!.value,
            ),
        );
      if (result) {
        potentialTable.cells.slice(0, potentialTable.cells.length - 1).forEach((row, rowIndex) =>
          row.slice(0, row.length - 1).forEach((cell, columnIndex) => {
            if (cell.left!.value! > cell.right!) {
              isEnd = false;
              cell.left!.borderColor = colorEnum.orange;
            }
          }),
        );
      } else {
        potentialTable.cells.slice(0, potentialTable.cells.length - 1).forEach((row, rowIndex) =>
          row.slice(0, row.length - 1).forEach((cell, columnIndex) => {
            if (
              potentialTable.cells[rowIndex][potentialTable.cells[rowIndex].length - 1].value! +
                potentialTable.cells[potentialTable.cells.length - 1][columnIndex].value! !==
              cell.left!.value
            ) {
              cell.left!.value = null;
              cell.left!.borderColor = colorEnum.orange;
            }
          }),
        );
        errorMessage = 'Ошибка в вычислении псевдостоимости!';
      }
      if (!errorMessage) {
        if (isEnd) {
          potentialTable.step = 6;
          this.methodOfPotentials!.answer = initialAnswer();
          this.toDown();
        } else {
          potentialTable.step++;
        }
      }
    } else if (potentialTable.step === 4) {
      if (
        potentialTable.path.length > 2 &&
        (potentialTable.path[0].row === potentialTable.path[potentialTable.path.length - 1].row ||
          potentialTable.path[0].column === potentialTable.path[potentialTable.path.length - 1].column)
      ) {
        potentialTable.step++;
      } else {
        errorMessage = 'Цикл построен неверно!';
      }
    } else if (potentialTable.step === 5) {
      const minCellUser = potentialTable.cells[potentialTable.minCell.row!][potentialTable.minCell.column!].value!,
        minCell = Math.min(
          ...potentialTable.path.filter((path, index) => index % 2 === 1).map(path => potentialTable.cells[path.row!][path.column!].value!),
        );

      if (minCell === minCellUser) {
        this.methodOfPotentials!.potentialTables!.push(initialNextTable(potentialTable, false));
        potentialTable.step++;
        this.toDown();
      } else {
        potentialTable.minCell.row = null;
        potentialTable.minCell.column = null;
        errorMessage = 'Элемент выбран неверно!';
      }
    } else {
      throw new Error('Нет такого шага!');
    }

    if (errorMessage) {
      this.methodOfPotentials!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    }
  }

  initialPotentialTablesBack(): void {
    const potentialTables = this.methodOfPotentials!.potentialTables!,
      potentialTable = potentialTables[potentialTables.length - 1];
    if (potentialTable.step > 1) {
      if (potentialTable.step === 2) {
        if (this.methodOfPotentials!.potentialTables!.length === 1) {
          potentialTable.cells.slice(0, potentialTable.cells.length - 1).forEach(row =>
            row.slice(0, row.length - 1).forEach(cell => {
              cell.value = null;
              cell.borderColor = null;
            }),
          );
        } else if (this.methodOfPotentials!.potentialTables!.length === 2) {
          this.methodOfPotentials!.potentialTables!.splice(this.methodOfPotentials!.potentialTables!.length - 1, 1);
        } else {
          potentialTable.cells.slice(0, potentialTable.cells.length - 1).forEach(row => {
            row[row.length - 1].value = null;
            row[row.length - 1].borderColor = null;
          });
          potentialTable.cells[potentialTable.cells.length - 1].forEach(cell => {
            cell.value = null;
            cell.borderColor = null;
          });
        }
      } else if (potentialTable.step === 3) {
        potentialTable.cells.slice(0, potentialTable.cells.length - 1).forEach(row =>
          row.slice(0, row.length - 1).forEach(cell => {
            cell.left!.value = null;
            cell.left!.borderColor = null;
          }),
        );
      } else if (potentialTable.step === 4) {
        potentialTable.path = [];
        potentialTable.cells
          .slice(0, potentialTable.cells.length - 1)
          .forEach(row => row.slice(0, row.length - 1).forEach(cell => (cell.left!.borderColor = null)));
      } else if (potentialTable.step === 5) {
        potentialTable.minCell.row = null;
        potentialTable.minCell.column = null;
      } else throw new Error('Такого шага не существует!');

      potentialTables[potentialTables.length - 1].step--;
    } else if (this.methodOfPotentials!.potentialTables!.length === 1) {
      this.methodOfPotentials!.potentialTables = null;
    } else {
      this.methodOfPotentials!.potentialTables!.splice(this.methodOfPotentials!.potentialTables!.length - 1, 1);
      potentialTables[potentialTables.length - 1].step--;
    }
  }

  answerApply(): void {
    let errorMessage = '';
    const potentialTables = this.methodOfPotentials!.potentialTables!,
      potentialTable = potentialTables[potentialTables.length - 1],
      Lmin = potentialTable.cells.reduce(
        (totalRow, row) =>
          totalRow + row.reduce((totalCell, cell) => (cell.value && cell.right ? totalCell + cell.value * cell.left!.value! : totalCell), 0),
        0,
      );

    if (Math.abs(Lmin - this.methodOfPotentials!.answer!.Lmin!) >= 0.001) {
      this.methodOfPotentials!.answer!.Lmin = null;
      errorMessage = 'Ошибка!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.methodOfPotentials!.countErrors++;
    } else {
      this.methodOfPotentials!.showResult = true;
      this.toDown();
    }
  }

  answerBack(): void {
    this.methodOfPotentials!.potentialTables![this.methodOfPotentials!.potentialTables!.length - 1].step = 3;
    this.methodOfPotentials!.answer = null;
  }

  resultBack(): void {
    this.methodOfPotentials!.showResult = false;
  }

  saveFile(): void {
    const methodOfPotentialsJSON = JSON.stringify(this.methodOfPotentials);
    this.$refs.saveFileModal.showModal(methodOfPotentialsJSON);
  }

  fullReset(): void {
    if (sessionStorage.getItem('methodOfPotentials')) sessionStorage.removeItem('methodOfPotentials');
    this.methodOfPotentials = initialMethodOfPotentials();
  }

  setMethodOfPotentials(methodOfPotentials: tMethodOfPotentials): void {
    this.methodOfPotentials = { ...initialMethodOfPotentials(), ...methodOfPotentials };
  }

  toDown(): void {
    this.$refs.linkFooter.click();
  }

  created(): void {
    const methodOfPotentialsJSON = sessionStorage.getItem('methodOfPotentials');
    if (methodOfPotentialsJSON) this.setMethodOfPotentials(JSON.parse(methodOfPotentialsJSON));
    else this.fullReset();
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.method-of-potentials {
  padding: 32px 15px 0;

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
