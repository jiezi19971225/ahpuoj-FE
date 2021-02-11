<template>
  <div class="admin-content">
    <DataTable ref="dataTableRef" :fetchFn="fetchFn" :defaultQuery="defaultQuery">
      <template #table-tool="{ queryParams, handleSearch }">
        <el-select v-model="queryParams.userType" @change="handleSearch" clearable>
          <el-option label="普通用户" :value="0"></el-option>
          <el-option label="比赛用户" :value="1"></el-option>
        </el-select>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索用户名或昵称"
          style="max-width: 20em"
          v-model="queryParams.param"
          @keyup.enter.native="handleSearchByParam"
          maxlength="20"
          clearable="clearable"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </template>
      <template #table>
        <el-table :data="dataList" style="width: 100%" border="border">
          <el-table-column label="ID" prop="id" width="180"></el-table-column>
          <el-table-column label="用户名" width="180">
            <template slot-scope="scope"
              ><a :href="`/userinfo/${scope.row.id}`" target="_blank">{{ scope.row.username }}</a>
            </template>
          </el-table-column>
          <el-table-column label="昵称">
            <template slot-scope="scope">
              <a :href="`/userinfo/${scope.row.id}`" target="_blank">{{ scope.row.nick }}</a>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="180">
            <template slot-scope="scope">
              <el-tag :type="scope.row.defunct == 0 ? 'success' : 'danger'" effect="dark">{{
                scope.row.defunct == 0 ? '启用' : '禁用'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="handleChangePass(scope.row)"
                >修改密码</el-button
              >
              <el-button
                size="mini"
                :type="scope.row.defunct == 0 ? 'danger' : 'success'"
                @click="handleToggleUserStatus(scope.row)"
                >{{ scope.row.defunct == 0 ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </DataTable>
    <UpdatePasswordDialog ref="updatePasswordDialogRef" />
  </div>
</template>

<script lang="ts">
import * as userApi from '@admin/api/userts'
import DataTable from '@admin/components/DataTable/index.vue'
import { defineComponent, ref } from '@vue/composition-api'
import { useConfirm } from '@common/use'
import UpdatePasswordDialog from './components/update-password-dialog.vue'

export default defineComponent({
  name: 'adminUserList',
  components: { DataTable, UpdatePasswordDialog },
  setup() {
    const defaultQuery = {
      param: '',
    }

    const confirm = useConfirm()
    const dataTableRef = ref()
    const updatePasswordDialogRef = ref()
    const dataList = ref([])

    const fetchFn = async queryParams => {
      let res
      try {
        res = await userApi.getUserList<CommonPaginationResponse<User[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleToggleUserStatus = async row => {
      const msg = `确认要${row.defunct === 0 ? '禁用' : '启用'}用户${row.username}吗?`
      try {
        await confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        try {
          await userApi.toggleUserStatus(row.id)()
          dataTableRef.value.fetchDataList()
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleChangePass = row => {
      updatePasswordDialogRef.value.show(row)
    }

    return {
      dataTableRef,
      updatePasswordDialogRef,
      defaultQuery,
      dataList,

      fetchFn,
      handleToggleUserStatus,
      handleChangePass,
    }
  },
})
</script>
