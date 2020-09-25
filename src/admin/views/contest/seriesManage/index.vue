<template lang="pug">
.admin-content
  .content-header 系列赛名称: {{series&&series.name}} 包含竞赛总数: {{tableData.length}}
  table-tools
    template(#tool)
      el-button(icon="el-icon-plus",@click="handleAdd") 新建
    template(#search)
      el-input(placeholder="搜索竞赛名称", style="max-width:20em", v-model="queryParam", @keyup.enter.native="handleSearchByParam",maxlength="20", clearable)
        el-button(slot="append",icon="el-icon-search",@click="handleSearchByParam")
  .content__table__wrapperborder
    el-table(:data="tableData", style="width:100%;", v-loading="loading",border)
      el-table-column(label="ID", prop="id", width="180")
      el-table-column(label="名称", prop="name", width="180")
      el-table-column(label="模式", min-width="150")
        template(slot-scope="scope")
          el-tag(:type="scope.row.private == 1 ? 'danger':'success'",effect="dark") {{ scope.row.private == 1?"私有赛":"公开赛" }}
          el-tag(:type="scope.row.team_mode == 0 ? 'success':'primary'",effect="dark") {{ scope.row.team_mode == 0?"个人赛":"团体赛" }}
      el-table-column(label="操作", width="180")
        template(slot-scope="scope")
          el-button(size="mini", type="danger", @click="handleDeleteSeriesContest(scope.row)") 删除
  .content__pagination__wrapper
    Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
  el-dialog(title="添加竞赛", :visible.sync="dialogFormVisible", @closed="closeDialog", @opened="openDialog", width="400px",:close-on-click-modal="false")
    el-form(:model="form", ref="form", :rules="rules", @submit.native.prevent)
      el-form-item(label="选择竞赛", prop="contest_id")
        el-select(v-model="form.contest_id",filterable,placeholder="请选择")
          el-option(v-for="item in contestsNotInSeries",:key="item.id",:label="item.name",:value="item.id")
    .dialog-footer(slot="footer")
      el-button(@click="cancel") 取消
      el-button(type="primary", native-type="submit", @click="submit") 确定
</template>

<script>
import {
  getSeriesContestList,
  getSeries,
  addSeriesContest,
  deleteSeriesContest,
} from 'admin/api/series';
import Paginator from 'admin/components/Paginator/index.vue';
import { getAllContests } from 'admin/api/contest';

export default {
  name: 'adminSeriesManage',
  components: { Paginator },
  data() {
    return {
      loading: true,
      currentPage: 1,
      currentRowId: 0,
      perpage: 10,
      queryParam: '',
      total: 0,
      dialogFormVisible: false,
      series: null,
      contests: [],
      form: {
        contest_id: null,
      },
      rules: {
        contest_id: [
          {
            required: true,
            message: '请输入要添加的用户名列表',
            trigger: 'change',
          },
        ],
      },
      tableData: [],
    };
  },
  computed: {
    contestsNotInSeries() {
      return this.contests.filter((x) => !this.tableData.find((y) => y.id === x.id));
    },
  },
  async activated() {
    const { id } = this.$route.params;
    try {
      let res = await getSeries(id);
      this.series = res.data.series;
      this.fetchDataList();
      res = await getAllContests();
      this.contests = res.data.contests;
    } catch (err) {
      this.$store.dispatch('tagsView/delViewByRoute', this.$route);
      this.$router.replace({ name: 'admin404Page' });
      console.log(err);
    }
  },
  methods: {
    async fetchDataList() {
      this.loading = true;
      try {
        const res = await getSeriesContestList(
          this.series.id,
          this.currentPage,
          this.perpage,
          this.queryParam,
        );
        console.log(res);
        const { data } = res;
        this.tableData = data.data;
        this.total = data.total;
        this.currentPage = data.page;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleSearchByParam() {
      this.currentPage = 1;
      this.loading = true;
      this.fetchDataList();
    },
    handleSizeChange(val) {
      this.perpage = val;
      this.fetchDataList();
    },
    openDialog() {
      this.$notify({
        title: '提示',
        message:
          '每一行对应一个竞赛ID，若对应竞赛存在则加入系列赛，否则将忽略。',
        duration: 6000,
      });
    },
    closeDialog() {
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const { id } = this.$route.params;
            const res = await addSeriesContest(id, this.form.contest_id);
            this.fetchDataList();
          } catch (err) {
            console.log(err);
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    handleAdd() {
      this.dialogFormVisible = true;
    },
    async handleDeleteSeriesContest(row) {
      try {
        await this.$confirm(`确认要删除系列赛中的竞赛${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          await deleteSeriesContest(this.series.id, row.id);
          this.fetchDataList();
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
