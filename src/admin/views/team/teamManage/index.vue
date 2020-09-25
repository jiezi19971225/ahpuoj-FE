<template lang="pug">
.admin-content
  .content-header 团队名称: {{team && team.name}} 成员总数: {{total}}
  table-tools
    template(#tool)
      el-button(icon="el-icon-plus",@click="handleAdd") 添加
    template(#search)
      el-input(placeholder="用户名或昵称", style="max-width:20em", v-model="queryParam", @keyup.enter.native="handleSearchByParam",maxlength="20", clearable)
        el-button(slot="append",icon="el-icon-search",@click="handleSearchByParam")
  .content__table__wrapper
    el-table(:data="tableData", style="width:100%;", v-loading="loading",border)
      el-table-column(label="ID", prop="id", width="180")
      el-table-column(label="用户名", width="180")
        template(slot-scope="scope")
          el-link(type="primary",:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.username}}
      el-table-column(label="昵称")
        template(slot-scope="scope")
           el-link(type="primary",:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.nick}}
      el-table-column(label="操作", width="180")
        template(slot-scope="scope")
          el-button(size="mini", type="danger", @click="handleDeleteTeamUser(scope.row)") 删除
  .content__pagination__wrapper
    Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
  el-dialog(title="添加团队成员", :visible.sync="dialogFormVisible", @closed="closeDialog", @opened="openDialog", width="400px",:close-on-click-modal="false")
    el-form(:model="form", ref="form", :rules="rules", @submit.native.prevent)
      el-form-item(label="用户名列表", prop="userList")
        el-input(type="textarea", rows="20", v-model="form.userList", ref="input", autocomplete="off",resize="none")
    .dialog-footer(slot="footer")
      el-button(@click="cancel") 取消
      el-button(type="primary", native-type="submit", @click="submit()") 确定
  el-dialog(title="操作信息",:visible.sync="dialogOperatorInfoVisible",:close-on-click-modal="false",width="600px")
      template(v-for="(item,index) in infoList")
        p(:key="index") {{item}}
      .dialog-footer(slot="footer")
        el-button(type="primary",@click="dialogOperatorInfoVisible = false") 确定
</template>

<script>
import {
  getTeamUserList,
  getTeam,
  addTeamUser,
  deleteTeamUser,
} from 'admin/api/team';
import Paginator from 'admin/components/Paginator/index.vue';

export default {
  name: 'adminTeamManage',
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
      dialogOperatorInfoVisible: false,
      infoList: [],
      team: null,
      form: {
        userList: '',
      },
      rules: {
        userList: [
          {
            required: true,
            message: '请输入要添加的用户名列表',
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
    };
  },
  async activated() {
    const { id } = this.$route.params;
    try {
      const res = await getTeam(id);
      this.team = res.data.team;
      this.fetchDataList();
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
        const res = await getTeamUserList(
          this.team.id,
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
      console.log(this.perpage);
      this.fetchDataList();
    },
    openDialog() {
      this.$notify({
        title: '提示',
        message: '每一行对应一个用户名，若对应账号存在则加入团队，否则将忽略。',
        duration: 6000,
      });
      this.$refs.form.clearValidate();
      this.$refs.input.focus();
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.input.blur();
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const { id } = this.$route.params;
            try {
              const res = await addTeamUser(id, this.form);
              this.infoList = res.data.info;
              this.dialogOperatorInfoVisible = true;
              this.fetchDataList();
              this.dialogFormVisible = false;
            } catch (err) {
              console.log(err);
            }
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
    handleAdd() {
      this.dialogFormVisible = true;
    },
    async handleDeleteTeamUser(row) {
      try {
        await this.$confirm(`确认要删除团队成员${row.username}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          await deleteTeamUser(this.team.id, row.id);
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
