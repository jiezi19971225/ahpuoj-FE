<template lang="pug">
.admin-content
  table-tools
    template(#tool)
      el-select(v-model="userType" @change="fetchDataList")
        el-option(label="普通用户",:value="0")
        el-option(label="比赛用户",:value="1")
    template(#search)
      el-input(placeholder="搜索用户名或昵称", style="max-width:20em", v-model="queryParam", @keyup.enter.native="handleSearchByParam",maxlength="20", clearable)
        el-button(slot="append",icon="el-icon-search",@click="handleSearchByParam")
  .content__table__wrapper
    el-table(:data="tableData", style="width:100%;", v-loading="loading",border)
      el-table-column(label="ID", prop="id", width="180")
      el-table-column(label="用户名", width="180")
        template(slot-scope="scope")
          a(:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.username}}
      el-table-column(label="昵称")
        template(slot-scope="scope")
          a(:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.nick}}
      el-table-column(label="状态", width="180")
        template(slot-scope="scope")
          el-tag(:type="scope.row.defunct == 0 ? 'success':'danger'",effect="dark") {{scope.row.defunct == 0?'启用':'禁用'}}
      el-table-column(label="操作", width="180")
        template(slot-scope="scope")
          el-button(size="mini", type="warning", @click="handleChangePass(scope.row)") 修改密码
          el-button(size="mini", :type="scope.row.defunct == 0?'danger':'success'", @click="handleToggleUserStatus(scope.row)") {{scope.row.defunct == 0?'禁用':'启用'}}
  .content__pagination__wrapper
    Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
  el-dialog(title="修改密码", :visible.sync="dialogFormVisible", @closed="closeDialog", @opened="openDialog", width="400px",:close-on-click-modal="false")
    el-form(:model="form", ref="form", :rules="rules", @submit.native.prevent)
      el-form-item(label="新密码", prop="password")
        el-input(v-model="form.password", ref="input", autocomplete="off", @keyup.enter.native="submit")
    .dialog-footer(slot="footer")
      el-button(@click="cancel") 取消
      el-button(type="primary", native-type="submit", @click="submit") 确定
</template>

<script>
import {
  getUserList,
  toggleUserStatus,
  changeUserPass,
} from 'admin/api/user';
import Paginator from 'admin/components/Paginator/index.vue';

export default {
  name: 'adminUserList',
  components: { Paginator },
  data() {
    return {
      loading: true,
      currentPage: 1,
      currentRowId: 0,
      perpage: 10,
      total: 0,
      queryParam: '',
      userType: 0,
      dialogFormVisible: false,
      form: {
        password: '',
      },
      rules: {
        password: [
          {
            required: true,
            message: '请输入新的用户密码',
            trigger: 'blur',
          },
          {
            // 匹配ascii字符
            // eslint-disable-next-line no-control-regex
            pattern: /^[\x00-\xff]+$/,
            message: '密码只能包含ascii字符',
            trigger: 'blur',
          },
          {
            min: 6,
            message: '密码最少为6位',
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
        const res = await getUserList(
          this.currentPage,
          this.perpage,
          this.userType,
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
      this.$refs.input.focus();
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.input.blur();
    },
    handleChangePass(row) {
      this.currentRowId = row.id;
      this.dialogFormVisible = true;
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            await changeUserPass(this.currentRowId, this.form);
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
    async handleToggleUserStatus(row) {
      const msg = `确认要${row.defunct === 0 ? '禁用' : '启用'}用户${
        row.username
      }吗?`;
      try {
        await this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          const res = await toggleUserStatus(row.id);
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
  },
};
</script>

<style lang="scss" scoped>
</style>
