<template>
  <div class="content">
    <div class="content__main">
      <div class="one-main">
        <h1 class="content__panel__title">账号设置</h1>
        <div class="main__section">
          <h3>昵称设置</h3>
          <p>用户名 {{ $store.getters.username }}</p>
          <el-form
            :inline="true"
            :model="resetNickForm"
            ref="resetNickFormRef"
            :rules="resetNickFormRules"
          >
            <el-form-item label="昵称" prop="nick">
              <el-input
                v-model="resetNickForm.nick"
                @keyup.enter.native="submitResetNick"
                placeholder="请输入昵称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitResetNick" :loading="resetNickLoading"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="main__section">
          <h3>头像设置</h3>
          <oj-avatar-uploader />
        </div>
        <div class="main__section">
          <h3>修改密码</h3>
          <el-form
            :model="resetPasswordForm"
            ref="resetPasswordFormRef"
            :rules="resetPasswordRules"
            style="width: 4rem"
          >
            <el-form-item prop="oldpassword">
              <el-input
                v-model="resetPasswordForm.oldpassword"
                type="password"
                placeholder="请输入原密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="resetPasswordForm.password"
                type="password"
                placeholder="请输入新密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="confirmpassword">
              <el-input
                v-model="resetPasswordForm.confirmpassword"
                type="password"
                placeholder="请确认新密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                @click="submitResetPassword"
                :loading="resetPasswordLoading"
                >重设密码</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// eslint-disable-next-line import/extensions
import { resetNick, resetPassword } from '@user/api/user'
import { reactive, ref } from '@vue/composition-api'
import { useDispatch, useMapState, useMessge } from '@common/use'
import EventBus from '@common/eventbus'
import { ElForm } from 'element-ui/types/form.d'
import AvatarUploader from './components/avatar-upload.vue'

export default {
  components: { 'oj-avatar-uploader': AvatarUploader },
  setup() {
    const dispatch = useDispatch()
    const message = useMessge()
    const states = useMapState({
      user: state => state.user,
    })

    const resetNickFormRef = ref<ElForm>()
    const resetPasswordFormRef = ref<ElForm>()
    const resetNickLoading = ref(false)
    const resetPasswordLoading = ref(false)

    const resetNickForm = reactive({
      nick: '',
    })
    const resetPasswordForm = reactive({
      oldpassword: '',
      password: '',
      confirmpassword: '',
    })

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (resetPasswordForm.confirmpassword !== '') {
          resetNickFormRef.value.validateField('confirmpassword')
        }
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== resetPasswordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const resetNickFormRules = {
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
    }

    const resetPasswordRules = {
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
    }

    if (states.user.username.length === 0) {
      EventBus.$emit('errors', 404)
    }
    resetNickForm.nick = states.user.nick

    const submitResetNick = () => {
      resetNickFormRef.value.validate(async valid => {
        resetNickLoading.value = true
        if (valid) {
          try {
            const res = await resetNick(resetNickForm)
            dispatch('user/UpdateUserInfo', res.data.user)
          } catch (err) {
            console.log(err)
          } finally {
            resetNickLoading.value = false
          }
        } else {
          message({
            message: '昵称不符合要求',
            type: 'error',
          })
          return false
        }
      })
    }
    const submitResetPassword = () => {
      resetPasswordFormRef.value.validate(async valid => {
        resetPasswordLoading.value = true
        if (valid) {
          try {
            const res = await resetPassword(resetPasswordForm)
            dispatch('user/UpdateUserInfo', res.data.user)
          } catch (err) {
            console.log(err)
          } finally {
            resetPasswordLoading.value = false
          }
        } else {
          message({
            message: '请检查输入',
            type: 'error',
          })
          return false
        }
      })
    }

    return {
      resetNickLoading,
      resetPasswordLoading,
      resetNickForm,
      resetNickFormRules: Object.freeze(resetNickFormRules),
      resetPasswordForm,
      resetPasswordRules: Object.freeze(resetPasswordRules),
      resetNickFormRef,
      resetPasswordFormRef,

      submitResetNick,
      submitResetPassword,
    }
  },
}
</script>
