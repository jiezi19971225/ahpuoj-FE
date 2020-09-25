<template lang="pug">
  .content
    title {{contest?`竞赛排名 -- ${contest.name} - AHPUOJ`:''}}
    .content__main
      .one-main
        h1.content__panel__title {{contest?`竞赛排名 -- ${contest.name}`:""}}
        el-button(style="position:absolute;right:10px;top:10px;",plain,size="small",type="primary",@click="exportExcel") 下载excel
        el-table(size="small",v-if="seeable",:data="tableData",:cell-style="cellStyle",:row-style="rowStyle",id="ranktable")
          el-table-column(label="排名", type="index",min-width="40")
          el-table-column(label="用户名",min-width="160")
            template(slot-scope="scope")
                router-link(:to="{name:'userinfo',params:{id:scope.row.user.id}}")  {{scope.row.user.username}}
          el-table-column(label="昵称",min-width="160")
            template(slot-scope="scope")
                router-link(:to="{name:'userinfo',params:{id:scope.row.user.id}}")  {{scope.row.user.nick}}
          el-table-column( label="通过",min-width="70",align="center")
            template(slot-scope="scope")
             a(@click="jumpToContestStatus(scope.row)") {{scope.row.solved}}
          el-table-column(label="罚时", min-width="100")
            template(slot-scope="scope") {{secToTimeStr(scope.row.time)}}
          template(v-if="contest")
            template(v-for="count in contest.problem_count")
              el-table-column(min-width="100")
                template(slot="header" slot-scope="scope")
                  router-link(:to="{name:'contestProblem',params:{id:contest.id,num:scope.$index - problemColumnIOffset + 1}}") {{engNum(scope.$index - problemColumnIOffset + 1)}}
                template(slot-scope="scope") {{calcProblemStatus(scope.row,count)}}
        p(v-else) {{reason}}
</template>

<script>
import { getContestRankList } from 'user/api/nologin';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';

export default {
  data() {
    return {
      problemColumnIOffset: 5,
      tableData: [],
      contest: null,
      timer: 0,
      seeable: false,
      reason: '',
      firstBloods: [],
    };
  },
  mounted() {
    this.fetctContestRankList();
    // 每隔1分钟拉取一次数据
    const timer = setInterval(() => {
      this.fetctContestRankList();
    }, 60000);
    this.$on('hook:beforeDestroy', () => {
      clearInterval(timer);
    });
  },
  methods: {
    async fetctContestRankList() {
      this.loading = true;
      try {
        const res = await getContestRankList(this.$route.params.id);
        const { data } = res;
        this.tableData = data.ranklist;
        this.seeable = data.seeable;
        this.reason = data.reason;
        this.contest = data.contest;

        this.firstBloods = [];
        // 计算每个题目的一血
        this.tableData.forEach((item, i) => {
          item.ac_time.forEach((time, j) => {
            if (time > 0) {
              if (!this.firstBloods[j]) {
                this.firstBloods[j] = {
                  index: i,
                  time,
                };
              } else if (time < this.firstBloods[j].time) {
                this.firstBloods[j].index = i;
                this.firstBloods[j].time = time;
              }
            }
          });
        });
      } catch (err) {
        this.$router.replace({ name: '404Page' });
        console.log(err);
      }
    },
    calcProblemStatus(row, index) {
      let res = '';
      if (row.ac_time[index - 1] > 0) {
        res += this.secToTimeStr(row.ac_time[index - 1]);
      }
      if (row.wa_count[index - 1] > 0) {
        res += `(-${row.wa_count[index - 1]})`;
      }
      return res;
    },
    cellStyle({
      row, column, rowIndex, columnIndex,
    }) {
      const { problemColumnIOffset } = this;
      if (columnIndex >= problemColumnIOffset && this.firstBloods[columnIndex - problemColumnIOffset] && this.firstBloods[columnIndex - problemColumnIOffset].index === rowIndex) {
        return 'background:#CCCCFF;';
      }

      // 从题目的列开始计算 这一段算法照搬的hustoj的
      if (columnIndex >= problemColumnIOffset) {
        if (row.ac_time[columnIndex - problemColumnIOffset] > 0) {
          let aa = 0x33 + row.wa_count[columnIndex - problemColumnIOffset] * 32;
          aa = aa > 0xaa ? 0xaa : aa;
          aa = aa.toString(16);
          const bgColor = `${aa}ff${aa}`;
          return `background:#${bgColor};`;
        } if (row.wa_count[columnIndex - problemColumnIOffset] > 0) {
          let aa = 0xaa - row.wa_count[columnIndex - problemColumnIOffset] * 10;
          aa = aa > 16 ? aa : 16;
          aa = aa.toString(16);
          const bgColor = `ff${aa}${aa}`;
          return `background:#${bgColor};`;
        }
      }
    },
    rowStyle({ row, rowIndex }) {
      if (row.user.username === this.$store.getters.username) {
        return 'background: #f0f9eb;';
      }
    },
    jumpToContestStatus(row) {
      this.$router.push({
        name: 'contestStatus',
        params: { id: this.contest.id },
        query: { nick: row.user.nick },
      });
    },
    exportExcel() {
      /* generate workbook object from table */
      const wb = XLSX.utils.table_to_book(document.querySelector('#ranktable'), {
        raw: true,
      });

      /* get binary string as output */
      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array',
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          `${this.contest.name}个人排名.xlsx`,
        );
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout);
      }
      return wbout;
    },
  },
};
</script>
