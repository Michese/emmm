<template>
  <section class="network-planning">
    <span class="network-planning__top">
      <h1 class="network-planning__title">Сетевое планирование</h1>
      <a href="#" target="_blank" download class="network-planning__exclamation-mark exclamation-mark">
        <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
      </a>
    </span>

    <div class="container">
      <initial
        v-if="networkPlanning?.parameters"
        :is-current-step="!networkPlanning?.oldWorks"
        :parameters="networkPlanning.parameters"
        @upload="setNetworkPlanning"
        @apply="initialApply"
        class="network-planning__initial"
      />
    </div>

    <old-network-table
      v-if="networkPlanning?.oldWorks"
      :new-works="networkPlanning.newWorks"
      :is-current-step="!networkPlanning?.newWorks"
      :old-works="networkPlanning.oldWorks"
      @apply="oldNetworkTableApplyEvent"
      @back="oldNetworkTableBackEvent"
    />

    <new-network-table
      v-if="networkPlanning?.newWorks"
      :is-current-step="!networkPlanning?.path"
      :new-works="networkPlanning.newWorks"
      :old-works="networkPlanning.oldWorks"
      @apply="newNetworkTableApply"
      @back="newNetworkTableBack"
    />

    <creator-path
      v-if="networkPlanning?.path"
      :path="networkPlanning.path"
      :parameters="networkPlanning.parameters"
      :is-current-step="!networkPlanning?.answer"
      @apply="pathApply"
      @back="pathBack"
    />

    <div class="container">
      <answer
        v-if="networkPlanning?.answer"
        :is-current-step="!networkPlanning?.showResult"
        :parameters="networkPlanning.parameters"
        :answer="networkPlanning.answer"
        @apply="answerApply"
        @back="answerBack"
      />
    </div>

    <div class="container">
      <emmm-result-section v-if="networkPlanning?.showResult" :errors="networkPlanning.countErrors" @back="resultBack" />
    </div>
    <emmm-save-file-modal ref="saveFileModal" />
  </section>
  <a href="#footer" ref="linkFooter" tabindex="-1" />
  <footer v-if="true" class="network-planning__footer" id="footer">
    <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
    <emmm-button :background="`orange`" @click="fullReset">Очистить</emmm-button>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { colorEnum, EmmmButton, EmmmIcon, EmmmResultSection, EmmmSaveFileModal } from '@/components';
import { InjectReactive, Watch } from 'vue-property-decorator';
import {
  generatorNewWorks,
  generatorOldWorks,
  initialAnswer,
  initialNetworkPlanning,
  initialPath,
  tNetworkPlanning,
  tOldWork,
  tPath,
} from '@/views/networkPlanning/component';
import Initial from '@/views/networkPlanning/initial/Initial.vue';
import OldNetworkTable from '@/views/networkPlanning/oldNetworkTable/OldNetworkTable.vue';
import NewNetworkTable from '@/views/networkPlanning/newNetworkTable/NewNetworkTable.vue';
import CreatorPath from '@/views/networkPlanning/creatorPath/CreatorPath.vue';
import { initialOldPath } from '@/views/networkPlanning/component/functions/initialOldPath';
import Answer from '@/views/networkPlanning/answer/Answer.vue';

@Options({
  name: 'NetworkPlanning',
  components: { EmmmIcon, EmmmButton, EmmmResultSection, EmmmSaveFileModal, Initial, NewNetworkTable, OldNetworkTable, CreatorPath, Answer },
})
export default class NetworkPlanning extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    linkFooter: { click: () => void };
  };

  networkPlanning: tNetworkPlanning | null = null;

  @Watch('networkPlanning', { deep: true }) wNetworkPlanning(): void {
    const networkPlanningJSON = JSON.stringify(this.networkPlanning);
    sessionStorage.setItem('networkPlanning', networkPlanningJSON);
  }

  initialApply(): void {
    this.networkPlanning!.oldWorks = [...generatorOldWorks(this.networkPlanning!.parameters.columns!, this.networkPlanning!.parameters.rows!)];
    this.toDown();
  }

  get oldNetworkTableApplyEvent(): () => void {
    return this.networkPlanning!.oldWorks!.every(work => work.designation)
      ? this.oldNetworkTableEnteringNewDesignationsApply
      : this.oldNetworkTableInitialApply;
  }

  oldNetworkTableInitialApply(): void {
    let errorMessage = '';

    if (!this.networkPlanning!.oldWorks!.some(work => work.reliesOn.every(relyOn => relyOn.value === null))) {
      errorMessage = 'Все нули!';
    }

    if (errorMessage) {
      this.networkPlanning!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.networkPlanning!.oldWorks!.forEach(work => (work.designation = { value: null, borderColor: null }));
    }
  }

  get sortedDesignations(): (tOldWork & { oldDesignation: number })[] {
    return this.networkPlanning?.oldWorks?.every(work => !!work.designation)
      ? this.networkPlanning.oldWorks
          .map((work, index) => ({ oldDesignation: index, ...work }))
          .sort((left, right) =>
            left.designation!.value === right.designation!.value
              ? 0
              : left.designation!.value === null
              ? 1
              : right.designation!.value === null
              ? -1
              : left.designation!.value > right.designation!.value
              ? 1
              : -1,
          )
      : [];
  }

  oldNetworkTableEnteringNewDesignationsApply(): void {
    let errorMessage = '';

    if (this.sortedDesignations.length > 0 && this.sortedDesignations[this.sortedDesignations.length - 1].designation === null) {
      errorMessage = 'Не все заполнено!';
    }

    if (
      this.sortedDesignations.some((firstWork, index) =>
        this.sortedDesignations.slice(index + 1, this.sortedDesignations.length).some(secondWork => {
          const result = firstWork.designation!.value === secondWork.designation!.value;
          if (result) {
            firstWork.designation!.borderColor = colorEnum.orange;
            secondWork.designation!.borderColor = colorEnum.orange;
          }
          return result;
        }),
      )
    ) {
      errorMessage = 'Должны быть уникальными!';
    }

    if (errorMessage) {
      this.networkPlanning!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.networkPlanning!.newWorks = [...generatorNewWorks(this.sortedDesignations, this.networkPlanning!.oldWorks!)];
      this.toDown();
    }
  }

  get oldNetworkTableBackEvent(): () => void {
    return this.networkPlanning!.oldWorks!.every(work => work.designation)
      ? this.oldNetworkTableEnteringNewDesignationsBack
      : this.oldNetworkTableInitialBack;
  }

  oldNetworkTableInitialBack(): void {
    this.networkPlanning!.oldWorks = null;
  }

  oldNetworkTableEnteringNewDesignationsBack(): void {
    this.networkPlanning!.oldWorks!.forEach(work => (work.designation = null));
  }

  newNetworkTableApply(): void {
    let errorMessage = '';

    this.networkPlanning!.newWorks!.forEach(newWork => {
      if (
        newWork.totalTime.value !==
        Math.max(
          ...newWork.reliesOn.map(relyOn => (relyOn.value === null ? 0 : this.networkPlanning!.newWorks![relyOn.value! - 1].totalTime.value!)),
        ) +
          newWork.time.value!
      ) {
        newWork.totalTime.value = null;
        newWork.totalTime.borderColor = colorEnum.orange;
        errorMessage = 'Неверный ответ!';
      }
    });

    if (errorMessage) {
      this.networkPlanning!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.networkPlanning!.path = [initialPath()];
      this.toDown();
    }
  }

  newNetworkTableBack(): void {
    this.networkPlanning!.newWorks = null;
  }

  pathApply(): void {
    let errorMessage = '';

    if (this.networkPlanning!.path!.length === 0) {
      errorMessage = 'Неверно выбрано критическое время!';
    }

    const works = this.networkPlanning!.newWorks!,
      criticalTime = Math.max(...works.map(work => work.totalTime.value!)),
      criticalCount = works.map(work => work.totalTime.value!).filter(totalTime => totalTime === criticalTime).length;

    function checkChildsPath(childs: tPath[], criticalTime: number, criticalCount: number): boolean {
      if (childs.length === criticalCount && criticalCount === 0) return true;

      if (childs.some(child => works[child.value! - 1].totalTime.value! !== criticalTime)) {
        childs.forEach(child => {
          if (works[child.value! - 1].totalTime.value! !== criticalTime) {
            child.borderColor = colorEnum.orange;
            child.value = null;
            errorMessage = 'Неверно выбрано критическое время!';
          }
        });
        return false;
      } else if (childs.length !== criticalCount) {
        childs.forEach(child => (child.borderColor = colorEnum.orange));
        errorMessage = 'Неверно выбрано критическое время!';
        return false;
      }

      return childs.every(child => {
        const critTime = Math.max(...works[child.value! - 1].reliesOn.map(ralyOn => (ralyOn.value ? works[ralyOn.value - 1].totalTime.value! : 0))),
          critCount = works[child.value! - 1].reliesOn
            .map(ralyOn => (ralyOn.value ? works[ralyOn.value - 1].totalTime.value! : null))
            .filter(totalTime => totalTime !== null && totalTime === critTime).length;

        return checkChildsPath(child.childs, critTime, critCount);
      });
    }

    checkChildsPath(this.networkPlanning!.path!, criticalTime, criticalCount);

    if (errorMessage) {
      this.networkPlanning!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      const oldPAths = initialOldPath(this.networkPlanning!.path!, this.sortedDesignations);
      this.networkPlanning!.answer = initialAnswer(oldPAths);
      this.toDown();
    }
  }

  answerApply(): void {
    let errorMessage = '';
    const works = this.networkPlanning!.newWorks!,
      criticalTime = Math.max(...works.map(work => work.totalTime.value!));

    if (this.networkPlanning!.answer!.criticalTime.value !== criticalTime) {
      errorMessage = 'Неверное значение!';
      this.networkPlanning!.answer!.criticalTime.borderColor = colorEnum.orange;
      this.networkPlanning!.answer!.criticalTime.value = null;
    }

    if (errorMessage) {
      this.networkPlanning!.countErrors++;
      if (this.openErrorModal) this.openErrorModal(errorMessage);
    } else {
      this.networkPlanning!.showResult = true;
      this.toDown();
    }
  }

  answerBack(): void {
    this.networkPlanning!.answer = null;
  }

  pathBack(): void {
    this.networkPlanning!.path = null;
  }

  resultBack(): void {
    this.networkPlanning!.showResult = false;
  }

  fullReset(): void {
    if (sessionStorage.getItem('networkPlanning')) sessionStorage.removeItem('networkPlanningJSON');
    this.networkPlanning = initialNetworkPlanning();
  }

  saveFile(): void {
    const networkPlanningJSON = JSON.stringify(this.networkPlanning);
    this.$refs.saveFileModal.showModal(networkPlanningJSON);
  }

  toDown(): void {
    this.$refs.linkFooter.click();
  }

  setNetworkPlanning(networkPlanning: tNetworkPlanning): void {
    this.networkPlanning = { ...initialNetworkPlanning(), ...networkPlanning };
  }

  created(): void {
    const networkPlanningJSON = sessionStorage.getItem('networkPlanning');
    if (networkPlanningJSON) this.setNetworkPlanning(JSON.parse(networkPlanningJSON));
    else this.fullReset();
  }

  @InjectReactive('openErrorModal') openErrorModal?: (message: string) => void;
}
</script>

<style lang="scss" scoped>
.network-planning {
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

  &__initial {
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
