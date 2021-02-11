<template>
  <div class="admin-content">
    <DataTable
      ref="dataTableRef"
      :fetchFn="fetchFn"
      :defaultQuery="defaultQuery"
      :totalSync.sync="total"
    >
      <template #header>
        <div>竞赛名称: {{ contest && contest.name }} 人员总数: {{ total }}</div>
      </template>
      <template #table-tool>
        <el-button type="success" icon="el-icon-plus" @click="handleAddUser">添加</el-button>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索用户名或昵称"
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
          <el-table-column label="用户名" prop="username" width="180"></el-table-column>
          <el-table-column label="昵称" prop="nick"></el-table-column>
          <el-table-column label="操作" width="180"
            ><template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template></el-table-column
          >
        </el-table>
      </template>
    </DataTable>
    <AddUserDialog ref="addUserDialogRef" />
  </div>
</template>

<script lang="ts">
import * as contestApi from '@admin/api/contestts'
import DataTable from '@admin/components/DataTable/index.vue'
import { useConfirm, useRoute } from '@common/use'
import { defineComponent, provide, ref } from '@vue/composition-api'
import EventBus from '@common/eventbus'
import AddUserDialog from './components/add-user-dialog.vue'

export default defineComponent({
  name: 'adminContestManage',
  components: { DataTable, AddUserDialog },
  setup() {
    const defaultQuery = {
      param: '',
    }

    const confirm = useConfirm()
    const route = useRoute()

    const dataTableRef = ref()
    const addUserDialogRef = ref()
    const dataList = ref([])
    const contest = ref<ContestDetailDto>()
    const total = ref()

    const { id } = route.value.params

    provide('dataTableRef', dataTableRef)

    contestApi
      .getContest(id)<ContestResponse>()
      .then(res => {
        contest.value = res.contest
      })
      .catch(err => {
        EventBus.$emit('errors', 404)
      })

    const fetchFn = async queryParams => {
      let res
      try {
        res = await contestApi.getContestUserList(id)<CommonPaginationResponse<User[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要移除用户${row.username}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await contestApi.deleteContestUser(contest.value.id, row.id)()
        dataTableRef.value.fetchAfterDelete(dataList.value.length === 1)
      } catch (err) {
        console.log(err)
      }
    }

    const handleAddUser = () => {
      addUserDialogRef.value.show()
    }

    return {
      total,
      contest,
      dataTableRef,
      addUserDialogRef,
      defaultQuery,
      dataList,

      fetchFn,
      handleDelete,
      handleAddUser,
    }
  },
})
</script>
