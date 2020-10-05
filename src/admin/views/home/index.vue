<template lang="pug">
.admin-content
  .content-header 近期提交情况
  .chart__wrapper
    v-chart(style="width:100%;height:500px;",ref="chart",:options="chartOption",autoresize)
</template>

<script>
import { getSubmitStatistic } from 'admin/api/admin';
import 'echarts';
import chartOption from './chartOption';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

export default {
  name: 'home',
  data() {
    return {
      chartData: [],
      chartOption,
    };
  },
  activated() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const { id } = this.$route.params;
        const res = await getSubmitStatistic(id);
        const { data: { recent_submit_statistic } } = res;
        this.chartOption.series.data = recent_submit_statistic.map((x) => x.count);
        this.chartOption.xAxis.data = recent_submit_statistic.map((x) => x.date);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chart__wrapper {
  margin-top: .2rem;
}
</style>
