<template>
  <section class="investment-of-funds">
    <span class="investment-of-funds__top">
      <h1 class="investment-of-funds__title">Вложение средств</h1>
      <a href="#" target="_blank" download class="investment-of-funds__exclamation-mark exclamation-mark">
        <emmm-icon class="exclamation-mark__icon" icon="exclamationMark" :size="40" />
      </a>
    </span>

    <emmm-result-section v-if="simplex?.showResult" :errors="simplex.countErrors" @back="resultBack" />
    <emmm-save-file-modal ref="saveFileModal" />
  </section>
  <a href="#footer" ref="linkFooter" tabindex="-1" />
  <footer v-if="true" class="investment-of-funds__footer" id="footer">
    <emmm-button :background="'blue'" @click="saveFile">Сохранить</emmm-button>
    <emmm-button :background="`orange`" @click="fullReset">Очистить</emmm-button>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmIcon, EmmmResultSection, EmmmSaveFileModal } from '@/components';

import { InjectReactive, Watch } from 'vue-property-decorator';

@Options({
  name: 'InvestmentOfFunds',
  components: { EmmmIcon, EmmmButton, EmmmResultSection, EmmmSaveFileModal },
})
export default class InvestmentOfFunds extends Vue {
  declare $refs: {
    saveFileModal: { showModal: (json: string) => void };
    linkFooter: { click: () => void };
  };

  investmentOfFunds
  // simplex: tSimplex | null = null;

  // @Watch('simplex', { deep: true }) wSimplex(): void {
  // const simplexJSON = JSON.stringify(this.simplex);
  // sessionStorage.setItem('simplex', simplexJSON);
  // }

  fullReset(): void {
    // if (sessionStorage.getItem('simplex')) sessionStorage.removeItem('simplex');
    // this.simplex = initialSimplex();
  }

  saveFile(): void {
    // const simplexJSON = JSON.stringify(this.simplex);
    // this.$refs.saveFileModal.showModal(simplexJSON);
  }

  toDown(): void {
    this.$refs.linkFooter.click();
  }

  created(): void {
    // const simplexJSON = sessionStorage.getItem('simplex');
    // if (simplexJSON) this.setSimplex(JSON.parse(simplexJSON));
    // else this.fullReset();
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
