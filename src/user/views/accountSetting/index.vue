<template lang="pug">
  .content
    .content__main
      .one-main
        h1.content__panel__title 账号设置
        .main__section
          h3 昵称设置
          p 用户名 {{$store.getters.username}}
          el-form(:inline="true",:model="resetNickForm",ref="resetNickForm",:rules="resetNickFormRules",@submit.native.prevent)
            el-form-item(label="昵称",prop="nick")
              el-input(v-model="resetNickForm.nick",@keyup.enter.native="submitResetNick",placeholder="请输入昵称")
            el-form-item
              el-button(type="primary",@click="submitResetNick") 保存
        .main__section
          h3 头像设置
          .account-setting__img-wrapper
            img.account-setting__avatar(:src="imgUrl($store.getters.userAvatar)")
            a(@click="toggleShow()")
              .img-mask
                p 更换头像
        .main__section
          h3 修改密码
            el-form(:model="resetPasswordForm",ref="resetPasswordForm", :rules="resetPasswordRules",style="width:4rem;")
              el-form-item(prop="oldpassword")
                el-input(v-model="resetPasswordForm.oldpassword",type="password", placeholder="请输入原密码")
              el-form-item(prop="password")
                el-input(v-model="resetPasswordForm.password",type="password", placeholder="请输入新密码")
              el-form-item(prop="confirmpassword")
                el-input(v-model="resetPasswordForm.confirmpassword",type="password", placeholder="请确认新密码")
              el-form-item
                el-button(type="primary",style="width:100%;",@click="submitResetPassword") 重设密码
        //- todo
        //- .main__section
        //-   h3 修改绑定邮箱
    .avatar-upload__wrapper
      avatar-upload(field="img",@crop-upload-success="cropUploadSuccess",@crop-upload-fail="cropUploadFail"
      method="PUT"
      v-model="show"
      :width="200"
      :height="200"
      url="/api/user/avatar"
      :headers="headers"
      :noRotate="false"
      img-format="png")
</template>
<script>
// eslint-disable-next-line import/extensions
import AvatarUpload from 'vue-image-crop-upload';
import { resetNick, resetPassword } from 'user/api/user';

export default {
  components: {
    AvatarUpload,
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.resetPasswordForm.confirmpassword !== '') {
          this.$refs.resetPasswordForm.validateField('confirmpassword');
        }
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.resetPasswordForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      show: false,
      headers: {
        Authorization: '',
      },
      resetNickForm: {
        nick: '',
      },
      // problemId: null,
      resetNickFormRules: {
        nick: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 20,
            message: '超出长度限制',
            trigger: 'blur',
          },
        ],
      },
      resetPasswordForm: {
        oldpassword: '',
        password: '',
        confirmpassword: '',
      },
      resetPasswordRules: {
        oldpassword: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur',
          },
        ],
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
  mounted() {
    if (this.$store.getters.username.length === 0) {
      this.$router.replace({ name: '404Page' });
    }
    this.headers.Authorization = this.$store.getters.token;
    this.resetNickForm.nick = this.$store.getters.userNick;
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    cropUploadSuccess(res, field) {
      this.$store.dispatch('user/UpdateUserAvatar', res.url);
      this.$message({
        message: '更新头像成功',
        type: 'success',
      });
    },
    cropUploadFail(status, field) {
      this.$message({
        message: '更新头像失败',
        type: 'success',
      });
    },
    submitResetNick() {
      this.$refs.resetNickForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await resetNick(this.resetNickForm);
            this.$store.dispatch('user/UpdateUserInfo', res.data.user);
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$message({
            message: '昵称不符合要求',
            type: 'error',
          });
          return false;
        }
      });
    },
    submitResetPassword() {
      this.$refs.resetPasswordForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await resetPassword(this.resetPasswordForm);
            this.$store.dispatch('user/UpdateUserInfo', res.data.user);
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$message({
            message: '请检查输入',
            type: 'error',
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.one-main {
  .account-setting__img-wrapper {
    position: relative;

    .account-setting__avatar {
      height: 2rem;
      width: 2rem;
      border-radius: 1.5rem;
      border: 0.03rem solid $--color-level15;
    }

    .img-mask {
      text-align: center;
      line-height: 2rem;
      font-size: 0.2rem;
      position: absolute;
      left: 0;
      top: 0;
      height: 2rem;
      width: 2rem;
      border: 0.03rem solid $--color-level15;
      color: $--color-level15;
      background: rgba($color: $--color-level3, $alpha: 0.5);
      opacity: 0;
      transition: all 0.3s;
      border-radius: 1.5rem;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
