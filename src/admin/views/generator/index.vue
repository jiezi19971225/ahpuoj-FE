<template>
  <div class="admin-content">
    <el-row>
      <el-col :xs="24" :md="12">
        <el-card class="content__card__item">
          <h2 class="content__card__title">比赛用户账号生成器</h2>
          <el-form :model="leftForm" :rules="leftRules" ref="leftForm" label-width="60px">
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
          <el-form :model="rightForm" :rules="rightRules" ref="rightForm" label-width="70px">
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
    <el-dialog
      title="账号列表"
      :visible.sync="dialogOperatorInfoVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-row>
        <el-col class="infolist" el-col="el-col" :xs="24" :md="8">
          <p class="dialog__info" v-for="(item, index) in info" :key="index">{{ item }}</p>
        </el-col>
        <el-col el-col="el-col" :xs="24" :md="16">
          <el-table :data="tableData">
            <el-table-column property="username" label="用户名" width="150"></el-table-column>
            <el-table-column property="password" label="密码"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" @click="dialogOperatorInfoVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as generatorApi from '@admin/api/generatorts'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'adminAccountGenerator',
  data() {
    return {
      dialogOperatorInfoVisible: false,
      info: '',
      leftForm: {
        prefix: '',
        number: '',
      },
      leftRules: {
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
            max: 100,
            message: '请输入1-100之间的整数',
            trigger: 'blur',
          },
        ],
      },
      rightForm: {
        userList: '',
      },
      rightRules: {
        userList: [
          {
            required: true,
            message: '请输入用户名列表',
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
    }
  },
  methods: {
    submitCompeteAccount() {
      this.info = ''
      this.$refs.leftForm.validate(async valid => {
        if (valid) {
          try {
            const res = await generatorApi.generateCompeteAccount(this.leftForm)
            this.dialogOperatorInfoVisible = true
            this.tableData = res.users
            this.info = res.info
          } catch (err) {
            console.log(err)
          }
        } else {
          return false
        }
      })
    },
    submitUserAccount() {
      this.info = ''
      this.$refs.rightForm.validate(async valid => {
        if (valid) {
          try {
            const res = await generatorApi.generateUserAccount(this.rightForm)
            this.dialogOperatorInfoVisible = true
            this.tableData = res.users
            this.info = res.info
          } catch (err) {
            console.log(err)
          }
        } else {
          return false
        }
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.dialog__info {
  font-size: 16px;
  text-align: left;
  padding: 0.5em;
}
</style>
