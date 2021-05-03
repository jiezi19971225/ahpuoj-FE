<template>
  <el-dialog title="账号列表" :visible.sync="visible" :close-on-click-modal="false" width="800px">
    <el-row>
      <el-col class="infolist" el-col="el-col" :xs="24" :md="8">
        <p class="dialog__info" v-for="(item, index) in info" :key="index">{{ item }}</p>
      </el-col>
      <el-col el-col="el-col" :xs="24" :md="16">
        <el-table :data="tableData" id="userAccountTable">
          <el-table-column property="username" label="用户名" width="150"></el-table-column>
          <el-table-column property="password" label="密码"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="dialog-footer" slot="footer">
      <el-button type="success" @click="exportExcel">导出为excel</el-button>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { handleExportTableToExcel } from '@common/utils/excel'

export default defineComponent({
  setup() {
    const visible = ref(false)
    const tableData = ref([])
    const info = ref([])

    const show = (infoParam, tableDataParam) => {
      visible.value = true
      info.value = infoParam
      tableData.value = tableDataParam
    }

    const exportExcel = () => {
      handleExportTableToExcel('#userAccountTable', `比赛账号.xlsx`)
    }

    return {
      visible,
      show,
      info,
      tableData,

      exportExcel,
    }
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
