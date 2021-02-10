<template>
  <div class="content">
    <div class="content__main">
      <div class="one-main">
        <h1 class="content__panel__title">找回密码</h1>
        <div class="steps-wrapper">
          <el-steps :active="0" finish-status="success">
            <el-step title="确认账号"></el-step>
            <el-step title="重设密码"></el-step>
          </el-steps>
        </div>
        <div class="form-wrapper">
          <el-form ref="formRef" :model="form" :rules="formRules">
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名"> </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                :loading="submitButtonInLoading"
                @click="sendEmail"
              >
                发送确认邮件</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as authApi from '@user/api/authts'
import { defineComponent, markRaw, reactive, ref } from '@vue/composition-api'
import { ElForm } from 'element-ui/types/form.d'

export default defineComponent({
  setup() {
    const formRef = ref<ElForm>()
    const submitButtonInLoading = ref(false)
    const form = reactive({
      username: '',
    })
    const formRules = markRaw({
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
    })

    const sendEmail = () => {
      formRef.value.validate(async valid => {
        if (valid) {
          submitButtonInLoading.value = true
          try {
            await authApi.sendFindPassEmail<BaseResponse>(form)
          } catch (err) {
            console.log(err)
          } finally {
            submitButtonInLoading.value = false
          }
        }
      })
    }

    return {
      formRef,
      form,
      formRules,
      submitButtonInLoading,

      sendEmail,
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
