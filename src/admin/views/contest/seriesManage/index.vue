<template>
  <div class="admin-content">
    <DataTable
      ref="dataTableRef"
      :fetchFn="fetchFn"
      :defaultQuery="defaultQuery"
      :totalSync.sync="total"
    >
      <template #header>
        <div>系列赛名称: {{ series && series.name }} 包含竞赛总数: {{ total }}</div>
      </template>
      <template #table-tool>
        <el-button icon="el-icon-plus" @click="handleAddContest" type="primary">添加</el-button>
      </template>
      <template #table-search="{ queryParams, handleSearch }">
        <el-input
          placeholder="搜索竞赛名称"
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
          <el-table-column label="名称" prop="name" width="180"></el-table-column>
          <el-table-column label="模式" min-width="150">
            <template slot-scope="scope">
              <el-tag :type="scope.row.private == 1 ? 'danger' : 'success'" effect="dark">{{
                scope.row.private == 1 ? '私有赛' : '公开赛'
              }}</el-tag>
              <el-tag :type="scope.row.team_mode == 0 ? 'success' : 'primary'" effect="dark">{{
                scope.row.team_mode == 0 ? '个人赛' : '团体赛'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </DataTable>
    <AddContestDialog ref="addContestDialogRef" />
  </div>
</template>

<script lang="ts">
import * as seriesApi from '@admin/api/seriests'
import DataTable from '@admin/components/DataTable/index.vue'
import { useConfirm, useRoute } from '@common/use'
import { defineComponent, provide, ref } from '@vue/composition-api'
import EventBus from '@common/eventbus'
import AddContestDialog from './components/add-contest-dialog.vue'

export default defineComponent({
  name: 'adminSeriesManage',
  components: { DataTable, AddContestDialog },
  setup() {
    const defaultQuery = {
      param: '',
    }

    const confirm = useConfirm()
    const route = useRoute()

    const dataTableRef = ref()
    const addContestDialogRef = ref()
    const dataList = ref([])
    const series = ref<Series>()
    const total = ref()
    const { id } = route.value.params

    provide('dataTableRef', dataTableRef)

    seriesApi
      .getSeries(id)<SeriesResposne>()
      .then(res => {
        series.value = res.series
      })
      .catch(err => {
        EventBus.$emit('errors', 404)
      })

    const fetchFn = async queryParams => {
      let res
      try {
        res = await seriesApi.getSeriesContestList(id)<CommonPaginationResponse<Series[]>>(
          queryParams
        )
        dataList.value = res.data
      } catch (err) {
        console.log(err)
        throw err
      }
      return res
    }

    const handleDelete = async row => {
      try {
        await confirm(`确认要删除系列赛中的竞赛${row.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await seriesApi.deleteSeriesContest(series.value.id, row.id)()
        dataTableRef.value.fetchAfterDelete(dataList.value.length === 1)
      } catch (err) {
        console.log(err)
      }
    }

    const handleAddContest = () => {
      addContestDialogRef.value.show()
    }

    return {
      total,
      series,
      dataTableRef,
      addContestDialogRef,
      defaultQuery,
      dataList,

      fetchFn,
      handleDelete,
      handleAddContest,
    }
  },
})
</script>
