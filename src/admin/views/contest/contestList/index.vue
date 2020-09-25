<template lang="pug">
.admin-content
  table-tools
    template(#tool)
      router-link(:to="{name:'adminAddContest'}")
        el-button(icon="el-icon-plus") 新建
    template(#search)
      el-input(placeholder="搜索竞赛&作业名称", style="max-width:20em", v-model="queryParam", @keyup.enter.native="handleSearchByParam",maxlength="20", clearable)
        el-button(slot="append",icon="el-icon-search",@click="handleSearchByParam")
  .content__table__wrapper
    el-table(:data="tableData" style="width: 100%", v-loading="loading",border)
      el-table-column(label="ID", prop="id", width="180")
      el-table-column(label="名称",min-width="300")
        template(slot-scope="scope")
          a(:href="`/contest/${scope.row.id}`" target="_blank") {{scope.row.name}}
      el-table-column(label="状态", width="240")
        template(slot-scope="scope")
          el-tag(:type="scope.row.defunct == 0 ? 'success':'danger'",effect="dark") {{scope.row.defunct == 0?'启用':'保留'}}
          el-tag(:type="scope.row.private == 0 ? 'success':'danger'",effect="dark") {{scope.row.private == 0?'公开':'私有'}}
          el-tag(:type="scope.row.team_mode == 0 ? 'success':'primary'",effect="dark") {{scope.row.team_mode == 0?'个人':'团队'}}
      el-table-column(label="创建者", width="180")
       template(slot-scope="scope")
          a(:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.username}}
      el-table-column(label="操作", width="400")
        template(slot-scope="scope")
          el-button(size="mini", type="primary", @click="$router.push({name:'adminEditContest',params:{id:scope.row.id}})") 编辑
          el-button(size="mini", type="primary", @click="openDownloadRecordDialog(scope.row)") 记录下载
          el-button(size="mini", @click="$router.push({name: (scope.row.team_mode == 0)? 'adminContestManage':'adminContestTeamManage' ,params:{id:scope.row.id}})", :disabled="scope.row.private == 0") 人员
          el-button(size="mini", :type="scope.row.defunct == 0?'danger':'success'", @click="handleToggleContestStatus(scope.row)") {{scope.row.defunct == 0?'保留':'启用'}}
          el-button(size="mini", type="danger", @click="handleDeleteContest(scope.row)") 删除
  .content__pagination__wrapper
    Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
  el-dialog(title="下载提交记录",:visible.sync="dialogVisible",width="30%")
    p.mb20 {{currentContest && currentContest.name}}
    el-form
      el-form-item(label="题号")
        el-select(v-model="problemNum")
          el-option(v-for="(item,index) in problemList",:label="item",:value="index+1")
    span(slot="footer",class="dialog-footer")
      a(:href="downloadUrl" download style="margin-right:10px;")
        el-button(type="success") 下载
</template>

<script>
import {
  getContestList,
  getContest,
  deleteContest,
  toggleContestStatus,
} from 'admin/api/contest';

import { apiPort } from 'common/const';
import Paginator from 'admin/components/Paginator/index.vue';

export default {
  name: 'adminContestList',
  components: { Paginator },
  data() {
    return {
      currentContest: null,
      problemNum: 1,
      dialogVisible: false,
      loading: true,
      currentPage: 1,
      currentRowId: 0,
      perpage: 10,
      total: 0,
      queryParam: '',
      tableData: [],
    };
  },
  computed: {
    problemList() {
      if (!this.currentContest) {
        return [];
      }
      const { length } = this.currentContest.problems.split(',');
      return Array.from({ length }).map((v, index) => this.engNum(index + 1));
    },
    downloadUrl() {
      if (!this.currentContest) {
        return '';
      }
      return `${window.location.protocol}//${window.location.hostname}${apiPort}/api/admin/contest/${this.currentContest.id}/problem/${this.problemNum}/solutions`;
    },
  },
  activated() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      this.loading = true;
      try {
        const res = await getContestList(
          this.currentPage,
          this.perpage,
          this.queryParam,
        );
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
    async handleToggleContestStatus(row) {
      const msg = `确认要${row.defunct === 0 ? '保留' : '启用'}竞赛${
        row.name
      }吗?`;
      try {
        await this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          await toggleContestStatus(row.id);
          row.defunct = 1 - row.defunct;
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      }
    },
    async openDownloadRecordDialog(row) {
      this.problemNum = 1;
      const res = await getContest(row.id);
      this.dialogVisible = true;
      this.currentContest = res.data.contest;
    },
    async handleDeleteContest(row) {
      try {
        await this.$confirm(`确认要删除竞赛${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          await deleteContest(row.id);
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
