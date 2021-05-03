<template>
  <div class="content">
    <div class="content__main">
      <div class="one-main">
        <div class="updateLog-wrapper">
          <h2>更新日志</h2>
          <UpdateLoger />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import UpdateLoger from '@common/components/UpdateLoger/index.vue'

export default defineComponent({
  name: 'updateLoger',
  components: {
    UpdateLoger,
  },
})
</script>

<style lang="scss">
.updateLog-wrapper {
  width: 600px;
  margin: 0 auto;
}
</style>
