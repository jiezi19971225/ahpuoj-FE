<template>
  <div class="admin-content">
    <DataTable ref="dataTableRef" :fetchFn="fetchFn" :defaultQuery="defaultQuery">
      <template #table-tool>
        <el-button icon="el-icon-plus" @click="handleCreate">新建</el-button>
      </template>

      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索标签名称"
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
          <el-table-column label="标签名称" prop="name"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
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
import * as tagApi from '@admin/api/tagts'
import DataTable from '@admin/components/DataTable/index.vue'
import { useConfirm } from '@common/use'
import { defineComponent, provide, ref } from '@vue/composition-api'
import AddOrEditDialog from './components/add-or-edit-dialog.vue'

export default defineComponent({
  name: 'adminTagList',
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
        res = await tagApi.getTagList<CommonPaginationResponse<Tag[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要删除标签${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await tagApi.deleteTag(row.id)()
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
