<template>
  <div class="content">
    <div class="content__main">
      <div class="siderbar">
        <div class="tags__wrapper">
          <ul class="siderbar__item__list">
            <li>
              <div class="section__title">查找系列赛：</div>
              <div class="siderbar__searchbar__wrapper">
                <el-input
                  size="small"
                  style="max-width: 20em"
                  placeholder="请输入系列赛名称"
                  @keyup.enter.native="handleSearch"
                  v-model="queryParams.param"
                  maxlength="20"
                  clearable="clearable"
                >
                  <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="main has__pagination">
        <el-table size="small" :data="dataList" v-loading="tableLoading">
          <el-table-column label="名称" min-width="180"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'series', params: { id: scope.row.id } }">{{
                scope.row.name
              }}</router-link>
            </template></el-table-column
          >
          <el-table-column label="模式" min-width="150"
            ><template slot-scope="scope">
              <el-tag
                size="small"
                :type="scope.row.team_mode == 0 ? 'success' : 'primary'"
                effect="dark"
                >{{ scope.row.team_mode == 0 ? '个人系列赛' : '团体系列赛' }}</el-tag
              >
            </template></el-table-column
          >
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
import * as nologinApi from '@user/api/nologints'
import { usePagination, useQuery, useRouter } from '@common/use'
import { nextTick, onActivated, ref } from '@vue/composition-api'

export default {
  setup() {
    const defaultQuery = {
      param: '',
    }

    const { query, queryParams, syncQuery } = useQuery(defaultQuery)
    const router = useRouter()

    const tableLoading = ref(false)
    const pagination = usePagination()
    const dataList = ref<Series[]>([])

    const fetchDataList = async () => {
      tableLoading.value = true
      try {
        const res = await nologinApi.getSeriesList<CommonPaginationResponse<Series[]>>({
          ...queryParams,
          page: pagination.page,
          perpage: pagination.perpage,
        })
        dataList.value = res.data
        pagination.total.value = res.total
      } catch (err) {
        console.log(err)
      } finally {
        tableLoading.value = false
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
      tableLoading,
      dataList,
      queryParams,

      fetchDataList,
      handleSearch,
    }
  },
}
</script>
