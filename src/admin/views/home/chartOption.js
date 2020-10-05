export default {
  color: ['#ffdf25', '#36a9ce'],
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['累计提交'],
  },
  grid: {
    left: '20px',
    right: '20px',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: {
    name: '累计提交',
    type: 'line',
    data: [],
  },
};
