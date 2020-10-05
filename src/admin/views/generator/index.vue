<template lang="pug">
.admin-content
  el-row
    el-col(:xs="24" :md="12")
      el-card(class="content__card__item")
        h2(class="content__card__title") 比赛用户账号生成器
        el-form(:model="leftForm", :rules="leftRules", ref="leftForm", label-width="60px")
          el-form-item(label="前缀",prop="prefix")
            el-input(v-model="leftForm.prefix")
          el-form-item(label="数量",prop="number")
            el-input(v-model.number="leftForm.number")
          el-form-item
            el-button(type="primary",@click="submitCompeteAccount") 生成
    el-col(:xs="24" :md="12")
      el-card(class="content__card__item")
        h2(class="content__card__title") 用户账号生成器
        el-alert(title="可以将学生学号从Excel整列复制过来，批量生成用户账号，初始密码默认为123456。" ,type="info",style="margin-bottom:.12rem;")
        el-form(:model="rightForm" :rules="rightRules",ref="rightForm",label-width="70px")
          el-form-item(label="用户名",prop="userList")
            el-input(v-model="rightForm.userList",type="textarea",:rows="12",resize="none")
          el-form-item
            el-button(type="primary",@click="submitUserAccount") 生成
  el-dialog(title="账号列表",:visible.sync="dialogOperatorInfoVisible",:close-on-click-modal="false",width="600px")
    el-row
      el-col(el-col :xs="24" :md="8" class="infolist")
        p(v-for="(item,index) in info" :key="index" class="dialog__info") {{item}}
      el-col(el-col :xs="24" :md="16")
        el-table(:data="tableData")
          el-table-column(property="username",label="用户名",width="150")
          el-table-column(property="password",label="密码")
    .dialog-footer(slot="footer")
      el-button(type="primary",@click="dialogOperatorInfoVisible = false") 确定
  </template>
<script>
import {
  generateCompeteAccount,
  generateUserAccount,
} from 'admin/api/generator';

export default {
  name: 'adminAccountGenerator',
  data() {
    return {
      dialogOperatorInfoVisible: false,
      info: '',
      leftForm: {
        prefix: '',
        number: '',
      },
      leftRules: {
        prefix: [
          {
            required: true,
            message: '请输入前缀',
            trigger: 'blur',
          },
        ],
        number: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'blur',
          },
          {
            type: 'integer',
            min: 0,
            max: 100,
            message: '请输入1-100之间的整数',
            trigger: 'blur',
          },
        ],
      },
      rightForm: {
        userList: '',
      },
      rightRules: {
        userList: [
          {
            required: true,
            message: '请输入用户名列表',
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
    };
  },
  mounted() {},
  methods: {
    submitCompeteAccount() {
      this.info = '';
      this.$refs.leftForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await generateCompeteAccount(this.leftForm);
            this.dialogOperatorInfoVisible = true;
            this.tableData = res.data.users;
            this.info = res.data.info;
            this.$message({
              message: res.data.message,
              type: 'success',
            });
          } catch (err) {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: 'error',
            });
          }
        } else {
          return false;
        }
      });
    },
    submitUserAccount() {
      this.info = '';
      this.$refs.rightForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await generateUserAccount(this.rightForm);
            this.dialogOperatorInfoVisible = true;
            this.tableData = res.data.users;
            this.info = res.data.info;
            this.$message({
              message: res.data.message,
              type: 'success',
            });
          } catch (err) {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: 'error',
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog__info {
  font-size: 16px;
  text-align: left;
  padding: 0.5em;
}
</style>
