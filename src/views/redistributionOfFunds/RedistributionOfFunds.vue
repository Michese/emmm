<template>
  <section class="redistribution-of-funds">
    <span class="redistribution-of-funds__top">
      <h1 class="redistribution-of-funds__title">Перераспределение средств</h1>
      <a href="#" target="_blank" download class="redistribution-of-funds__exclamation-mark exclamation-mark">
        <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
      </a>
    </span>

    <div class="container">
      <initial
        v-if="redistributionOfFunds"
        :is-current-step="!redistributionOfFunds.firstCase"
        :conditions="redistributionOfFunds.conditions"
        @apply="initialApply"
        @upload="uploadFile"
        class="redistribution-of-funds__section"
      />

      <system
        v-if="redistributionOfFunds?.firstCase?.system"
        :is-current-step="!redistributionOfFunds?.firstCase?.vectorPoints"
        :is-more="true"
        :system="redistributionOfFunds.firstCase.system"
        @apply="systemApply('firstCase')"
        @back="systemBack('firstCase')"
        class="redistribution-of-funds__section"
      />

      <vector
        v-if="redistributionOfFunds?.firstCase?.vectorPoints"
        :is-current-step="!redistributionOfFunds?.firstCase?.vector"
        :vector-points="redistributionOfFunds.firstCase.vectorPoints"
        @apply="vectorApply('firstCase')"
        @back="vectorBack('firstCase')"
        class="redistribution-of-funds__section"
      />

      <graphic
        v-if="redistributionOfFunds?.firstCase?.vector"
        :is-current-step="!redistributionOfFunds?.firstCase?.answer"
        :is-more="true"
        :case-object="redistributionOfFunds.firstCase"
        ref="firstCaseGraphic"
        @apply="graphicApply('firstCase')"
        @back="graphicBack('firstCase')"
        class="redistribution-of-funds__section"
      />

      <answer
        v-if="redistributionOfFunds?.firstCase?.answer"
        :is-current-step="!redistributionOfFunds?.secondCase?.system"
        :answer="redistributionOfFunds.firstCase.answer"
        @apply="answerApply('firstCase')"
        @back="answerBack('firstCase')"
        class="redistribution-of-funds__section"
      />

      <initial
        v-if="redistributionOfFunds?.secondCase?.system"
        :conditions="redistributionOfFunds.conditions"
        class="redistribution-of-funds__section"
      />

      <system
        v-if="redistributionOfFunds?.secondCase?.system"
        :is-current-step="!redistributionOfFunds?.secondCase?.vectorPoints"
        :is-more="false"
        :system="redistributionOfFunds.secondCase.system"
        @apply="systemApply('secondCase')"
        @back="systemBack('secondCase')"
        class="redistribution-of-funds__section"
      />

      <vector
        v-if="redistributionOfFunds?.secondCase?.vectorPoints"
        :is-current-step="!redistributionOfFunds?.secondCase?.vector"
        :vector-points="redistributionOfFunds.secondCase.vectorPoints"
        @apply="vectorApply('secondCase')"
        @back="vectorBack('secondCase')"
        class="redistribution-of-funds__section"
      />

      <graphic
        v-if="redistributionOfFunds?.secondCase?.vector"
        :is-current-step="!redistributionOfFunds?.secondCase?.answer"
        :is-more="false"
        :case-object="redistributionOfFunds.secondCase"
        ref="secondCaseGraphic"
        @apply="graphicApply('secondCase')"
        @back="graphicBack('secondCase')"
        class="redistribution-of-funds__section"
      />

      <answer
        v-if="redistributionOfFunds?.secondCase?.answer"
        :is-current-step="!redistributionOfFunds?.showResult"
        :answer="redistributionOfFunds.secondCase.answer"
        @apply="answerApply('secondCase')"
        @back="answerBack('secondCase')"
        class="redistribution-of-funds__section"
      />

      <emmm-result-section v-if="redistributionOfFunds?.showResult" :errors="redistributionOfFunds.countErrors" @back="resultBack" />
    </div>

    <emmm-save-file-modal ref="saveFileModal" />
  </section>
  <a href="#footer" ref="linkFooter" tabindex="-1" />
  <footer class="redistribution-of-funds__footer" id="footer">
    <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
    <emmm-button :background="`orange`" @click="fullReset">Очистить</emmm-button>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmResultSection, EmmmSaveFileModal, TLine, TPoint, TStaticZoneBuilder } from '@/components';

import { InjectReactive, Ref, Watch } from 'vue-property-decorator';
import {
  initialAnswer,
  initialCase,
  initialRedistributionOfFunds,
  initialVector,
  initialVectorPoint,
  tRedistributionOfFunds,
} from '@/views/redistributionOfFunds/component';
import Initial from '@/views/redistributionOfFunds/initial/Initial.vue';
import Vector from '@/views/redistributionOfFunds/vector/Vector.vue';
import Graphic from '@/views/redistributionOfFunds/graphic/Graphic.vue';
import Answer from '@/views/redistributionOfFunds/answer/Answer.vue';
import System from '@/views/redistributionOfFunds/system/System.vue';
import { abs, checkHashObject, creatorHashJSON } from '@/helper';

@Options({
  name: 'RedistributionOfFunds',
  components: { Graphic, Vector, EmmmIcon, EmmmButton, EmmmResultSection, EmmmSaveFileModal, Initial, System, Answer },
})
export default class RedistributionOfFunds extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    linkFooter: { click: () => void };
  };

  @Ref('firstCaseGraphic') firstCaseGraphic!: { minValue: number; allLines: TLine[]; pointsOfArea: TPoint[] };
  @Ref('secondCaseGraphic') secondCaseGraphic!: { minValue: number; allLines: TLine[]; pointsOfArea: TPoint[] };

  redistributionOfFunds: tRedistributionOfFunds | null = null;

  @Watch('redistributionOfFunds', { deep: true }) wRedistributionOfFunds(): void {
    const redistributionOfFundsJSON = JSON.stringify(this.redistributionOfFunds);
    sessionStorage.setItem('redistributionOfFunds', redistributionOfFundsJSON);
  }

  initialApply(): void {
    let errorMessage = '';

    this.redistributionOfFunds!.conditions.forEach(condition => {
      if (condition.x! < 0) {
        errorMessage = 'Неверное условие!';
        condition.x = null;
      }

      if (condition.a! < 0) {
        errorMessage = 'Знаки уже учитываются!';
        condition.a = null;
      }
    });

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.redistributionOfFunds!.countErrors++;
    } else {
      this.redistributionOfFunds!.firstCase = initialCase();
      this.toDown();
    }
  }

  systemApply(numberCase: 'firstCase' | 'secondCase'): void {
    let errorMessage = '';
    const { t: t1, a: a1, x: x1 } = this.redistributionOfFunds!.conditions[0],
      { t: t2, a: a2, x: x2 } = this.redistributionOfFunds!.conditions[1],
      { t: t3, a: a3, x: x3 } = this.redistributionOfFunds!.conditions[2],
      system = this.redistributionOfFunds![numberCase]!.system;

    if (numberCase === 'firstCase') {
      if (abs(system.t.coefficient! - t1! - t3!) >= 0.0001) {
        system.t.coefficient = null;
        errorMessage = 'Ошибка!';
      }

      if (abs(system.t.x2! - t1! * a1!) >= 0.0001) {
        system.t.x2 = null;
        errorMessage = 'Ошибка!';
      }

      if (abs(system.t.x3! - t1! * a1! + t3! * a3!) >= 0.0001) {
        system.t.x3 = null;
        errorMessage = 'Ошибка!';
      }
    } else {
      if (abs(system.t.coefficient! - t2! - t3!) >= 0.0001) {
        system.t.coefficient = null;
        errorMessage = 'Ошибка!';
      }

      if (abs(system.t.x2! + t2! * a2!) >= 0.0001) {
        system.t.x2 = null;
        errorMessage = 'Ошибка!';
      }

      if (abs(system.t.x3! + t3! * a3!) >= 0.0001) {
        system.t.x3 = null;
        errorMessage = 'Ошибка!';
      }
    }

    if (abs(system.first.x2! - t1! * a1! - t2! * a2!) >= 0.0001) {
      system.first.x2 = null;
      errorMessage = 'Ошибка!';
    }

    if (abs(system.first.x3! - t1! * a1!) >= 0.0001) {
      system.first.x3 = null;
      errorMessage = 'Ошибка!';
    }

    if (abs(t1! - t2! + system.first.coefficient!) >= 0.0001) {
      system.first.coefficient = null;
      errorMessage = 'Ошибка!';
    }

    if (abs(system.second! - x1!) >= 0.0001) {
      system.second = null;
      errorMessage = 'Ошибка!';
    }

    if (abs(system.third! - x2!) >= 0.0001) {
      system.third = null;
      errorMessage = 'Ошибка!';
    }

    if (abs(system.fourth! - x3!) >= 0.0001) {
      system.fourth = null;
      errorMessage = 'Ошибка!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.redistributionOfFunds!.countErrors++;
    } else {
      this.redistributionOfFunds![numberCase]!.vectorPoints = [initialVectorPoint(), initialVectorPoint()];
      this.toDown();
    }
  }

  systemBack(numberCase: 'firstCase' | 'secondCase'): void {
    this.redistributionOfFunds![numberCase] = null;
  }

  vectorApply(numberCase: 'firstCase' | 'secondCase'): void {
    let errorMessage = '';
    const diffX2 = this.redistributionOfFunds![numberCase]!.vectorPoints![1].x2! - this.redistributionOfFunds![numberCase]!.vectorPoints![0].x2!,
      diffX3 = this.redistributionOfFunds![numberCase]!.vectorPoints![1].x3! - this.redistributionOfFunds![numberCase]!.vectorPoints![0].x3!;

    let result;

    if (abs(this.redistributionOfFunds![numberCase]!.system.t.x2!) <= 0.001 && abs(this.redistributionOfFunds![numberCase]!.system.t.x3!) <= 0.001) {
      result = abs(diffX2) <= 0.001 && abs(diffX3) <= 0.001;
    } else if (abs(this.redistributionOfFunds![numberCase]!.system.t.x2!) <= 0.001) {
      result =
        abs(diffX2) <= 0.001 &&
        ((diffX3 > 0 && this.redistributionOfFunds![numberCase]!.system.t.x3! < 0) ||
          (diffX3 < 0 && this.redistributionOfFunds![numberCase]!.system.t.x3! > 0));
    } else if (abs(this.redistributionOfFunds![numberCase]!.system.t.x3!) <= 0.001) {
      result =
        abs(diffX3) <= 0.001 &&
        ((diffX2 > 0 && this.redistributionOfFunds![numberCase]!.system.t.x2! < 0) ||
          (diffX2 < 0 && this.redistributionOfFunds![numberCase]!.system.t.x2! > 0));
    } else {
      const ratio =
        (this.redistributionOfFunds![numberCase]!.system.t.x3! * diffX2) / (this.redistributionOfFunds![numberCase]!.system.t.x2! * diffX3);
      result =
        abs(Math.round(ratio) - ratio) <= 0.0001 &&
        ((diffX2 > 0 && this.redistributionOfFunds![numberCase]!.system.t.x2! < 0) ||
          (diffX2 < 0 && this.redistributionOfFunds![numberCase]!.system.t.x2! > 0)) &&
        ((diffX3 > 0 && this.redistributionOfFunds![numberCase]!.system.t.x3! < 0) ||
          (diffX3 < 0 && this.redistributionOfFunds![numberCase]!.system.t.x3! > 0));
    }

    if (!result) {
      this.redistributionOfFunds![numberCase]!.vectorPoints!.forEach(point => {
        point.x3 = null;
        point.x2 = null;
      });

      errorMessage = 'Ошибка!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.redistributionOfFunds!.countErrors++;
    } else {
      this.redistributionOfFunds![numberCase]!.vector = initialVector();
      this.toDown();
    }
  }

  vectorBack(numberCase: 'firstCase' | 'secondCase'): void {
    this.redistributionOfFunds![numberCase]!.vectorPoints = null;
  }

  graphicApply(numberCase: 'firstCase' | 'secondCase'): void {
    let errorMessage = '';

    const graphicName = numberCase === 'firstCase' ? 'firstCaseGraphic' : 'secondCaseGraphic',
      {
        vector,
        system: {
          t: { x2, x3, coefficient },
        },
      } = this.redistributionOfFunds![numberCase]!,
      { minValue, allLines, pointsOfArea } = this[graphicName];

    const currentValue = vector!.x2 * x2! + vector!.x3 * x3! + coefficient!;

    if (
      abs(currentValue - minValue) >= 0.001 &&
      pointsOfArea.length > 0 &&
      !TStaticZoneBuilder.pointsOfIntersection(allLines).some(
        point => allLines.every(line => line.checkPoint(point)) && minValue > point.x * x2! + point.y * x3! + coefficient!,
      )
    ) {
      errorMessage = 'Положение вектора выбрано неверно!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.redistributionOfFunds!.countErrors++;
      this.redistributionOfFunds![numberCase]!.vector = initialVector();
    } else {
      this.redistributionOfFunds![numberCase]!.answer = initialAnswer();
      this.toDown();
    }
  }

  graphicBack(numberCase: 'firstCase' | 'secondCase'): void {
    this.redistributionOfFunds![numberCase]!.vector = null;
  }

  answerApply(numberCase: 'firstCase' | 'secondCase'): void {
    let errorMessage = '';
    const graphicName = numberCase === 'firstCase' ? 'firstCaseGraphic' : 'secondCaseGraphic',
      answer = this.redistributionOfFunds![numberCase]!.answer!,
      { x2, x3 } = this.redistributionOfFunds![numberCase]!.vector!,
      { minValue } = this[graphicName];

    if (abs(minValue - answer.t0!) >= 0.001) {
      answer.t0 = null;
      errorMessage = 'Неверный ответ!';
    }

    if (abs(x2 - answer.x2!) >= 0.001) {
      answer.x2 = null;
      errorMessage = 'Неверный ответ!';
    }

    if (abs(x3 - answer.x3!) >= 0.001) {
      answer.x3 = null;
      errorMessage = 'Неверный ответ!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.redistributionOfFunds!.countErrors++;
    } else if (numberCase === 'firstCase') {
      this.redistributionOfFunds!.secondCase = initialCase();
      this.toDown();
    } else {
      this.redistributionOfFunds!.showResult = true;
      this.toDown();
    }
  }

  answerBack(numberCase: 'firstCase' | 'secondCase'): void {
    this.redistributionOfFunds![numberCase]!.answer = null;
  }

  resultBack(): void {
    this.redistributionOfFunds!.showResult = false;
  }

  fullReset(): void {
    if (sessionStorage.getItem('redistributionOfFunds')) sessionStorage.removeItem('redistributionOfFunds');
    this.redistributionOfFunds = initialRedistributionOfFunds();
  }

  async uploadFile(redistributionOfFunds: tRedistributionOfFunds): Promise<void> {
    let errorMessage = '';
    if (
      !(
        'conditions' in redistributionOfFunds &&
        'firstCase' in redistributionOfFunds &&
        'secondCase' in redistributionOfFunds &&
        'showResult' in redistributionOfFunds &&
        'countErrors' in redistributionOfFunds &&
        'nonce' in redistributionOfFunds
      )
    ) {
      errorMessage = 'Неверный формат данных в файле!';
    } else if (!(await checkHashObject(redistributionOfFunds))) {
      errorMessage = 'Внимание! Попытка жульничества!';
    }

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.redistributionOfFunds = redistributionOfFunds;
    }
  }

  async saveFile(): Promise<void> {
    const redistributionOfFundsJSON = await creatorHashJSON(this.redistributionOfFunds!);
    this.$refs.saveFileModal.showModal(redistributionOfFundsJSON);
  }

  toDown(): void {
    this.$refs.linkFooter.click();
  }

  setRedistributionOfFunds(redistributionOfFunds: tRedistributionOfFunds): void {
    this.redistributionOfFunds = {
      ...initialRedistributionOfFunds(),
      ...redistributionOfFunds,
    };
  }

  created(): void {
    const redistributionOfFundsJSON = sessionStorage.getItem('redistributionOfFunds');
    if (redistributionOfFundsJSON) this.setRedistributionOfFunds(JSON.parse(redistributionOfFundsJSON));
    else this.fullReset();
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.redistribution-of-funds {
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
    margin-bottom: 20px;
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
