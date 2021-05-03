<template>
  <div class="admin-content">
    <el-row>
      <el-col :xs="24" :md="12">
        <el-card class="content__card__item">
          <h2 class="content__card__title">比赛用户账号生成器</h2>
          <el-form :model="leftForm" :rules="leftRules" ref="leftFormRef" label-width="60px">
            <el-form-item label="前缀" prop="prefix">
              <el-input v-model="leftForm.prefix"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="number">
              <el-input v-model.number="leftForm.number"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitCompeteAccount">生成</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card class="content__card__item">
          <h2 class="content__card__title">用户账号生成器</h2>
          <el-alert
            title="可以将学生学号从Excel整列复制过来，批量生成用户账号，初始密码默认为123456。"
            type="info"
            style="margin-bottom: 0.12rem"
          ></el-alert>
          <el-form :model="rightForm" :rules="rightRules" ref="rightFormRef" label-width="70px">
            <el-form-item label="用户名" prop="userList">
              <el-input
                v-model="rightForm.userList"
                type="textarea"
                :rows="12"
                resize="none"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitUserAccount">生成</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <GeneratorInfoDialog ref="generatorInfoDialogRef" />
  </div>
</template>
<script lang="ts">
import * as generatorApi from '@admin/api/generatorts'
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { ElForm } from 'element-ui/types/form.d'
import GeneratorInfoDialog from './components/generator-info-dialog.vue'

export default defineComponent({
  name: 'adminAccountGenerator',
  components: {
    GeneratorInfoDialog,
  },
  setup() {
    const leftFormRef = ref<ElForm>()
    const rightFormRef = ref<ElForm>()
    const generatorInfoDialogRef = ref()

    const leftForm = reactive({
      prefix: '',
      number: '',
    })
    const leftRules = {
      prefix: [
        {
          required: true,
          message: '请输入前缀',
          trigger: 'blur',
        },
      ],
      number: [
        {
          required: true,
          message: '请输入数量',
          trigger: 'blur',
        },
        {
          type: 'integer',
          min: 0,
          max: 300,
          message: '请输入1-300之间的整数',
          trigger: 'blur',
        },
      ],
    }
    const rightForm = reactive({
      userList: '',
    })

    const rightRules = {
      userList: [
        {
          required: true,
          message: '请输入用户名列表',
          trigger: 'blur',
        },
      ],
    }

    const submitCompeteAccount = () => {
      leftFormRef.value.validate(async valid => {
        if (valid) {
          try {
            const res = await generatorApi.generateCompeteAccount<GenerateAccountResposne>(leftForm)
            generatorInfoDialogRef.value.show(res.info, res.users)
          } catch (err) {
            console.log(err)
          }
        }
      })
    }

    const submitUserAccount = () => {
      rightFormRef.value.validate(async valid => {
        if (valid) {
          try {
            const res = await generatorApi.generateUserAccount<GenerateAccountResposne>(rightForm)
            generatorInfoDialogRef.value.show(res.info, res.users)
          } catch (err) {
            console.log(err)
          }
        }
      })
    }

    return {
      leftFormRef,
      rightFormRef,
      generatorInfoDialogRef,
      leftForm,
      leftRules,
      rightForm,
      rightRules,

      submitCompeteAccount,
      submitUserAccount,
    }
  },
})
</script>
