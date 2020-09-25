<template lang="pug">
  .content
    title {{contest?`竞赛团队排名 -- ${contest.name} - AHPUOJ`:''}}
    .content__main
      .one-main
        h1.content__panel__title {{contest?`竞赛团队排名 -- ${contest.name}`:""}}
        el-button(style="position:absolute;right:10px;top:10px;",plain,size="small",type="primary",@click="exportExcel") 下载excel
        el-table(size="small",v-if="seeable",:data="tableData",:cell-style="cellStyle")
          el-table-column(label="排名", type="index",min-width="40")
          el-table-column(label="团队名",min-width="160",prop="team.name")
          el-table-column( label="总通过",min-width="70",prop="solved")
          el-table-column(label="总罚时", min-width="100")
            template(slot-scope="scope") {{secToTimeStr(scope.row.time)}}
          template(v-for="index in contest.problem_count")
            el-table-column(min-width="100")
              template(slot="header" slot-scope="scope")
                router-link(:to="{name:'contestProblem',params:{id:contest.id,num:scope.$index - problemColumnIOffset + 1}}") {{engNum(scope.$index - problemColumnIOffset + 1)}}
              template(slot-scope="scope") {{calcProblemStatus(scope.row,index)}}
        p(v-else) {{reason}}
</template>

<script>
import { getContestTeamRankList } from 'user/api/nologin';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';

export default {
  data() {
    return {
      problemColumnIOffset: 4,
      tableData: [],
      contest: null,
      timer: 0,
      seeable: false,
      reason: '',
    };
  },
  mounted() {
    this.fetctContestTeamRankList();
    // 每隔1分钟拉取一次数据
    const timer = setInterval(() => {
      this.fetctContestTeamRankList();
    }, 60000);
    this.$on('hook:beforeDestroy', () => {
      clearInterval(timer);
    });
  },
  methods: {
    async fetctContestTeamRankList() {
      this.loading = true;
      try {
        const res = await getContestTeamRankList(this.$route.params.id);
        console.log(res);
        const { data } = res;
        this.tableData = data.teamranklist;
        this.seeable = data.seeable;
        this.reason = data.reason;
        this.contest = data.contest;
      } catch (err) {
        this.$router.replace({ name: '404Page' });
        console.log(err);
      }
    },
    calcProblemStatus(row, index) {
      let res = '';
      if (row.ac_time[index - 1] > 0) {
        res += this.secToTimeStr(row.ac_time[index - 1]);
        res += `(${row.ac_count[index - 1]})`;
      }
      if (row.wa_count[index - 1] > 0) {
        res += `(-${row.wa_count[index - 1]})`;
      }
      return res;
    },
    cellStyle({
      row, column, rowIndex, columnIndex,
    }) {
      // 从题目的列开始计算 这一段算法照搬的hustoj的
      if (columnIndex >= this.problemColumnIOffset) {
        if (row.ac_time[columnIndex - this.problemColumnIOffset] > 0) {
          let aa = 0x33 + row.wa_count[columnIndex - this.problemColumnIOffset] * 32;
          aa = aa > 0xaa ? 0xaa : aa;
          aa = aa.toString(16);
          const bgColor = `${aa}ff${aa}`;
          return `background:#${bgColor};`;
        } if (row.wa_count[columnIndex - this.problemColumnIOffset] > 0) {
          let aa = 0xaa - row.wa_count[columnIndex - this.problemColumnIOffset] * 10;
          aa = aa > 16 ? aa : 16;
          aa = aa.toString(16);
          const bgColor = `ff${aa}${aa}`;
          return `background:#${bgColor};`;
        }
      }
    },
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
        `${this.contest.name}团队排名.xlsx`,
      );
    } catch (e) {
      if (typeof console !== 'undefined') console.log(e, wbout);
    }
    return wbout;
  },
};
</script>
