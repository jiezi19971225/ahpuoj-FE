<template lang="pug">
.admin-content
  .content-header 竞赛名称: {{contest && contest.name}} 团队总数: {{contestTeamList.length}}
  table-tools
    template(#tool)
      el-button(icon="el-icon-plus",@click="handleAdd") 添加

  el-collapse(v-model="activeNames")
    template(v-for="item,index in contestTeamList")
      el-collapse-item(:title="item.name",:name="item.name")
        .content__button__wrapper
          el-button(type="success", size="small",@click="handleAddContestTeamUsers(item)") 添加成员
          el-button(type="primary", size="small",@click="handleAddContestTeamAllUsers(item)") 添加全部成员
          el-button(type="danger", size="small",@click="handleDeleteContestTeam(item)") 删除团队
        el-table(:data="item.userinfos", style="width:100%;")
          el-table-column(label="ID", prop="id", width="180")
          el-table-column(label="用户名", prop="username", width="180")
          el-table-column(label="昵称", prop="nick")
          el-table-column(label="操作", width="180")
            template(slot-scope="scope")
              el-button(size="mini", type="danger", @click="handleDeleteContestTeamUser(item,scope.row)") 删除

  el-dialog(title="添加团队",:visible.sync="dialogAddTeamFormVisible", @closed="closeAddTeamDialog",width="400px",:close-on-click-modal="false")
    el-form(:model="addTeamForm", ref="addTeamForm", :rules="addTeamFormRules", @submit.native.prevent)
      el-form-item(label="选择团队", prop="team_id")
        el-select(v-model="addTeamForm.team_id",filterable,placeholder="请选择")
          el-option(v-for="item in unSelectedTeams",:key="item.id",:label="item.name",:value="item.id")
    .dialog-footer(slot="footer")
      el-button(@click="cancelDialogAddTeam") 取消
      el-button(type="primary", native-type="submit", @click="submitAddTeam") 确定

  el-dialog(title="添加团队成员", :visible.sync="dialogAddTeamUserFormVisible", @closed="closeAddTeamUserDialog", @opened="openAddTeamUserDialog", width="400px",:close-on-click-modal="false")
    el-form(:model="addTeamUserForm", ref="addTeamUserForm", :rules="addTeamUserFormRules", @submit.native.prevent)
      el-form-item(label="用户名列表", prop="userList")
        el-input(type="textarea", rows="20", v-model="addTeamUserForm.userList", ref="input", autocomplete="off",resize="none")
    .dialog-footer(slot="footer")
      el-button(@click="cancelDialogAddTeamUser") 取消
      el-button(type="primary", native-type="submit", @click="submitAddTeamUsers") 确定

  el-dialog(title="操作信息",:visible.sync="dialogOperatorInfoVisible",:close-on-click-modal="false",width="600px")
    template(v-for="(item,index) in infoList")
      p(:key="index") {{item}}
    .dialog-footer(slot="footer")
      el-button(type="primary",@click="dialogOperatorInfoVisible = false") 确定
</template>

<script>
import {
  getContestTeams,
  getContest,
  addContestTeam,
  addContestTeamUsers,
  addContestTeamAllUsers,
  deleteContestTeam,
  deleteContestTeamUser,
} from 'admin/api/contest';

import { getAllTeams } from 'admin/api/team';

export default {
  name: 'adminContestTeamManage',
  data() {
    return {
      dialogAddTeamFormVisible: false,
      dialogAddTeamUserFormVisible: false,
      dialogOperatorInfoVisible: false,
      contest: null,
      teams: [],
      currentTeam: null,
      activeNames: [],
      contestTeamList: [],
      infoList: [],
      addTeamForm: {
        team_id: null,
      },
      addTeamUserForm: {
        userList: '',
      },
      addTeamFormRules: {
        team_id: [
          {
            required: true,
            message: '请选择要添加的团队',
            trigger: 'change',
          },
        ],
      },
      addTeamUserFormRules: {
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
      getAllTeams().then((res) => {
        this.teams = res.data.teams;
      });
      const res = await getContest(id);
      this.contest = res.data.contest;
      this.fetchDataList();
    } catch (err) {
      this.$store.dispatch('tagsView/delViewByRoute', this.$route);
      this.$router.replace({ name: 'admin404Page' });
      console.log(err);
    }
  },
  computed: {
    unSelectedTeams() {
      return this.teams.filter((x) => !this.contestTeamList.find((y) => x.id === y.id));
    },
  },
  methods: {
    async fetchDataList() {
      this.loading = true;
      try {
        const res = await getContestTeams(this.contest.id);
        this.contestTeamList = res.data.data;
        // 默认全部展开面板
        this.contestTeamList.forEach((val) => {
          this.activeNames.push(val.name);
        });
      } catch (err) {
        console.log(err);
      }
    },
    closeAddTeamDialog() {
      this.$refs.addTeamForm.resetFields();
    },
    openAddTeamUserDialog() {
      this.$notify({
        title: '提示',
        message:
          '每一行对应一个用户名，若对应账号属于该团队并且没有以其他团队成员参与该竞赛则加入，否则将忽略。',
        duration: 6000,
      });
    },
    closeAddTeamUserDialog() {
      this.$refs.addTeamUserForm.resetFields();
    },
    submitAddTeam() {
      this.$refs.addTeamForm.validate(async (valid) => {
        if (valid) {
          try {
            const { id } = this.$route.params;
            await addContestTeam(id, this.addTeamForm.team_id);
            this.fetchDataList();
            this.dialogAddTeamFormVisible = false;
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    submitAddTeamUsers() {
      this.$refs.addTeamUserForm.validate(async (valid) => {
        if (valid) {
          try {
            const { id } = this.$route.params;
            const res = await addContestTeamUsers(
              id,
              this.currentTeam.id,
              this.addTeamUserForm,
            );
            this.infoList = res.data.info;
            this.dialogOperatorInfoVisible = true;
            this.fetchDataList();
          } catch (err) {
            console.log(err);
          }
          this.dialogAddTeamUserFormVisible = false;
        } else {
          return false;
        }
      });
    },
    cancelDialogAddTeam() {
      this.dialogAddTeamFormVisible = false;
    },
    cancelDialogAddTeamUser() {
      this.dialogAddTeamUserFormVisible = false;
    },
    handleAdd() {
      this.dialogAddTeamFormVisible = true;
    },
    handleAddContestTeamUsers(team) {
      this.currentTeam = team;
      this.dialogAddTeamUserFormVisible = true;
    },
    async handleAddContestTeamAllUsers(team) {
      try {
        await this.$confirm(`确认要添加团队${team.name}的全部成员吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          const res = await addContestTeamAllUsers(this.contest.id, team.id);
          this.infoList = res.data.info;
          this.dialogOperatorInfoVisible = true;
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
    async handleDeleteContestTeam(team) {
      try {
        await this.$confirm(`确认要删除团队${team.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          await deleteContestTeam(this.contest.id, team.id);
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
    async handleDeleteContestTeamUser(team, row) {
      try {
        await this.$confirm(
          `确认要删除团队${team.name}中成员${row.username}吗?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        );
        try {
          await deleteContestTeamUser(
            this.contest.id,
            team.id,
            row.id,
          );
          this.fetchDataList();
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
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
