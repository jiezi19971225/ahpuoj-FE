<template>
  <div class="admin-content">
    <DataTable ref="dataTableRef" :fetchFn="fetchFn" :defaultQuery="defaultQuery">
      <template #table-tool>
        <router-link :to="{ name: 'adminAddNew' }">
          <el-button icon="el-icon-plus">新建</el-button>
        </router-link>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索新闻标题"
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
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态" width="180">
            <template slot-scope="scope">
              <el-tag :type="scope.row.defunct == 0 ? 'success' : 'danger'" effect="dark">{{
                scope.row.defunct == 0 ? '显示' : '隐藏'
              }}</el-tag>
              <el-tag
                v-if="scope.row.top &gt; 0"
                type="success"
                effect="dark"
                style="margin-left: 0.04rem"
                >置顶</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="$router.push({ name: 'adminEditNew', params: { id: scope.row.id } })"
                >编辑</el-button
              >
              <el-button
                size="mini"
                :type="scope.row.defunct == 0 ? 'danger' : 'success'"
                @click="handleToggleStatus(scope.row)"
                >{{ scope.row.defunct == 0 ? '隐藏' : '显示' }}</el-button
              >
              <el-button
                size="mini"
                :type="scope.row.top == 0 ? 'success' : 'danger'"
                @click="handleToggleTopStatus(scope.row)"
                >{{ scope.row.top == 0 ? '置顶' : '取置' }}</el-button
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
import * as newApi from '@admin/api/newts'
import DataTable from '@admin/components/DataTable/index.vue'
import { defineComponent, ref } from '@vue/composition-api'
import { useConfirm } from 'common/use'

export default defineComponent({
  name: 'adminNewList',
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
        res = await newApi.getNewList<CommonPaginationResponse<New[]>>(queryParams)
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleToggleStatus = async row => {
      const msg = `确认要${row.defunct === 0 ? '隐藏' : '显示'}新闻${row.title}吗?`
      try {
        await confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await newApi.toggleNewStatus(row.id)()
        dataTableRef.value.fetchDataList()
      } catch (err) {
        console.log(err)
      }
    }

    const handleToggleTopStatus = async row => {
      const msg = `确认要${row.top === 0 ? '置顶' : '取置'}新闻${row.title}吗?`
      try {
        await confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await newApi.toggleNewTopStatus(row.id)()
        dataTableRef.value.fetchDataList()
      } catch (err) {
        console.log(err)
      }
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要删除新闻${row.title}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await newApi.deleteNew(row.id)()
        dataTableRef.value.fetchAfterDelete(dataList.value.length === 1)
      } catch (err) {
        console.log(err)
      }
    }

    return {
      defaultQuery,
      dataTableRef,
      dataList,

      fetchFn,
      handleToggleStatus,
      handleToggleTopStatus,
      handleDelete,
    }
  },
})
</script>
