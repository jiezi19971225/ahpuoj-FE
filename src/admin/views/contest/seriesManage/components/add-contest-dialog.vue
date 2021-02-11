<template>
  <el-dialog title="添加竞赛" :visible.sync="visible" width="500px" :close-on-click-modal="false">
    <el-form :model="form" ref="formRef" :rules="rules" @submit.native.prevent>
      <el-form-item label="选择竞赛" prop="contest_id">
        <el-select
          v-model="form.contest_id"
          filterable="filterable"
          placeholder="请选择"
          style="width: 350px"
        >
          <el-option
            v-for="item in contests"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" native-type="submit" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import * as seriesApi from '@admin/api/seriests'
import * as contestApi from '@admin/api/contestts'
import { defineComponent, inject, markRaw, reactive, Ref, ref } from '@vue/composition-api'
import { useRoute } from '@common/use'
import { ElForm } from 'element-ui/types/form.d'

export default defineComponent({
  setup() {
    const route = useRoute()
    const formRef = ref<ElForm>()
    const loading = ref(false)
    const visible = ref(false)
    const dialogOperatorInfoVisible = ref(false)
    const infoList = ref<string[]>([])
    const contests = ref<ContestDto[]>([])
    const form = reactive({
      contest_id: '',
    })

    const rules = markRaw({
      contest_id: [
        {
          required: true,
          message: '请选择竞赛&作业',
          trigger: 'change',
        },
      ],
    })

    const { id } = route.value.params

    const dataTableRef = inject('dataTableRef') as Ref

    contestApi.getAllContests<AllContestsResponse>().then(res => {
      contests.value = res.contests
    })

    const submit = () => {
      formRef.value.validate(async valid => {
        if (valid) {
          loading.value = true
          try {
            const res = await seriesApi.addSeriesContest(id, form.contest_id)<AddUserResponse>()
            infoList.value = res.info
            dataTableRef.value.fetchDataList()
            visible.value = false
            dialogOperatorInfoVisible.value = true
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

    const show = () => {
      formRef.value?.resetFields()
      visible.value = true
    }

    return {
      formRef,
      form,
      visible,
      infoList,
      dialogOperatorInfoVisible,
      loading,
      rules,
      contests,

      show,
      cancel,
      submit,
    }
  },
})
</script>
