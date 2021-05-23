<template>
  <div class="slider-input">
    <el-slider v-bind="$attrs" v-model="localValue" class="slider-input__slider" />
    <el-input v-model.number="localValue" class="slider-input__input" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
  },
  setup(props, { emit }) {
    const localValue = ref(props.value)

    watch(
      () => props.value,
      val => {
        localValue.value = val
      }
    )

    watch(localValue, val => {
      if (val === '') {
        localValue.value = 0
      }
      emit('input', val)
    })

    return {
      localValue,
    }
  },
})
</script>

<style lang="scss" scoped>
.slider-input {
  display: flex;
  &__slider {
    width: 300px;
  }
  &__input {
    margin-left: 20px;
    width: 100px;
  }
}
</style>
