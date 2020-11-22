export default {
  color: ['#ffdf25', '#36a9ce'],
  tooltip: {},
  legend: {
    data: ['累计通过', '累计提交'],
  },
  grid: {
    left: '20px',
    right: '20px',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {},
  series: [
    {
      name: '累计通过',
      type: 'line',
      data: [],
    },
    {
      name: '累计提交',
      type: 'line',
      data: [],
    },
  ],
};
