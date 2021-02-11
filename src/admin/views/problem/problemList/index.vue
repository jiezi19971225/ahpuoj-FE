<template>
  <div class="admin-content">
    <DataTable ref="dataTableRef" :fetchFn="fetchFn" :defaultQuery="defaultQuery">
      <template #table-tool>
        <router-link :to="{ name: 'adminAddProblem' }">
          <el-button icon="el-icon-plus">新建</el-button>
        </router-link>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索问题名称"
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
          <el-table-column label="标题" prop="title" min-width="300">
            <template slot-scope="scope"
              ><a :href="`/problem/${scope.row.id}`" target="_blank">{{
                scope.row.title
              }}</a></template
            >
          </el-table-column>
          <el-table-column label="标签" min-width="300">
            <template slot-scope="scope">
              <el-tag
                v-for="tag in scope.row.tags"
                :key="tag.id"
                type="success"
                effect="dark"
                style="margin-left: 0.04rem"
                >{{ tag.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="状态" width="180">
            <template slot-scope="scope">
              <el-tag :type="scope.row.defunct == 0 ? 'success' : 'danger'" effect="dark">{{
                scope.row.defunct == 0 ? '启用' : '保留'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建者" width="180">
            <template slot-scope="scope"
              ><a :href="`/userinfo/${scope.row.id}`" target="_blank">{{
                scope.row.username
              }}</a></template
            >
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="$router.push({ name: 'adminProblemData', params: { id: scope.row.id } })"
                >数据</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="$router.push({ name: 'adminEditProblem', params: { id: scope.row.id } })"
                >编辑</el-button
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
  </div>
</template>

<script lang="ts">
import * as problemApi from '@admin/api/problemts'
import DataTable from '@admin/components/DataTable/index.vue'
import { useConfirm } from '@common/use'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'adminProblemList',
  components: { DataTable },
  setup() {
    const defaultQuery = {
      param: '',
    }

    const confirm = useConfirm()
    const dataTableRef = ref()
    const dataList = ref([])

    const fetchFn = async queryParams => {
      let res
      try {
        res = await problemApi.getProblemList<CommonPaginationResponse<Problem[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleToggleStatus = async row => {
      const msg = `确认要${row.defunct === 0 ? '保留' : '启用'}问题${row.title}吗?`
      try {
        await confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await problemApi.toggleProblemStatus(row.id)()
        dataTableRef.value.fetchDataList()
      } catch (err) {
        console.log(err)
      }
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要删除问题${row.title}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await problemApi.deleteProblem(row.id)()
        dataTableRef.value.fetchAfterDelete(dataList.value.length === 1)
      } catch (err) {
        console.log(err)
      }
    }

    return {
      dataTableRef,
      defaultQuery,
      dataList,

      fetchFn,
      handleToggleStatus,
      handleDelete,
    }
  },
})
</script>
