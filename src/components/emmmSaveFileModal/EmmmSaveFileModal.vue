<template>
  <emmm-modal></emmm-modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { EmmmButton, EmmmInput, EmmmModal } from '@/components';

@Options({
  name: 'EmmmSaveFileModal',
  components: { EmmmModal, EmmmButton, EmmmInput },
})
export default class EmmmSaveFileModal extends Vue {}
</script>

<style lang="scss" scoped></style>
