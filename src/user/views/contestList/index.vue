<template>
  <div class="content">
    <div class="content__main">
      <div class="siderbar">
        <ul class="siderbar__item__list">
          <li>
            <div class="tags__wrapper">
              <div class="section__title">查找竞赛：</div>
              <div class="siderbar__searchbar__wrapper">
                <el-input
                  size="small"
                  style="max-width: 20em"
                  placeholder="请输入竞赛名称"
                  @keyup.enter.native="handleSearch"
                  v-model="queryParams.param"
                  maxlength="20"
                  clearable="clearable"
                >
                  <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="main has__pagination">
        <el-table size="small" :data="dataList" v-loading="tableLoading">
          <el-table-column width="90"
            ><template slot-scope="scope">
              <el-tag size="small" v-if="scope.row.status == 1" type="success" effect="dark"
                >未开始</el-tag
              >
              <el-tag size="small" v-if="scope.row.status == 2" type="primary" effect="dark"
                >进行中</el-tag
              >
              <el-tag size="small" v-if="scope.row.status == 3" type="danger" effect="dark"
                >已结束</el-tag
              >
            </template></el-table-column
          >
          <el-table-column label="名称" min-width="180"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'contest', params: { id: scope.row.id } }">{{
                scope.row.name
              }}</router-link>
            </template></el-table-column
          >
          <el-table-column label="模式" min-width="150"
            ><template slot-scope="scope">
              <el-tag
                size="small"
                :type="scope.row.private == 0 ? 'success' : 'danger'"
                effect="dark"
                >{{ scope.row.private == 0 ? '公开赛' : '私有赛' }}</el-tag
              >
              <el-tag
                size="small"
                :type="scope.row.team_mode == 0 ? 'success' : 'primary'"
                effect="dark"
                style="margin-left: 3px"
                >{{ scope.row.team_mode == 0 ? '个人赛' : '团体赛' }}</el-tag
              >
            </template></el-table-column
          >
          <el-table-column label="开始时间" min-width="100" prop="start_time"></el-table-column>
          <el-table-column label="结束时间" min-width="100" prop="end_time"></el-table-column>
        </el-table>
        <oj-paginator
          @change="fetchDataList"
          :current-page.sync="page"
          :page-size.sync="perpage"
          :total="total"
        ></oj-paginator>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onActivated, ref } from '@vue/composition-api'
import { usePagination, useQuery, useRouter } from '@common/use'
import * as nologinApi from '@user/api/nologints'

export default defineComponent({
  name: 'contestList',
  setup() {
    const defaultQuery = {
      param: '',
    }
    const { query, queryParams, syncQuery } = useQuery(defaultQuery)
    const router = useRouter()
    const pagination = usePagination()

    const tableLoading = ref(false)
    const dataList = ref<ContestDto[]>([])

    const fetchDataList = async () => {
      tableLoading.value = true
      try {
        const res = await nologinApi.getContestList<CommonPaginationResponse<ContestDto[]>>({
          page: pagination.page,
          perpage: pagination.perpage,
          ...queryParams,
        })
        dataList.value = res.data
        pagination.total.value = res.total
      } catch (err) {
        tableLoading.value = false
        console.log(err)
      }
    }

    onActivated(() => {
      nextTick(() => {
        syncQuery()
        fetchDataList()
      })
    })

    const handleSearch = (queryObj = {}) => {
      Object.assign(queryParams, queryObj)
      pagination.page.value = 1
      router.push({
        query: {
          ...query.value,
          ...queryParams,
        },
      })
      fetchDataList()
    }

    return {
      ...pagination,
      tableLoading: false,
      queryParams,
      dataList,

      fetchDataList,
      handleSearch,
    }
  },
})
</script>
