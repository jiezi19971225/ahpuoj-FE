<template lang="pug">
  .content
    .content__main
      .wrapper
        h1.content__panel__title 重设密码
        .steps-wrapper
          el-steps(:active="active",finish-status="success")
            el-step(title="确认账号")
            el-step(title="重设密码")
        .form-wrapper
          el-form(ref="form", :model="form", :rules="formRules",v-if="verifyOK")
              el-form-item(prop="password")
                el-input(v-model="form.password",type="password", placeholder="请输入新密码")
              el-form-item(prop="confirmpassword")
                el-input(v-model="form.confirmpassword",type="password", placeholder="请确认新密码")
              el-form-item
                el-button(type="primary",style="width:100%;",@click="submitResetPass") 重设密码
          p(v-else) token验证失败，无法重设密码
</template>

<script>
import { sendFindPassEmail, verifyResetPassToken, resetPassByToken } from 'user/api/auth';

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.confirmpassword !== '') {
          this.$refs.form.validateField('confirmpassword');
        }
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      verifyOK: false,
      active: 1,
      form: {
        token: '',
        password: '',
        confirmpassword: '',
      },
      formRules: {
        password: [
          {
            validator: validatePassword,
            trigger: 'blur',
          },
          {
            min: 6,
            message: '密码不能少于6个字符',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '密码不能超过20个字符',
            trigger: 'blur',
          },
        ],
        confirmpassword: [
          {
            validator: validateConfirmPassword,
            trigger: 'blur',
          },
          {
            min: 6,
            message: '密码不能少于6个字符',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '密码不能超过20个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  async mounted() {
    try {
      const { token } = this.$route.query;
      const res = await verifyResetPassToken(token);
      this.verifyOK = true;
      this.form.token = token;
    } catch (err) {
      this.$message({
        message: err.response.data.message,
        type: 'error',
      });
    }
  },
  methods: {
    submitResetPass() {
      const self = this;
      self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const res = await resetPassByToken(self.form);
            self.$message({
              message: res.data.message,
              type: 'success',
            });
          } catch (err) {
            console.log(err);
            self.$message({
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
.wrapper {
  background: $--color-level15;
  height: 600px;

  .steps-wrapper {
    padding-top: 30px;
    width: 600px;
    margin: 0 auto;
  }

  .form-wrapper {
    width: 600px;
    margin: 30px auto 0;

    svg {
      margin-left: -5px;
      height: 20px;
    }
  }
}
</style>
