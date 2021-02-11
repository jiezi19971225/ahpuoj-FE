<template>
  <div>
    <el-dialog
      title="添加团队成员"
      :visible.sync="visible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-alert
        title="每一行对应一个用户名，若对应账号存在则加入团队，否则将忽略。"
        :closable="false"
      />
      <el-form :model="form" ref="formRef" :rules="rules" @submit.native.prevent>
        <el-form-item label="用户名列表" prop="userList">
          <el-input
            type="textarea"
            rows="20"
            v-model="form.userList"
            ref="input"
            autocomplete="off"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" native-type="submit" @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="操作信息"
      :visible.sync="dialogOperatorInfoVisible"
      :close-on-click-modal="false"
      width="600px"
    >
      <p v-for="(item, index) in infoList" :key="index">{{ item }}</p>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" @click="dialogOperatorInfoVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import * as teamApi from '@admin/api/teamts'
import { defineComponent, inject, markRaw, reactive, Ref, ref } from '@vue/composition-api'
import { useRoute } from 'common/use'
import { ElForm } from 'element-ui/types/form.d'

export default defineComponent({
  setup() {
    const route = useRoute()

    const formRef = ref<ElForm>()
    const loading = ref(false)
    const visible = ref(false)
    const dialogOperatorInfoVisible = ref(false)
    const infoList = ref<string[]>([])
    const form = reactive({
      userList: '',
    })

    const rules = markRaw({
      userList: [
        {
          required: true,
          message: '请输入要添加的用户名列表',
          trigger: 'blur',
        },
      ],
    })

    const { id } = route.value.params

    const dataTableRef = inject('dataTableRef') as Ref

    const submit = () => {
      formRef.value.validate(async valid => {
        if (valid) {
          loading.value = true
          try {
            const res = await teamApi.addTeamUser(id)<AddUserResponse>(form)
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

      show,
      cancel,
      submit,
    }
  },
})
</script>
