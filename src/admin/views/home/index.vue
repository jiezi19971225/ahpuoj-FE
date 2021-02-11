<template>
  <div class="admin-content">
    <div class="content-header">近期提交情况</div>
    <div class="chart__wrapper">
      <v-chart
        style="width: 100%; height: 500px"
        ref="chart"
        :options="chartOption"
        autoresize
      ></v-chart>
    </div>
  </div>
</template>

<script lang="ts">
import * as adminApi from '@admin/api/admints'
import 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import { onActivated, reactive } from '@vue/composition-api'
import defaultChartOption from './chartOption'

export default {
  name: 'home',
  setup() {
    const chartOption = reactive(defaultChartOption)
    onActivated(() => {
      adminApi
        .getSubmitStatistic<SubmitStatisticResposne>()
        .then(res => {
          // eslint-disable-next-line camelcase
          const { recent_submit_statistic } = res
          chartOption.series.data = recent_submit_statistic.map(x => x.count)
          chartOption.xAxis.data = recent_submit_statistic.map(x => x.date)
        })
        .catch(err => {
          console.log(err)
        })
    })

    return {
      chartOption,
    }
  },
}
</script>

<style lang="scss" scoped>
.chart__wrapper {
  margin-top: 0.2rem;
}
</style>
