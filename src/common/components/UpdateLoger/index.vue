<template>
  <el-timeline class="time">
    <el-timeline-item
      :type="index === 0 ? 'primary' : undefined"
      v-for="(item, index) in updateLog"
      :timestamp="item.timestamp"
      :key="index"
      placement="top"
    >
      <el-card v-html="item.content" class="logs-content" />
    </el-timeline-item>
  </el-timeline>
</template>

<script lang="tsx">
import { defineComponent } from '@vue/composition-api'
import updateLog from './updateLog'

export default defineComponent({
  setup() {
    return {
      updateLog,
    }
  },
})
</script>

<style lang="scss" scoped>
.logs-content {
  min-height: 100px;
  padding: 10px;
  line-height: 1.5;
}
</style>
