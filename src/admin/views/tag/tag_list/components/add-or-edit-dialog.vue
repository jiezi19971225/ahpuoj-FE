<template>
  <el-dialog :title="title" :visible.sync="visible" width="400px" :close-on-click-modal="false">
    <el-form :model="form" ref="formRef" :rules="rules" @submit.native.prevent>
      <el-form-item label="标签名称" prop="name">
        <el-input
          v-model="form.name"
          ref="input"
          autocomplete="off"
          @keyup.enter.native="submit"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" native-type="submit" @click="submit" :loading="loading"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script lang="ts">
import * as tagApi from '@admin/api/tagts'
import {
  computed,
  defineComponent,
  inject,
  markRaw,
  reactive,
  Ref,
  ref,
  nextTick,
} from '@vue/composition-api'
import { ElForm } from 'element-ui/types/form.d'

export default defineComponent({
  setup() {
    const formRef = ref<ElForm>()
    const localInfo = ref<Team>()
    const visible = ref(false)
    const loading = ref(false)
    const isEdit = ref(false)
    const form = reactive({
      name: '',
    })
    const rules = markRaw({
      name: [
        {
          required: true,
          message: '请输入标签名称',
          trigger: 'blur',
        },
        {
          max: 20,
          message: '超出长度限制',
          trigger: 'blur',
        },
      ],
    })
    const dataTableRef = inject('dataTableRef') as Ref

    const title = computed(() => {
      return isEdit.value ? '编辑标签' : '新建标签'
    })

    const submit = () => {
      formRef.value.validate(async valid => {
        if (valid) {
          loading.value = true
          try {
            if (isEdit.value) {
              await tagApi.editTag(localInfo.value.id)(form)
            } else {
              await tagApi.createTag(form)
            }
            dataTableRef.value.fetchDataList()
            visible.value = false
          } catch (err) {
            console.log(err)
          } finally {
            loading.value = false
          }
        }
      })
    }

    const cancel = () => {
      visible.value = false
    }

    const showCreate = () => {
      isEdit.value = false
      formRef.value?.resetFields()
      visible.value = true
    }

    const showEdit = info => {
      isEdit.value = true
      formRef.value?.resetFields()
      localInfo.value = info
      visible.value = true
      nextTick(() => {
        form.name = info.name
      })
    }

    return {
      formRef,
      form,
      visible,
      loading,
      rules,
      title,

      showCreate,
      showEdit,
      cancel,
      submit,
    }
  },
})
</script>
