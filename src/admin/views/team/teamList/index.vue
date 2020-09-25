<template lang="pug">
.admin-content
  table-tools
      template(#tool)
        el-button(icon="el-icon-plus", @click="handleCreateTeam") 新建
      template(#search)
        el-input(placeholder="搜索团队名称", style="max-width:20em", v-model="queryParam", @keyup.enter.native="handleSearchByParam",maxlength="20", clearable)
          el-button(slot="append",icon="el-icon-search",@click="handleSearchByParam")
  .content__table__wrapper
    el-table(:data="tableData", style="width:100%;", v-loading="loading",border)
      el-table-column(label="ID", prop="id", width="180")
      el-table-column(label="团队名称", prop="name")
        template(slot-scope="scope")
          router-link(:to="{name:'adminTeamManage',params:{id:scope.row.id}}")
            el-link(type="primary") {{scope.row.name}}
      el-table-column(label="创建者", width="180")
       template(slot-scope="scope")
          a(:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.username}}
      el-table-column(label="操作", width="240")
        template(slot-scope="scope")
          el-button(size="mini", type="primary" @click="$router.push({name:'adminTeamManage',params:{id:scope.row.id}})") 管理
          el-button(size="mini", @click="handleEditTeam(scope.row)") 编辑
          el-button(size="mini", type="danger", @click="handleDeleteTeam(scope.row)") 删除
  .content__pagination__wrapper
    Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
  el-dialog(:title="dialogFormTitle",:visible.sync="dialogFormVisible",@closed="closeDialog",@opened="openDialog",width="400px",:close-on-click-modal="false")
    el-form(:model="form" ref="form" :rules="rules" @submit.native.prevent)
      el-form-item(label="团队名称", prop="name")
        el-input(v-model="form.name", ref="input", autocomplete="off", @keyup.enter.native="submit")
    .dialog-footer(slot="footer")
      el-button(@click="cancel") 取消
      el-button(type="primary", native-type="submit", @click="submit") 确定
</template>

<script>
import {
  getTeamList,
  createTeam,
  editTeam,
  deleteTeam,
} from 'admin/api/team';
import Paginator from 'admin/components/Paginator/index.vue';

export default {
  name: 'adminTeamList',
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
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入团队名称',
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
      try {
        const res = await getTeamList(
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
      console.log(this.perpage);
      this.fetchDataList();
    },
    openDialog() {
      this.$refs.form.clearValidate();
      this.$refs.input.focus();
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.input.blur();
      this.form.name = '';
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res;
            if (this.submitMode === 'create') {
              await createTeam(this.form);
            } else {
              await editTeam(this.currentRowId, this.form);
            }
            this.fetchDataList();
            this.dialogFormVisible = false;
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    handleCreateTeam() {
      this.dialogFormTitle = '新建团队';
      this.submitMode = 'create';
      this.dialogFormVisible = true;
    },
    handleEditTeam(row) {
      this.dialogFormTitle = '编辑团队';
      this.submitMode = 'edit';
      this.currentRowId = row.id;
      this.form.name = row.name;
      this.dialogFormVisible = true;
    },
    async handleDeleteTeam(row) {
      try {
        await this.$confirm(`确认要删除团队${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          const res = await deleteTeam(row.id);
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
