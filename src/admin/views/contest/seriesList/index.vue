<template>
  <div class="admin-content">
    <DataTable ref="dataTableRef" :fetchFn="fetchFn" :defaultQuery="defaultQuery">
      <template #table-tool>
        <el-button icon="el-icon-plus" @click="handleCreate">新建</el-button>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索系列赛名称"
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
          <el-table-column label="名称" prop="name" min-width="300"></el-table-column>
          <el-table-column label="状态" width="240"
            ><template slot-scope="scope">
              <el-tag :type="scope.row.defunct == 0 ? 'success' : 'danger'" effect="dark">{{
                scope.row.defunct == 0 ? '启用' : '保留'
              }}</el-tag>
              <el-tag :type="scope.row.team_mode == 0 ? 'success' : 'primary'" effect="dark">{{
                scope.row.team_mode == 0 ? '个人' : '团队'
              }}</el-tag>
            </template></el-table-column
          >
          <el-table-column label="创建者" width="180"
            ><template slot-scope="scope"
              ><a :href="`/userinfo/${scope.row.id}`" target="_blank">{{
                scope.row.username
              }}</a></template
            ></el-table-column
          >
          <el-table-column label="操作" width="300"
            ><template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="$router.push({ name: 'adminSeriesManage', params: { id: scope.row.id } })"
                >管理</el-button
              >
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                :type="scope.row.defunct == 0 ? 'danger' : 'success'"
                @click="handleToggleStatus(scope.row)"
                >{{ scope.row.defunct == 0 ? '保留' : '启用' }}</el-button
              >
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template></el-table-column
          >
        </el-table>
      </template>
    </DataTable>
    <AddOrEditDialog ref="addOrEditDialogRef" />
  </div>
</template>

<script lang="ts">
import * as seriesApi from '@admin/api/seriests'
import DataTable from '@admin/components/DataTable/index.vue'
import { defineComponent, provide, ref } from '@vue/composition-api'
import { useConfirm } from '@common/use'
import AddOrEditDialog from './components/addOrEditDialog.vue'

export default defineComponent({
  name: 'adminSeriesList',
  components: { DataTable, AddOrEditDialog },
  setup() {
    const defaultQuery = {
      param: '',
    }

    const confirm = useConfirm()
    const dataTableRef = ref()
    const addOrEditDialogRef = ref()
    const dataList = ref([])

    provide('dataTableRef', dataTableRef)

    const fetchFn = async queryParams => {
      let res
      try {
        res = await seriesApi.getSeriesList<CommonPaginationResponse<Series[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleCreate = () => {
      addOrEditDialogRef.value.showCreate()
    }
    const handleEdit = row => {
      addOrEditDialogRef.value.showEdit(row)
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要删除系列赛${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await seriesApi.deleteSeries(row.id)()
        dataTableRef.value.fetchAfterDelete(dataList.value.length === 1)
      } catch (err) {
        console.log(err)
      }
    }

    const handleToggleStatus = async row => {
      const msg = `确认要${row.defunct === 0 ? '保留' : '启用'}系列赛${row.name}吗?`
      try {
        await confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await seriesApi.toggleSeriesStatus(row.id)()
        row.defunct = 1 - row.defunct
      } catch (err) {
        console.log(err)
      }
    }

    return {
      dataTableRef,
      addOrEditDialogRef,
      defaultQuery,
      dataList,

      fetchFn,
      handleDelete,
      handleToggleStatus,
      handleCreate,
      handleEdit,
    }
  },
})
</script>
