<template>
  <div class="admin-content">
    <DataTable
      ref="dataTableRef"
      :fetchFn="fetchFn"
      :defaultQuery="defaultQuery"
      :pagination="false"
    >
      <template #table-tool>
        <el-input v-model="username" placeholder="请输入被授权用户名" style="width: 200px">
        </el-input>
        <el-select v-model="roleId" placeholder="请选择要授予的角色" style="width: 200px" clearable>
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          ></el-option>
        </el-select>
        <el-button @click="assignRole" type="primary">授权</el-button>
      </template>
      <template #table>
        <el-table :data="dataList" style="width: 100%" border="border">
          <el-table-column label="用户ID" prop="id" width="180"></el-table-column>
          <el-table-column label="用户名" width="180">
            <template slot-scope="scope">
              <a :href="`/userinfo/${scope.row.id}`" target="_blank">{{ scope.row.username }}</a>
            </template>
          </el-table-column>
          <el-table-column label="角色" prop="role"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="unassignRole(scope.row)"
                >撤销</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import * as permissionApi from '@admin/api/permissionts'
import DataTable from '@admin/components/DataTable/index.vue'
import { defineComponent, ref } from '@vue/composition-api'
import { useMessge } from 'common/use'

export default defineComponent({
  name: 'adminSetting',
  components: { DataTable },
  setup() {
    const defaultQuery = {
      username: '',
    }
    const message = useMessge()

    const username = ref('')
    const roleId = ref('')
    const dataTableRef = ref()
    const dataList = ref([])
    const roleList = ref<Role[]>([])

    permissionApi.getRoleList<BaseResponse<Role[]>>().then(res => {
      roleList.value = res.data
    })

    const fetchFn = async queryParams => {
      let res
      try {
        res = await permissionApi.getAdminList<CommonPaginationResponse<User[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const assignRole = async () => {
      if (!username.value) {
        message({
          type: 'error',
          message: '请输入用户名',
        })
        return
      }
      if (!roleId) {
        message({
          type: 'error',
          message: '请选择角色',
        })
        return
      }
      const postData = {
        username: username.value,
        role_id: roleId.value,
      }
      try {
        await permissionApi.assignRole(postData)
        dataTableRef.value.fetchDataList()
      } catch (err) {
        console.log(err)
      }
    }

    const unassignRole = async row => {
      const { id } = row
      const postData = {
        user_id: id,
      }
      try {
        await permissionApi.unassignRole(postData)
        dataTableRef.value.fetchDataList()
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err)
      }
    }

    return {
      dataTableRef,
      defaultQuery,
      username,
      roleId,
      roleList,
      dataList,

      fetchFn,
      assignRole,
      unassignRole,
    }
  },
})
</script>
