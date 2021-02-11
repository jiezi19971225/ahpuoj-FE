<template>
  <div class="admin-content">
    <DataTable ref="dataTableRef" :fetchFn="fetchFn" :defaultQuery="defaultQuery">
      <template #table-tool>
        <el-button icon="el-icon-plus" @click="handleCreate">新建</el-button>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索团队名称"
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
          <el-table-column label="团队名称" prop="name">
            <template slot-scope="scope">
              <router-link :to="{ name: 'adminTeamManage', params: { id: scope.row.id } }">
                <el-link type="primary">{{ scope.row.name }}</el-link>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="创建者" width="180">
            <template slot-scope="scope">
              <el-link :href="`/userinfo/${scope.row.creator_id}`" target="_blank" type="primary">{{
                scope.row.username
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="$router.push({ name: 'adminTeamManage', params: { id: scope.row.id } })"
                >管理</el-button
              >
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </DataTable>
    <AddOrEditDialog ref="addOrEditDialogRef" />
  </div>
</template>

<script lang="ts">
import * as teamApi from '@admin/api/teamts'
import DataTable from '@admin/components/DataTable/index.vue'
import { useConfirm } from '@common/use'
import { defineComponent, provide, ref } from '@vue/composition-api'
import AddOrEditDialog from './components/add-or-edit-dialog.vue'

export default defineComponent({
  name: 'adminTeamList',
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
        res = await teamApi.getTeamList<CommonPaginationResponse<Team[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要删除团队${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await teamApi.deleteTeam(row.id)()
        dataTableRef.value.fetchAfterDelete(dataList.value.length === 1)
      } catch (err) {
        console.log(err)
      }
    }

    const handleCreate = () => {
      addOrEditDialogRef.value.showCreate()
    }
    const handleEdit = row => {
      addOrEditDialogRef.value.showEdit(row)
    }

    return {
      dataTableRef,
      addOrEditDialogRef,
      defaultQuery,
      dataList,

      fetchFn,
      handleDelete,
      handleCreate,
      handleEdit,
    }
  },
})
</script>
