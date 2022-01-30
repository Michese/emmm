<template>
  <section class="investment-of-funds">
    <span class="investment-of-funds__top">
      <h1 class="investment-of-funds__title">Вложение средств</h1>
      <a href="#" target="_blank" download class="investment-of-funds__exclamation-mark exclamation-mark">
        <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
      </a>
    </span>

    <div class="container">
      <initial
        v-if="investmentOfFunds"
        :conditions="investmentOfFunds.conditions"
        :is-current-step="!investmentOfFunds.firstCase"
        @upload="setInvestmentOfFunds"
        @apply="initialApply"
      />

      <first-case
        v-if="investmentOfFunds?.firstCase"
        :first-case="investmentOfFunds.firstCase"
        :is-current-step="!investmentOfFunds.secondCase && !investmentOfFunds.Lmin"
        @apply="firstCaseApply"
        @back="firstCaseBack"
      />

      <second-case
        v-if="investmentOfFunds?.secondCase"
        :second-case="investmentOfFunds.secondCase"
        :is-current-step="!investmentOfFunds.Lmin && !investmentOfFunds.showResult"
        @apply="secondCaseApply"
        @back="secondCaseBack"
      />

      <l-min
        v-if="investmentOfFunds?.Lmin"
        :is-current-step="!investmentOfFunds.simplexTables"
        :coefficients="investmentOfFunds.conditions.coefficients"
        :l-min="investmentOfFunds.Lmin"
        @apply="lMinApply"
        @back="lMinBack"
      />

      <template v-if="investmentOfFunds?.simplexTables">
        <simplex-table
          v-for="(simplexTable, index) in investmentOfFunds.simplexTables"
          :key="`simplex-table_${index}`"
          :simplex-table="simplexTable"
          :previous-table="index > 0 ? investmentOfFunds.simplexTables[index - 1] : undefined"
          :is-current-step="!investmentOfFunds.answer && index === investmentOfFunds.simplexTables.length - 1"
          @apply="simplexTableApply"
          @back="simplexTableBack"
        />
      </template>

      <answer
        v-if="investmentOfFunds?.answer"
        :is-current-step="!investmentOfFunds.showResult"
        :answer="investmentOfFunds.answer"
        @apply="answerApply"
        @back="answerBack"
      />

      <emmm-result-section v-if="investmentOfFunds?.showResult" :errors="investmentOfFunds.countErrors" @back="resultBack" />
    </div>

    <emmm-save-file-modal ref="saveFileModal" />
  </section>
  <a href="#footer" ref="linkFooter" tabindex="-1" />
  <footer class="investment-of-funds__footer" id="footer">
    <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
    <emmm-button :background="`orange`" @click="fullReset">Очистить</emmm-button>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { colorEnum, EmmmButton, EmmmIcon, EmmmResultSection, EmmmSaveFileModal } from '@/components';
import { InjectReactive, Watch } from 'vue-property-decorator';
import {
  initialFirstCase,
  initialSecondCase,
  initialInvestmentOfFunds,
  tInvestmentOfFunds,
  initialLmin,
  initialSecondCaseCondition,
  initialSimplexTableRows,
  initialAnswer,
} from '@/views/investmentOfFunds/component';
import Initial from '@/views/investmentOfFunds/initial/Initial.vue';
import FirstCase from '@/views/investmentOfFunds/firstCase/FirstCase.vue';
import SecondCase from '@/views/investmentOfFunds/secondCase/SecondCase.vue';
import LMin from '@/views/investmentOfFunds/lMin/LMin.vue';
import { initialElement, initialSimplexTableWithPrevious } from '@/views/simplex/component';
import SimplexTable from '@/views/simplex/simplexTable/SimplexTable.vue';
import { Fraction } from '@/class';
import Answer from '@/views/investmentOfFunds/answer/Answer.vue';
import { abs } from '@/helper';

@Options({
  name: 'InvestmentOfFunds',
  components: { SecondCase, FirstCase, EmmmIcon, EmmmButton, EmmmResultSection, EmmmSaveFileModal, Initial, LMin, SimplexTable, Answer },
})
export default class InvestmentOfFunds extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    linkFooter: { click: () => void };
  };

  investmentOfFunds: tInvestmentOfFunds | null = null;

  @Watch('investmentOfFunds', { deep: true }) wInvestmentOfFunds(): void {
    const investmentOfFundsJSON = JSON.stringify(this.investmentOfFunds);
    sessionStorage.setItem('investmentOfFunds', investmentOfFundsJSON);
  }

  get secondCaseApply(): () => void {
    return this.investmentOfFunds!.secondCase!.conditions === null ? this.secondCaseInitialApply : this.secondCaseConditionApply;
  }

  get firstCaseBack(): () => void {
    return this.investmentOfFunds!.firstCase!.length <= 1 ? this.firstCaseFirstBack : this.firstCaseAddBack;
  }

  get secondCaseBack(): () => void {
    return this.investmentOfFunds!.secondCase!.conditions === null
      ? this.secondCaseInitialBack
      : this.investmentOfFunds!.secondCase!.conditions.length <= 1
      ? this.secondCaseFirstConditionBack
      : this.secondCaseConditionBack;
  }

  get simplexTableApply(): () => void {
    const simplexTable = this.investmentOfFunds!.simplexTables![this.investmentOfFunds!.simplexTables!.length - 1];
    return simplexTable.element !== null
      ? this.simplexTableElementApply
      : this.investmentOfFunds!.simplexTables!.length <= 1
      ? this.simplexTableFirstApply
      : this.simplexTableInitialApply;
  }

  initialApply(): void {
    let errorMessage = '';

    this.investmentOfFunds!.conditions.coefficients.forEach(coef => {
      if (coef.x! < 0) {
        coef.x = null;
        errorMessage = 'Допустимы только неотрицательные числа!';
      }

      if (0 > coef.upperBound!) {
        coef.upperBound = null;
        errorMessage = 'Неравенство не выполняется!';
      }
    });

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.investmentOfFunds!.countErrors++;
    } else {
      this.investmentOfFunds!.firstCase = [initialFirstCase()];
      this.toDown();
    }
  }

  firstCaseApply(): void {
    let errorMessage = '';
    const { coefficients, t2, t4, t6 } = this.investmentOfFunds!.conditions;

    this.investmentOfFunds!.firstCase!.forEach((condition, index) => {
      if (abs(condition.coef! - coefficients[index].t!) >= 0.0001) {
        errorMessage = 'Значение указано неверно!';
        condition.coef = null;
      }

      if (abs(condition.a! - coefficients[index].x!) >= 0.0001) {
        errorMessage = 'Значение указано неверно!';
        condition.a = null;
      }

      if (abs(condition.x! - coefficients[index].upperBound!) >= 0.0001) {
        errorMessage = 'Значение указано неверно!';
        condition.x = null;
      }

      if (
        (index === 0 && abs(condition.t! - t2!) >= 0.0001) ||
        (index === 1 && abs(condition.t! - t4!) >= 0.0001) ||
        (index === 2 && abs(condition.t! - t6!) >= 0.0001)
      ) {
        errorMessage = 'Значение указано неверно!';
        condition.t = null;
      }

      if (!errorMessage) {
        if (condition.coef! * (1 - condition.a! * condition.x!) > condition.t! !== condition.isMore) {
          errorMessage = 'Знак неравенства выбран неверно!';
          condition.isMore = null;
        } else if (condition.isMore !== (condition.isComplete === 'complete')) {
          errorMessage = `Ошибка! Условие ${condition.isMore ? '' : 'не '}выполнено!`;
          condition.isComplete = condition.isMore ? 'complete' : 'uncomplete';
        }
      }
    });

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.investmentOfFunds!.countErrors++;
    } else {
      if (this.investmentOfFunds!.firstCase!.some(condition => condition.isComplete === 'uncomplete')) {
        this.investmentOfFunds!.secondCase = initialSecondCase();
      } else if (this.investmentOfFunds!.firstCase!.length >= 3) {
        this.investmentOfFunds!.Lmin = initialLmin();
      } else {
        this.investmentOfFunds!.firstCase!.push(initialFirstCase());
      }

      this.toDown();
    }
  }

  firstCaseFirstBack(): void {
    this.investmentOfFunds!.firstCase = null;
  }

  firstCaseAddBack(): void {
    this.investmentOfFunds!.firstCase!.pop();
  }

  secondCaseInitialApply(): void {
    let errorMessage = '';

    if (
      abs(
        this.investmentOfFunds!.secondCase!.criticalTime! -
          this.investmentOfFunds!.conditions.coefficients.reduce((total, coef) => total + coef.t!, 0),
      ) >= 0.0001
    ) {
      this.investmentOfFunds!.secondCase!.criticalTime = null;
      this.investmentOfFunds!.secondCase!.differenceTime = null;
      errorMessage = 'Критическое время вычислено неверно!';
    } else if (
      abs(
        this.investmentOfFunds!.secondCase!.differenceTime! -
          this.investmentOfFunds!.secondCase!.criticalTime! +
          this.investmentOfFunds!.conditions.T0!,
      ) >= 0.0001
    ) {
      this.investmentOfFunds!.secondCase!.differenceTime = null;
      errorMessage = 'Величина снижения времени вычислена неверно!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.investmentOfFunds!.countErrors++;
    } else {
      this.investmentOfFunds!.secondCase!.conditions = [initialSecondCaseCondition()];
      this.toDown();
    }
  }

  secondCaseConditionApply(): void {
    let errorMessage = '';

    const { coefficients, t2, t4, t6 } = this.investmentOfFunds!.conditions,
      differenceTime = this.investmentOfFunds!.secondCase!.differenceTime!;

    this.investmentOfFunds!.secondCase!.conditions!.forEach((condition, index) => {
      if (abs(condition.coef! - coefficients[index].t!) >= 0.001) {
        errorMessage = 'Значение указано неверно!';
        condition.coef = null;
      }

      if (abs(condition.differenceTime! - differenceTime) >= 0.001) {
        errorMessage = 'Значение указано неверно!';
        condition.differenceTime = null;
      }

      if (
        (index === 0 && abs(condition.t! - t2!) >= 0.001) ||
        (index === 1 && abs(condition.t! - t4!) >= 0.001) ||
        (index === 2 && abs(condition.t! - t6!) >= 0.001)
      ) {
        errorMessage = 'Значение указано неверно!';
        condition.t = null;
      }

      if (!errorMessage) {
        if (condition.coef! - condition.differenceTime! > condition.t! !== condition.isMore) {
          errorMessage = 'Знак неравенства выбран неверно!';
          condition.isMore = null;
        } else if (condition.isMore !== (condition.isComplete === 'complete')) {
          errorMessage = `Ошибка! Условие ${condition.isMore ? '' : 'не '}выполнено!`;
          condition.isComplete = condition.isMore ? 'complete' : 'uncomplete';
        }
      }
    });

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.investmentOfFunds!.countErrors++;
    } else {
      if (this.investmentOfFunds!.secondCase!.conditions!.some(condition => condition.isComplete === 'uncomplete')) {
        this.investmentOfFunds!.showResult = true;
      } else if (this.investmentOfFunds!.secondCase!.conditions!.length >= 3) {
        this.investmentOfFunds!.Lmin = initialLmin();
      } else {
        this.investmentOfFunds!.secondCase!.conditions!.push(initialSecondCaseCondition());
      }
      this.toDown();
    }
  }

  secondCaseInitialBack(): void {
    this.investmentOfFunds!.secondCase = null;
  }

  secondCaseFirstConditionBack(): void {
    this.investmentOfFunds!.secondCase!.conditions = null;
  }

  secondCaseConditionBack(): void {
    this.investmentOfFunds!.secondCase!.conditions!.pop();
  }

  lMinApply(): void {
    let errorMessage = '';
    const criticalTime = this.investmentOfFunds!.conditions.coefficients.reduce((total, coef) => total + coef.t!, 0);
    let rightPart = criticalTime - this.investmentOfFunds!.conditions.T0!,
      resultX = this.investmentOfFunds!.conditions.coefficients.map(coef => coef.t! * coef.x!);

    while (abs(rightPart - Math.round(rightPart)) >= 0.00001 || resultX.some(x => abs(x - Math.round(x)) >= 0.0001)) {
      rightPart *= 10;
      resultX = resultX.map(x => x * 10);
    }

    if (abs(this.investmentOfFunds!.Lmin!.result! - rightPart) >= 0.0001) {
      this.investmentOfFunds!.Lmin!.result = null;
      errorMessage = 'Неравенство составлено неверно!';
    }

    this.investmentOfFunds!.Lmin!.coefficients.forEach((coef, index) => {
      if (abs(coef.x! - resultX[index]) >= 0.0001) {
        coef.x = null;
        errorMessage = 'Неравенство составлено неверно!';
      }
    });

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.investmentOfFunds!.countErrors++;
    } else {
      this.investmentOfFunds!.Lmin!.result = Math.round(this.investmentOfFunds!.Lmin!.result!);
      this.investmentOfFunds!.Lmin!.coefficients.forEach(coef => {
        coef.x = Math.round(coef.x!);
      });

      this.investmentOfFunds!.simplexTables = [initialSimplexTableRows(6, 5)];
      this.toDown();
    }
  }

  lMinBack(): void {
    this.investmentOfFunds!.Lmin = null;
  }

  simplexTableFirstApply(): void {
    let errorMessage = '';
    const simplexTables = this.investmentOfFunds!.simplexTables!,
      simplexTable = simplexTables[simplexTables.length - 1];

    if (abs(new Fraction(simplexTable.cells[1][1].value!).valueOf()) >= 0.001) {
      simplexTable.cells[1][1].value = null;
      simplexTable.cells[1][1].borderColor = colorEnum.orange;
      errorMessage = 'Таблица заполнена неверно!';
    }

    simplexTable.cells[1].slice(2, simplexTable.cells[1].length).forEach(cell => {
      if (abs(new Fraction(cell.value!).valueOf() + 1) >= 0.001) {
        cell.value = null;
        cell.borderColor = colorEnum.orange;
        errorMessage = 'Таблица заполнена неверно!';
      }
    });

    if (abs(new Fraction(simplexTable.cells[2][1].value!).valueOf() + this.investmentOfFunds!.Lmin!.result!) >= 0.001) {
      simplexTable.cells[2][1].value = null;
      simplexTable.cells[2][1].borderColor = colorEnum.orange;
      errorMessage = 'Таблица заполнена неверно!';
    }

    simplexTable.cells[2].slice(2, simplexTable.cells[2].length).forEach((cell, indexColumn) => {
      if (abs(new Fraction(cell.value!).valueOf() + this.investmentOfFunds!.Lmin!.coefficients[indexColumn].x!) >= 0.001) {
        cell.value = null;
        cell.borderColor = colorEnum.orange;
        errorMessage = 'Таблица заполнена неверно!';
      }
    });

    simplexTable.cells.slice(3, simplexTable.cells.length).forEach((row, indexRow) => {
      if (abs(new Fraction(row[1].value!).valueOf() - this.investmentOfFunds!.conditions.coefficients[indexRow].upperBound!) >= 0.001) {
        row[1].value = null;
        row[1].borderColor = colorEnum.orange;
        errorMessage = 'Таблица заполнена неверно!';
      }

      row.slice(2, row.length).forEach((cell, indexColumn) => {
        if (
          (indexColumn === indexRow && abs(new Fraction(cell.value!).valueOf() - 1) >= 0.001) ||
          (indexColumn !== indexRow && abs(new Fraction(cell.value!).valueOf()) >= 0.001)
        ) {
          cell.value = null;
          cell.borderColor = colorEnum.orange;
          errorMessage = 'Таблица заполнена неверно!';
        }
      });
    });

    if (errorMessage) {
      this.investmentOfFunds!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else this.checkPlanFounded();
  }

  checkPlanFounded(): void {
    const simplexTables = this.investmentOfFunds!.simplexTables!,
      simplexTable = simplexTables[simplexTables.length - 1];

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

    if (referencePlanFound && optimalPlanFound) {
      this.investmentOfFunds!.answer = initialAnswer();
      this.toDown();
    } else {
      simplexTable.element = initialElement();
    }
  }

  simplexTableInitialApply(): void {
    let errorMessage = '';
    const simplexTables = this.investmentOfFunds!.simplexTables!,
      simplexTable = simplexTables[simplexTables.length - 1];

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

    if (errorMessage) {
      this.investmentOfFunds!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else this.checkPlanFounded();
  }

  simplexTableElementApply(): void {
    let errorMessage = '';
    const simplexTables = this.investmentOfFunds!.simplexTables!,
      simplexTable = simplexTables[simplexTables.length - 1];

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

    if (errorMessage) {
      this.investmentOfFunds!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.investmentOfFunds!.simplexTables!.push(
        initialSimplexTableWithPrevious(simplexTable, simplexTable.element!.row, simplexTable.element!.column),
      );
      this.toDown();
    }
  }

  simplexTableBack(): void {
    const simplexTables = this.investmentOfFunds!.simplexTables!,
      simplexTable = simplexTables[simplexTables.length - 1];

    if (simplexTable.element) {
      simplexTable.element = null;
      simplexTable.cells.forEach(row => row.forEach(cell => (cell.borderColor = null)));
    } else if (this.investmentOfFunds!.simplexTables!.length <= 1) {
      this.investmentOfFunds!.simplexTables = null;
    } else {
      this.investmentOfFunds!.simplexTables!.pop();
    }
  }

  answerApply(): void {
    let errorMessage = '';

    const simplexTables = this.investmentOfFunds!.simplexTables!,
      simplexTable = simplexTables[simplexTables.length - 1],
      xKeys = [1, 3, 5, 7],
      keys = xKeys.map(key => {
        const foundedIndexRow = simplexTable.cells.findIndex(row => row[0].constValue === `x<sub>${key}</sub>`);
        return { key: `x${key}`, index: foundedIndexRow < -0.001 ? null : foundedIndexRow };
      });

    if (abs(new Fraction(this.investmentOfFunds!.answer!.Lmin.value!).valueOf() - new Fraction(simplexTable.cells[1][1].value!).valueOf()) >= 0.001) {
      errorMessage = 'Ответ неверный!';
      this.investmentOfFunds!.answer!.Lmin.value = null;
      this.investmentOfFunds!.answer!.Lmin.borderColor = colorEnum.orange;
    }

    keys.forEach(key => {
      if (
        (key.index === null && abs(new Fraction(this.investmentOfFunds!.answer![key.key].value!).valueOf()) >= 0.001) ||
        (key.index !== null &&
          abs(
            new Fraction(this.investmentOfFunds!.answer![key.key].value!).valueOf() - new Fraction(simplexTable.cells[key.index][1].value!).valueOf(),
          ) >= 0.001)
      ) {
        errorMessage = 'Ответ неверный!';
        this.investmentOfFunds!.answer![key.key].value = null;
        this.investmentOfFunds!.answer![key.key].borderColor = colorEnum.orange;
      }
    });

    if (errorMessage) {
      this.investmentOfFunds!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.investmentOfFunds!.showResult = true;
      this.toDown();
    }
  }

  answerBack(): void {
    this.investmentOfFunds!.answer = null;
  }

  resultBack(): void {
    this.investmentOfFunds!.showResult = false;
  }

  fullReset(): void {
    if (sessionStorage.getItem('investmentOfFunds')) sessionStorage.removeItem('investmentOfFunds');
    this.investmentOfFunds = initialInvestmentOfFunds();
  }

  saveFile(): void {
    const investmentOfFundsJSON = JSON.stringify(this.investmentOfFunds);
    this.$refs.saveFileModal.showModal(investmentOfFundsJSON);
  }

  toDown(): void {
    this.$refs.linkFooter.click();
  }

  setInvestmentOfFunds(investmentOfFunds: tInvestmentOfFunds): void {
    this.investmentOfFunds = {
      ...initialInvestmentOfFunds(),
      ...investmentOfFunds,
    };
  }

  created(): void {
    const investmentOfFundsJSON = sessionStorage.getItem('investmentOfFunds');
    if (investmentOfFundsJSON) this.setInvestmentOfFunds(JSON.parse(investmentOfFundsJSON));
    else this.fullReset();
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.investment-of-funds {
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
