<template lang="pug">
.admin-content
  table-tools
    template(#tool)
      el-button(icon="el-icon-plus",@click="handleCreateSeries") 新建
    template(#search)
      el-input(placeholder="搜索系列赛名称", style="max-width:20em", v-model="queryParam", @keyup.enter.native="handleSearchByParam",maxlength="20", clearable)
        el-button(slot="append",icon="el-icon-search",@click="handleSearchByParam")
  .content__table__wrapper
    el-table(:data="tableData" style="width: 100%", v-loading="loading",border)
      el-table-column(label="ID", prop="id", width="180")
      el-table-column(label="名称", prop="name", min-width="300")
      el-table-column(label="状态", width="240")
        template(slot-scope="scope")
          el-tag(:type="scope.row.defunct == 0 ? 'success':'danger'",effect="dark") {{scope.row.defunct == 0?'启用':'保留'}}
          el-tag(:type="scope.row.team_mode == 0 ? 'success':'primary'",effect="dark") {{scope.row.team_mode == 0?'个人':'团队'}}
      el-table-column(label="创建者", width="180")
       template(slot-scope="scope")
          a(:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.username}}
      el-table-column(label="操作", width="300")
        template(slot-scope="scope")
          el-button(size="mini", type="primary", @click="$router.push({name:'adminSeriesManage',params:{id:scope.row.id}})") 管理
          el-button(size="mini", type="primary", @click="handleEditSeries(scope.row)") 编辑
          el-button(size="mini", :type="scope.row.defunct == 0?'danger':'success'", @click="handleToggleSeriesStatus(scope.row)") {{scope.row.defunct == 0?'保留':'启用'}}
          el-button(size="mini", type="danger", @click="handleDeleteSeries(scope.row)") 删除
  .content__pagination__wrapper
    Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
  el-dialog(:title="dialogFormTitle",:visible.sync="dialogFormVisible",@closed="closeDialog",@opened="openDialog",width="600px",:close-on-click-modal="false")
    el-form(:model="form", ref="form" :rules="rules", @submit.native.prevent)
      el-form-item(label="系列赛名称", prop="name")
        el-input(v-model="form.name", ref="input", autocomplete="off")
      el-form-item(label="系列赛模式", prop="team_mode")
        el-switch(v-model="form.team_mode", active-text="团队", inactive-text="个人", inactive-color="#99cc33", :active-value="1", :inactive-value="0")
      el-form-item(label="系列赛描述", prop="description")
        el-input(v-model="form.description", type="textarea", :rows="5", autocomplete="off")
    .dialog-footer(slot="footer")
      el-button(@click="cancel") 取消
      el-button(type="primary", native-type="submit", @click="submit") 确定
</template>

<script>
import {
  getSeriesList,
  createSeries,
  deleteSeries,
  editSeries,
  toggleSeriesStatus,
} from 'admin/api/series';
import Paginator from 'admin/components/Paginator/index.vue';

export default {
  name: 'adminSeriesList',
  components: { Paginator },
  data() {
    return {
      loading: true,
      currentPage: 1,
      currentRowId: 0,
      perpage: 10,
      queryParam: '',
      total: 0,
      dialogFormTitle: '',
      dialogFormVisible: false,
      submitMode: '',
      form: {
        name: '',
        team_mode: 0,
        description: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入系列赛名称',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '超出长度限制',
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
    };
  },
  activated() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      this.loading = true;
      try {
        const res = await getSeriesList(
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
    openDialog() {
      this.$notify({
        title: '提示',
        message: '系列赛中只会显示与系列赛模式相同的比赛数据！',
        duration: 6000,
      });
      this.$refs.form.clearValidate();
      this.$refs.input.focus();
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.input.blur();
      this.form.name = '';
      this.form.description = '';
      this.form.team_mode = 0;
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            if (this.submitMode === 'create') {
              await createSeries(this.form);
            } else {
              await editSeries(this.currentRowId, this.form);
            }
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
    handleCreateSeries() {
      this.dialogFormTitle = '新建系列赛';
      this.submitMode = 'create';
      this.dialogFormVisible = true;
    },
    handleEditSeries(row) {
      this.dialogFormTitle = '编辑系列赛';
      this.submitMode = 'edit';
      this.currentRowId = row.id;
      this.form.name = row.name;
      this.form.description = row.description;
      this.form.team_mode = row.team_mode;
      this.dialogFormVisible = true;
    },
    async handleToggleSeriesStatus(row) {
      const msg = `确认要${row.defunct === 0 ? '保留' : '启用'}系列赛${
        row.name
      }吗?`;
      try {
        await this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          await toggleSeriesStatus(row.id);
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
    async handleDeleteSeries(row) {
      try {
        await this.$confirm(`确认要删除系列赛${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          await deleteSeries(row.id);
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
