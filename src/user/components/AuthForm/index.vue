import { reactive } from '@vue/composition-api'
<template>
  <el-dialog
    :visible.sync="authDialogVisible"
    width="5rem"
    :close-on-click-modal="false"
    custom-class="auth__dialog__wrapper"
  >
    <div class="auth__dialog">
      <div class="title" slot="header">
        <span :class="[method == 'login' ? 'active' : '']" @click="method = 'login'">登 录</span
        ><span :class="[method == 'register' ? 'active' : '']" @click="method = 'register'"
          >注 册</span
        >
      </div>
      <el-form
        v-show="method === 'login'"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        key="login"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <svg-icon class="auth__input__prefix" slot="prefix" name="user"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
            <svg-icon class="auth__input__prefix" slot="prefix" name="password"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
        </el-form-item>
        <router-link :to="{ name: 'findpass' }" target="_blank">忘记密码？点击找回</router-link>
      </el-form>
      <el-form
        v-show="method === 'register'"
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerFormRules"
        key="register"
      >
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱">
            <svg-icon class="auth__input__prefix" slot="prefix" name="email"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名">
            <svg-icon class="auth__input__prefix" slot="prefix" name="user"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item prop="nick">
          <el-input v-model="registerForm.nick" placeholder="请输入昵称">
            <svg-icon class="auth__input__prefix" slot="prefix" name="user"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码">
            <svg-icon class="auth__input__prefix" slot="prefix" name="password"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmpassword">
          <el-input v-model="registerForm.confirmpassword" type="password" placeholder="请确认密码">
            <svg-icon class="auth__input__prefix" slot="prefix" name="password"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { markRaw, reactive, ref, nextTick } from '@vue/composition-api'
import { ElForm } from 'element-ui/types/form.d'
import EventBus from '@common/eventbus'
import { useDispatch, useMessge, useRouter } from '@common/use'

export default {
  setup() {
    const defaultLoginForm = {
      username: '',
      password: '',
    }
    const defaultRegisterForm = {
      email: '',
      username: '',
      nick: '',
      password: '',
      confirmpassword: '',
    }

    const dispatch = useDispatch()
    const router = useRouter()

    const authDialogVisible = ref(false)
    const showDropDownMenu = ref(false)
    const loginFormRef = ref<ElForm>()
    const registerFormRef = ref<ElForm>()
    const method = ref('login')

    const loginForm = reactive({
      ...defaultLoginForm,
    })
    const registerForm = reactive({
      ...defaultRegisterForm,
    })

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (registerForm.confirmpassword !== '') {
          registerFormRef.value.validateField('confirmpassword')
        }
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const loginFormRules = markRaw({
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
      ],
    })
    const registerFormRules = markRaw({
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
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
        {
          max: 20,
          message: '用户名不能超过20个字符',
          trigger: 'blur',
        },
        {
          pattern: /^[a-zA-Z0-9]+$/,
          message: '用户名只能包含英文和数字字符',
          trigger: 'blur',
        },
      ],
      nick: [
        {
          required: true,
          message: '请输入用户昵称',
          trigger: 'blur',
        },
        {
          max: 20,
          message: '昵称不能超过20个字符',
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
    })

    EventBus.$on('goLogin', () => {
      method.value = 'login'
      loginFormRef.value?.resetFields()
      registerFormRef.value?.resetFields()
      authDialogVisible.value = true
    })

    const submitLogin = () => {
      loginFormRef.value.validate(async valid => {
        if (valid) {
          try {
            const res = await dispatch('user/Login', loginForm)
            authDialogVisible.value = false
            showDropDownMenu.value = false
            dispatch('user/GetUserInfo')
            router.replace({ name: 'refresh' })
          } catch (err) {
            console.log(err)
          }
        } else {
          return false
        }
      })
    }

    const submitRegister = () => {
      registerFormRef.value.validate(async valid => {
        if (valid) {
          try {
            const res = await dispatch('user/Register', registerForm)
            console.log(res)
            authDialogVisible.value = false
            showDropDownMenu.value = false
            dispatch('user/GetUserInfo')
          } catch (err) {
            console.log(err)
          }
        } else {
          return false
        }
      })
    }

    return {
      method,
      authDialogVisible,
      showDropDownMenu,
      loginFormRef,
      registerFormRef,
      loginForm,
      loginFormRules,
      registerForm,
      registerFormRules,

      submitLogin,
      submitRegister,
    }
  },
}
</script>

<style lang="scss" scoped>
.auth__dialog {
  border-radius: 10px;

  .title {
    text-align: left;
    margin-bottom: 0.1rem;
    padding-left: 0.1rem;
    color: $--color-blue;
    font-size: 24px;

    span {
      cursor: pointer;
      color: $--color-level10;
      border-bottom: 4px solid $--color-level12;
    }

    span.active {
      color: $--color-blue;
      border-bottom: 4px solid $--color-blue;
    }
  }

  .auth__input__prefix {
    height: 100%;
    line-height: 100%;
    width: 20px;
  }
}
</style>
