<template lang="pug">
  .content
    .content__main
      .one-main
        h1.content__panel__title 找回密码
        .steps-wrapper
          el-steps(:active="active",finish-status="success")
            el-step(title="确认账号")
            el-step(title="重设密码")
        .form-wrapper
          el-form(ref="form", :model="form", :rules="formRules")
            el-form-item(prop="email")
              el-input(v-model="form.email", placeholder="请输入绑定邮箱地址")
                svg-icon(slot="prefix", name="email", class="auth__input__prefix")
            el-form-item
              el-button(type="primary",style="width:100%;",:disabled="submitButtonDisabled",:loading="submitButtonInLoading",@click="sendEmail")   发送确认邮件
</template>

<script>
import { sendFindPassEmail } from 'user/api/auth';
import { throttle, debounce } from 'throttle-debounce';

export default {
  data() {
    return {
      submitButtonInLoading: false,
      submitButtonDisabled: false,
      active: 0,
      form: {
        email: '',
      },
      formRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    sendEmail: debounce(500, function debounced() {
      this.submitButtonDisabled = true;
      this.submitButtonInLoading = true;
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const res = await sendFindPassEmail(this.form);
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
          } finally {
            this.submitButtonDisabled = false;
            this.submitButtonInLoading = false;
          }
        } else {
          this.submitButtonDisabled = false;
          this.submitButtonInLoading = false;
          return false;
        }
      });
    }),
  },
};
</script>

<style lang="scss" scoped>
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
</style>
