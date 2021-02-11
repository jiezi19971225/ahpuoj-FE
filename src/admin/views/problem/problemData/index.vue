<template>
  <div class="admin-content">
    <div class="content-header">问题名称:{{ problem ? problem.title : '' }}</div>
    <el-alert
      title="现已支持文件多选!!!上传文件大小限制为 80 M，上传数据文件前请先命名数据文件为 xxx.in 或 xxx.out 不支持其他扩展名文件的上传，windows不显示扩展名请先设置文件夹选项"
      type="info"
      style="margin-bottom: 0.1rem"
    ></el-alert>
    <table-tools style="height: auto"
      ><template #tool>
        <el-button icon="el-icon-plus" @click="handleAdd" style="height: 40px">新建</el-button>
        <el-upload
          ref="upload"
          :action="`/api/admin/problem/${$route.params.id}/datafile`"
          :headers="{ Authorization: $store.getters.token }"
          :filelist="filelist"
          accept=".in,.out"
          :auto-upload="true"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :limit="10"
          multiple="multiple"
        >
          <el-button slot="trigger" icon="el-icon-upload" type="primary">上传</el-button>
        </el-upload>
      </template></table-tools
    >
    <el-table :data="tableData" style="width: 100%; margin-bottom: 30px" border="border">
      <el-table-column label="文件名" prop="filename" width="180"></el-table-column>
      <el-table-column label="文件大小(字节)" prop="size" width="180"></el-table-column>
      <el-table-column label="修改时间" prop="mod_time" min-width="180"></el-table-column>
      <el-table-column label="操作" width="250"
        ><template slot-scope="scope"
          ><a :href="calcUrl(scope.row)" download="download" style="margin-right: 10px">
            <el-button type="primary" size="mini">下载</el-button>
          </a>
          <el-button size="mini" @click="handleEditData(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteProblemData(scope.row)"
            >删除</el-button
          >
        </template></el-table-column
      >
    </el-table>
    <el-dialog
      :title="dialogFormTitle"
      :visible.sync="dialogFormVisible"
      @opened="openDialog"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        v-show="dialogType == 'addData'"
        :model="addDataForm"
        ref="addDataForm"
        :rules="addDataRules"
        @submit.native.prevent
      >
        <el-form-item abel="数据名称" prop="filename">
          <el-input
            v-model="addDataForm.filename"
            autocomplete="off"
            @keyup.enter.native="submit"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        v-show="dialogType == 'editData'"
        :model="editDataForm"
        ref="editDataForm"
        :rules="editDataRules"
        @submit.native.prevent
      >
        <el-form-item label="数据内容" prop="content">
          <el-input
            v-model="editDataForm.content"
            type="textarea"
            :rows="20"
            autocomplete="off"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" native-type="submit" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import * as problemApi from '@admin/api/problemts'
import EventBus from '@common/eventbus'

import { apiPort } from 'common/const'

export default {
  name: 'adminProblemData',
  data() {
    return {
      problem: null,
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogType: '',
      currentRow: null,
      filelist: [],
      addDataForm: {
        filename: '',
      },
      editDataForm: {
        content: '',
      },
      addDataRules: {
        filename: [
          {
            required: true,
            message: '请输入数据名称',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '超出长度限制',
            trigger: 'blur',
          },
        ],
      },
      editDataRules: {
        content: [
          {
            required: true,
            message: '请输入数据内容',
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
    }
  },
  async activated() {
    const { id } = this.$route.params
    try {
      const res = await problemApi.getProblem(id)<ProblemResponse>()
      this.problem = res.problem
      this.fetchDataList()
    } catch (err) {
      EventBus.$emit('errors', 404)
      console.log(err)
    }
  },
  methods: {
    async fetchDataList() {
      try {
        const res = await problemApi.getProblemDataList(this.problem.id)<ProblemDataResponse>()
        this.tableData = res.files
      } catch (err) {
        console.log(err)
      }
    },
    openDialog() {
      if (this.dialogType === 'addData') {
        this.$notify({
          title: '提示',
          message:
            '添加方法：输入数据名称点击确定，系统将生成对应的.in和.out文件，之后再编辑对应的数据文件。',
          duration: 6000,
        })
      }
    },
    submit() {
      let refform = ''
      if (this.dialogType === 'addData') {
        refform = 'addDataForm'
      } else {
        refform = 'editDataForm'
      }
      this.$refs[refform].validate(async valid => {
        if (valid) {
          try {
            if (this.dialogType === 'addData') {
              const res = await problemApi.addProblemData(this.problem.id)<any>(this.addDataForm)
              res.info.forEach((x, index) => {
                setTimeout(() => {
                  this.$notify({
                    title: '提示',
                    message: x,
                    duration: 6000,
                  })
                }, 500 * index)
              })
              this.dialogFormVisible = false
              this.fetchDataList()
            } else {
              await problemApi.editProblemData(
                this.problem.id,
                this.currentRow.filename
              )<any>(this.editDataForm)
              this.dialogFormVisible = false
              this.fetchDataList()
            }
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    handleAdd() {
      this.dialogFormTitle = '添加数据'
      this.dialogType = 'addData'
      this.dialogFormVisible = true
    },
    handleUploadSuccess(res, file, filelist) {
      this.filelist = filelist.shift()
      this.$message({
        message: res.message,
        type: 'success',
      })
      this.fetchDataList()
    },
    handleUploadError(err, file, filelist) {
      this.filelist = filelist.shift()
      this.$message({
        message: err.response.message ? err.response.message : err,
        type: 'error',
      })
    },
    async handleEditData(row) {
      this.dialogFormTitle = `编辑数据文件${row.filename}`
      this.dialogType = 'editData'
      this.currentRow = row
      try {
        const res = await problemApi.getProblemDataFile(this.problem.id, row.filename)<any>()
        this.editDataForm.content = res.content
        this.dialogFormVisible = true
      } catch (err) {
        console.log(err)
      }
    },
    calcUrl(row) {
      return `${window.location.protocol}//${window.location.hostname}${apiPort}/api/admin/download/problem/${this.$route.params.id}/data/${row.filename}`
    },
    async deleteProblemData(row) {
      try {
        await this.$confirm(`确认要删除数据文件${row.filename}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        try {
          await problemApi.deleteProblemData(this.problem.id, row.filename)()
          this.fetchDataList()
          // eslint-disable-next-line no-empty
        } catch (err) {}
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>
