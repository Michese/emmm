<template>
  <span class="emmm-radio">
    <input type="radio" :name="name" :id="id" :value="value" v-model="curValue" class="emmm-radio__body" />
    <label :for="id">{{ label }}</label>
  </span>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
  name: 'EmmmRadio',
  emits: ['change'],
})
export default class EmmmRadio extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
  })
  id!: string;

  @Prop({
    type: String,
    required: false,
    default: () => '',
  })
  label!: string;

  @Prop({
    type: String,
    required: true,
  })
  value!: string;

  @Prop({
    type: String,
    required: true,
  })
  currentValue!: string;

  @Watch('currentValue') wCurrentValue(): void {
    this.curValue = this.currentValue;
  }

  curValue = this.currentValue;
}
</script>

<style lang="scss" scoped>
.emmm-radio {
  display: flex;
  align-items: center;

  &__body {
    margin-right: 0.5em;
  }
}
</style>
