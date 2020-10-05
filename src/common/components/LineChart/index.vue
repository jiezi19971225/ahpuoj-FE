<template lang="pug">
  #mychart.chart(ref="chart",:id="id")
</template>

<script>
// 引入基本模板
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/radar';
// 引入提示框和图例组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import resize from './mixins/resize';

export default {
  name: 'LineChart',
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'line-chart',
    },
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      handler(val, oldval) {
        this.setOption();
      },
      deep: true,
    },
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.id));
  },
  methods: {
    setOption() {
      const chartOption = {
        color: ['#ffdf25', '#36a9ce'],
        tooltip: {},
        legend: {
          data: this.chartData.map((x) => x.legend),
        },
        grid: {
          left: '20px',
          right: '20px',
        },
        xAxis: {
          type: 'time',
        },
        yAxis: {},
        series: this.chartData.map((x) => ({
          name: x.legend,
          type: 'line',
          data: x.data,
        })),
      };
      this.chart.setOption(chartOption);
    },
  },
};
</script>
<style scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
