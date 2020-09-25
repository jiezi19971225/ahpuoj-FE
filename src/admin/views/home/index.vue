<template lang="pug">
.admin-content
  .content-header 近期提交情况
  .chart__wrapper
    line-chart(:chart-data="chartData",:id="'chart'",style="width:100%;height:500px;")
</template>

<script>
import LineChart from 'common/components/LineChart/index.vue';
import { getSubmitStatistic } from 'admin/api/admin';

export default {
  name:"home",
  components: {
    LineChart,
  },
  data() {
    return {
      chartData: [],
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
        const { data } = res;
        this.chartData =  [
          {
            legend:'累计提交',
            data:data.recent_submit_statistic
          }
        ]
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
