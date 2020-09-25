<template lang="pug">
.admin-content
  table-tools
    template(#tool)
      el-input(v-model="username" @change="fetchDataList",placeholder="请输入被授权用户名",style="width:200px;")
      el-select(v-model="roleId",placeholder="请选择要授予的角色",style="width:200px;")
        el-option(v-for="role in roleList", :key="role.id",:label="role.name",:value="role.id")
      el-button(@click="assignRole",type="primary") 授权
  .content__table__wrapper
    el-table(:data="tableData", style="width:100%;", v-loading="loading",border)
      el-table-column(label="用户ID", prop="id", width="180")
      el-table-column(label="用户名", width="180")
        template(slot-scope="scope")
          a(:href="`/userinfo/${scope.row.id}`",target="_blank") {{scope.row.username}}
      el-table-column(label="角色",prop="role")
      el-table-column(label="操作", width="180")
        template(slot-scope="scope")
          el-button(size="mini", type="warning", @click="unassignRole(scope.row)") 撤销
</template>
<script>
import { getSettings, setSettings } from 'admin/api/settings';
import {
  getRoleList, getAdminList, assignRole, unassignRole,
} from 'admin/api/permission';

export default {
  name: 'adminSetting',
  data() {
    return {
      loading: false,
      username: '',
      roleId: undefined,
      roleList: [],
      tableData: [],
      form: {
        enable_issue: true,
      },
    };
  },
  activated() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      this.loading = true;
      try {
        getRoleList().then((res) => {
          const { data } = res;
          this.roleList = data.data;
        });
        const res = await getAdminList();
        const { data } = res;
        this.tableData = data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async assignRole() {
      if (!this.username) {
        this.$message({
          type: 'error',
          message: '请输入用户名',
        });
        return;
      }
      if (!this.roleId) {
        this.$message({
          type: 'error',
          message: '请选择角色',
        });
        return;
      }
      const postData = {
        username: this.username,
        role_id: this.roleId,
      };
      try {
        await assignRole(postData);
        this.fetchDataList();
      // eslint-disable-next-line no-empty
      } catch (err) {

      }
    },
    async unassignRole(row) {
      const { id } = row;
      const postData = {
        user_id: id,
      };
      try {
        await unassignRole(postData);
        this.fetchDataList();
        // eslint-disable-next-line no-empty
      } catch (err) {

      }
    },
  },
};
</script>
