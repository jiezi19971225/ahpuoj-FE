<template>
  <div class="content">
    <div class="content__main">
      <div class="one-main">
        <h1 class="content__panel__title">重设密码</h1>
        <div class="steps-wrapper">
          <el-steps :active="1" finish-status="success">
            <el-step title="确认账号"></el-step>
            <el-step title="重设密码"></el-step>
          </el-steps>
        </div>
        <div class="form-wrapper">
          <el-form ref="formRef" :model="form" :rules="formRules" v-if="verifyOK">
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入新密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="confirmpassword">
              <el-input
                v-model="form.confirmpassword"
                type="password"
                placeholder="请确认新密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                @click="submitResetPass"
                :loading="btnLoading"
                >重设密码</el-button
              >
            </el-form-item>
          </el-form>
          <p v-else>token验证失败，无法重设密码</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, reactive, ref } from '@vue/composition-api'
import { useRoute } from 'common/use'
import { ElForm } from 'element-ui/types/form.d'
import * as authApi from '@user/api/authts'

export default defineComponent({
  name: 'resetPass',
  setup() {
    const route = useRoute()
    const formRef = ref<ElForm>()
    const verifyOK = ref(false)
    const btnLoading = ref(false)

    const form = reactive({
      token: '',
      password: '',
      confirmpassword: '',
    })

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (form.confirmpassword !== '') {
          formRef.value.validateField('confirmpassword')
        }
        callback()
      }
    }

    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const formRules = markRaw({
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

    const { token } = route.value.query

    authApi
      .verifyResetPassToken(token)<BaseResponse>()
      .then(() => {
        verifyOK.value = true
        form.token = token as string
      })
      .catch(err => console.log(err))

    const submitResetPass = () => {
      formRef.value.validate(async valid => {
        if (valid) {
          btnLoading.value = true
          try {
            await authApi.resetPassByToken(form)
          } catch (err) {
            console.log(err)
          } finally {
            btnLoading.value = false
          }
        }
      })
    }

    return {
      formRef,
      verifyOK,
      form,
      formRules,
      btnLoading,

      submitResetPass,
    }
  },
})
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
