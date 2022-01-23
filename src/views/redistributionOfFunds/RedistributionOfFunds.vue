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
        @upload="setRedistributionOfFunds"
      />
    </div>

    <emmm-result-section v-if="redistributionOfFunds?.showResult" :errors="redistributionOfFunds.countErrors" @back="resultBack" />
    <emmm-save-file-modal ref="saveFileModal" />
  </section>
  <a href="#footer" ref="linkFooter" tabindex="-1" />
  <footer v-if="true" class="redistribution-of-funds__footer" id="footer">
    <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
    <emmm-button :background="`orange`" @click="fullReset">Очистить</emmm-button>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmResultSection, EmmmSaveFileModal } from '@/components';

import { InjectReactive, Watch } from 'vue-property-decorator';
import { initialRedistributionOfFunds, tRedistributionOfFunds } from '@/views/redistributionOfFunds/component';
import Initial from '@/views/redistributionOfFunds/initial/Initial.vue';

@Options({
  name: 'RedistributionOfFunds',
  components: { EmmmIcon, EmmmButton, EmmmResultSection, EmmmSaveFileModal, Initial },
})
export default class RedistributionOfFunds extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    linkFooter: { click: () => void };
  };

  redistributionOfFunds: tRedistributionOfFunds | null = null;

  @Watch('redistributionOfFunds', { deep: true }) wRedistributionOfFunds(): void {
    const redistributionOfFundsJSON = JSON.stringify(this.redistributionOfFunds);
    sessionStorage.setItem('redistributionOfFunds', redistributionOfFundsJSON);
  }

  initialApply(): void {
    let errorMessage = '';

    if (errorMessage) {
      if (this.openErrorModal) this.openErrorModal(errorMessage);
      this.redistributionOfFunds!.countErrors++;
    } else {
      //
    }
  }

  resultBack(): void {
    //
  }

  fullReset(): void {
    if (sessionStorage.getItem('redistributionOfFunds')) sessionStorage.removeItem('redistributionOfFunds');
    this.redistributionOfFunds = initialRedistributionOfFunds();
  }

  saveFile(): void {
    const redistributionOfFundsJSON = JSON.stringify(this.redistributionOfFunds);
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
