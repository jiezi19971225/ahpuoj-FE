<template>
  <div class="content">
    <div class="content__main">
      <div class="one-main has__pagination">
        <el-table size="small" :data="dataList" v-loading="tableLoading">
          <el-table-column label="排名" width="60"
            ><template slot-scope="scope"
              ><span>{{ (page - 1) * 50 + scope.$index + 1 }}</span></template
            ></el-table-column
          >
          <el-table-column label="用户" width="70"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'userinfo', params: { id: scope.row.id } }">
                <div class="user__avatar__wrapper">
                  <img class="user__avatar" :src="getAbsoluteUrl(scope.row.avatar)" />
                </div>
              </router-link> </template
          ></el-table-column>
          <el-table-column
            ><template slot-scope="scope">
              <router-link :to="{ name: 'userinfo', params: { id: scope.row.id } }"
                ><span>{{ `${scope.row.nick}` }}</span></router-link
              >
            </template></el-table-column
          >
          <el-table-column label="通过率" width="80"
            ><template slot-scope="scope">{{ calcRate(scope.row) }}</template></el-table-column
          >
          <el-table-column label="解决" width="70" prop="solved"></el-table-column>
          <el-table-column label="提交" width="70" prop="submit"></el-table-column>
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
import { usePagination } from 'common/use'
import { onActivated, ref } from '@vue/composition-api'
import { getAbsoluteUrl } from '@common/utils'

export default {
  name: 'ranklist',
  setup() {
    const pagination = usePagination({
      perpage: 50,
    })
    const dataList = ref<User[]>()
    const tableLoading = ref(false)

    const fetchDataList = async () => {
      tableLoading.value = true
      try {
        const res = await nologinApi.getRankList<CommonPaginationResponse<User[]>>({
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
      fetchDataList()
    })

    const calcRate = row => {
      const rate = row.submit === 0 ? 0 : row.solved / row.submit
      return `${Number(rate * 100).toFixed(2)}%`
    }
    return {
      ...pagination,
      dataList,
      tableLoading,

      fetchDataList,
      calcRate,
      getAbsoluteUrl,
    }
  },
}
</script>

<style lang="scss" scoped>
.user__avatar__wrapper {
  img {
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }
}
</style>
