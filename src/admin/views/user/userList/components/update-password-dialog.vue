<template>
  <el-dialog title="修改密码" :visible.sync="visible" width="400px" :close-on-click-modal="false">
    <el-form :model="form" ref="formRef" :rules="rules" @submit.native.prevent>
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password"
          ref="input"
          autocomplete="off"
          @keyup.enter.native="submit"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" native-type="submit" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import * as userApi from '@admin/api/userts'
import { defineComponent, markRaw, reactive, ref } from '@vue/composition-api'
import { ElForm } from 'element-ui/types/form.d'

export default defineComponent({
  setup() {
    const formRef = ref<ElForm>()
    const localInfo = ref<User>()
    const visible = ref(false)
    const form = reactive({
      password: '',
    })

    const rules = markRaw({
      password: [
        {
          required: true,
          message: '请输入新的用户密码',
          trigger: 'blur',
        },
        {
          // 匹配ascii字符
          // eslint-disable-next-line no-control-regex
          pattern: /^[\x00-\xff]+$/,
          message: '密码只能包含ascii字符',
          trigger: 'blur',
        },
        {
          min: 6,
          message: '密码最少为6位',
          trigger: 'blur',
        },
        {
          max: 20,
          message: '超出长度限制',
          trigger: 'blur',
        },
      ],
    })

    const submit = () => {
      formRef.value.validate(async valid => {
        if (valid) {
          try {
            await userApi.changeUserPass(localInfo.value.id)(form)
            visible.value = false
          } catch (err) {
            console.log(err)
          }
        }
      })
    }

    const cancel = () => {
      visible.value = false
    }

    const show = info => {
      formRef.value?.resetFields()
      localInfo.value = info
      visible.value = true
    }

    return {
      formRef,
      form,
      visible,
      rules,

      show,
      cancel,
      submit,
    }
  },
})
</script>
