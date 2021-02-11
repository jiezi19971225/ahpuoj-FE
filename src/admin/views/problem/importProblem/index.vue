<template>
  <div class="admin-content">
    <el-row>
      <el-col :xs="24" :md="12">
        <el-card class="content__card__item">
          <h2 class="content__card__title">导入问题</h2>
          <el-alert
            title="选择fps格式的xml文件导入。"
            type="info"
            :closable="false"
            style="margin-bottom: 0.12rem"
          ></el-alert>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/api/admin/problemset"
            :headers="{ Authorization: $store.getters.token }"
            accept=".xml"
            :auto-upload="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload"
              >导入问题</el-button
            >
          </el-upload>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'adminImportProblem',
  data() {
    return {}
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleUploadSuccess(response) {
      console.log(response)
      this.$notify({
        title: '成功',
        message: response.message,
        type: 'success',
      })
      let message = ''
      response.info.forEach(x => {
        message += `${x}</br>`
      })
      this.$alert(message, {
        dangerouslyUseHTMLString: true,
      })
    },
    handleUploadError() {},
  },
}
</script>
