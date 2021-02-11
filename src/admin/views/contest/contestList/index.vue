<template>
  <div class="admin-content">
    <DataTable ref="dataTableRef" :fetchFn="fetchFn" :defaultQuery="defaultQuery">
      <template #table-tool>
        <router-link :to="{ name: 'adminAddContest' }">
          <el-button icon="el-icon-plus">新建</el-button>
        </router-link>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索竞赛&作业名称"
          style="max-width: 20em"
          v-model="queryParams.param"
          @keyup.enter.native="handleSearch"
          maxlength="20"
          clearable="clearable"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </template>
      <template #table>
        <el-table :data="dataList" style="width: 100%" border="border">
          <el-table-column label="ID" prop="id" width="180"></el-table-column>
          <el-table-column label="名称" min-width="300">
            <template slot-scope="scope">
              <el-link :href="`/contest/${scope.row.id}`" target="_blank" type="primary">{{
                scope.row.name
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="240">
            <template slot-scope="scope">
              <el-tag :type="scope.row.defunct == 0 ? 'success' : 'danger'" effect="dark">{{
                scope.row.defunct == 0 ? '启用' : '保留'
              }}</el-tag>
              <el-tag :type="scope.row.private == 0 ? 'success' : 'danger'" effect="dark">{{
                scope.row.private == 0 ? '公开' : '私有'
              }}</el-tag>
              <el-tag :type="scope.row.team_mode == 0 ? 'success' : 'primary'" effect="dark">{{
                scope.row.team_mode == 0 ? '个人' : '团队'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建者" width="180">
            <template slot-scope="scope">
              <el-link :href="`/userinfo/${scope.row.id}`" target="_blank" type="primary">{{
                scope.row.username
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="$router.push({ name: 'adminEditContest', params: { id: scope.row.id } })"
                >编辑</el-button
              >
              <el-button size="mini" type="primary" @click="openDownloadRecordDialog(scope.row)"
                >记录下载</el-button
              >
              <el-button
                size="mini"
                @click="
                  $router.push({
                    name:
                      scope.row.team_mode == 0 ? 'adminContestManage' : 'adminContestTeamManage',
                    params: { id: scope.row.id },
                  })
                "
                :disabled="scope.row.private == 0"
                >人员</el-button
              >
              <el-button
                size="mini"
                :type="scope.row.defunct == 0 ? 'danger' : 'success'"
                @click="handleToggleStatus(scope.row)"
                >{{ scope.row.defunct == 0 ? '保留' : '启用' }}</el-button
              >
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </DataTable>
    <DownloadRecordDialog ref="downloadRecordDialogRef" />
  </div>
</template>

<script lang="ts">
import * as contestApi from '@admin/api/contestts'
import DataTable from '@admin/components/DataTable/index.vue'
import { useConfirm } from '@common/use'
import { defineComponent, provide, ref } from '@vue/composition-api'
import DownloadRecordDialog from './components/download-record-dialog.vue'

export default defineComponent({
  name: 'adminContestList',
  components: { DataTable, DownloadRecordDialog },
  setup() {
    const defaultQuery = {
      param: '',
    }

    const confirm = useConfirm()
    const dataTableRef = ref()
    const downloadRecordDialogRef = ref()
    const dataList = ref([])

    provide('dataTableRef', dataTableRef)

    const fetchFn = async queryParams => {
      let res
      try {
        res = await contestApi.getContestList<CommonPaginationResponse<Contest[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleToggleStatus = async row => {
      const msg = `确认要${row.defunct === 0 ? '保留' : '启用'}竞赛${row.name}吗?`
      try {
        await confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await contestApi.toggleContestStatus(row.id)()
        row.defunct = 1 - row.defunct
      } catch (err) {
        console.log(err)
      }
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要删除竞赛${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await contestApi.deleteContest(row.id)()
        dataTableRef.value.fetchAfterDelete(dataList.value.length === 1)
      } catch (err) {
        console.log(err)
      }
    }

    const openDownloadRecordDialog = row => {
      downloadRecordDialogRef.value.show(row)
    }

    return {
      downloadRecordDialogRef,
      dataTableRef,
      defaultQuery,
      dataList,

      fetchFn,
      handleToggleStatus,
      handleDelete,
      openDownloadRecordDialog,
    }
  },
})
</script>
