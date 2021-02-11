<template>
  <el-dialog :title="title" :visible.sync="visible" width="600px" :close-on-click-modal="false">
    <el-alert title="系列赛中只会显示与系列赛模式相同的比赛数据！" :closable="false"></el-alert>
    <el-form :model="form" ref="formRef" :rules="rules" @submit.native.prevent>
      <el-form-item label="系列赛名称" prop="name">
        <el-input v-model="form.name" ref="input" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="系列赛模式" prop="team_mode">
        <el-switch
          v-model="form.team_mode"
          active-text="团队"
          inactive-text="个人"
          inactive-color="#99cc33"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="系列赛描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="5"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" native-type="submit" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  markRaw,
  nextTick,
  reactive,
  Ref,
  ref,
} from '@vue/composition-api'
import { ElForm } from 'element-ui/types/form.d'
import * as seriesApi from '@admin/api/seriests'

export default defineComponent({
  setup() {
    const formRef = ref<ElForm>()
    const localInfo = ref<Series>()
    const visible = ref(false)
    const loading = ref(false)
    const isEdit = ref(false)
    const form = reactive({
      name: '',
      team_mode: 0,
      description: '',
    })
    const rules = markRaw({
      name: [
        {
          required: true,
          message: '请输入系列赛名称',
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
      return isEdit.value ? '编辑系列赛' : '新建系列赛'
    })

    const submit = () => {
      formRef.value.validate(async valid => {
        if (valid) {
          loading.value = true
          try {
            if (isEdit.value) {
              await seriesApi.editSeries(localInfo.value.id)(form)
            } else {
              await seriesApi.createSeries(form)
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
