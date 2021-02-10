<template>
  <div class="content">
    <title>{{ contest ? `竞赛排名 -- ${contest.name} - AHPUOJ` : '' }}</title>
    <div class="content__main">
      <div class="one-main">
        <h1 class="content__panel__title">{{ contest ? `竞赛排名 -- ${contest.name}` : '' }}</h1>
        <el-button
          style="position: absolute; right: 10px; top: 10px"
          plain="plain"
          size="small"
          type="primary"
          @click="exportExcel"
          >下载excel</el-button
        >
        <el-table
          size="small"
          v-if="seeable"
          :data="dataList"
          :cell-style="cellStyle"
          :row-style="rowStyle"
          id="ranktable"
        >
          <el-table-column label="排名" type="index" min-width="40"></el-table-column>
          <el-table-column label="用户名" min-width="160"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'userinfo', params: { id: scope.row.user.id } }">
                {{ scope.row.user.username }}</router-link
              >
            </template></el-table-column
          >
          <el-table-column label="昵称" min-width="160"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'userinfo', params: { id: scope.row.user.id } }">
                {{ scope.row.user.nick }}</router-link
              >
            </template>
          </el-table-column>
          <el-table-column label="通过" min-width="70" align="center"
            ><template slot-scope="scope"
              ><a @click="jumpToContestStatus(scope.row)">{{ scope.row.solved }}</a></template
            ></el-table-column
          >
          <el-table-column label="罚时" min-width="100"
            ><template slot-scope="scope">{{
              secToTimeStr(scope.row.time)
            }}</template></el-table-column
          ><template v-if="contest">
            <el-table-column min-width="100" v-for="count in contest.problem_count" :key="count"
              ><template slot="header" slot-scope="scope">
                <router-link
                  :to="{
                    name: 'contestProblem',
                    params: { id: contest.id, num: scope.$index - problemColumnIOffset + 1 },
                  }"
                  >{{ getAlphabetNumber(scope.$index - problemColumnIOffset + 1) }}</router-link
                > </template
              ><template slot-scope="scope">{{
                calcProblemStatus(scope.row, count)
              }}</template></el-table-column
            >
          </template>
        </el-table>
        <p v-else>{{ reason }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as nologinApi from 'user/api/nologints'
import { defineComponent, onDeactivated, onUnmounted, ref } from '@vue/composition-api'
import { useRoute, useRouter } from '@common/use'
import { getAlphabetNumber } from '@common/utils'
import { handleExportTableToExcel } from '@common/utils/excel'
import EventBus from 'common/eventbus'
import { problemColumnIOffset } from './constants'
import { useTableStyle } from './use/useTableStyle'

export default defineComponent({
  name: 'contestRank',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const tableLoading = ref(false)
    const seeable = ref(false)
    const reason = ref('')
    const contest = ref<RankListContestInfo>()
    const dataList = ref<RankListItem[]>([])

    const { calcFirstBloods, calcProblemStatus, cellStyle, rowStyle } = useTableStyle(dataList)

    const fetchDataList = async () => {
      tableLoading.value = true
      try {
        const res = await nologinApi.getContestRankList(
          route.value.params.id
        )<ContestRankListResponse>()
        dataList.value = res.ranklist
        seeable.value = res.seeable
        reason.value = res.reason
        contest.value = res.contest
        calcFirstBloods()
      } catch (err) {
        console.log(err)
        EventBus.$emit('errors', 404)
      } finally {
        tableLoading.value = false
      }
    }

    fetchDataList()
    // 每隔1分钟拉取一次数据
    const timer = setInterval(() => {
      fetchDataList()
    }, 60000)
    onDeactivated(() => {
      clearInterval(timer)
    })
    onUnmounted(() => {
      clearInterval(timer)
    })

    const jumpToContestStatus = row => {
      router.push({
        name: 'contestStatus',
        params: { id: contest.value.id.toString() },
        query: { nick: row.user.nick },
      })
    }

    const exportExcel = () => {
      handleExportTableToExcel('#ranktable', `${contest.value.name}个人排名.xlsx`)
    }

    return {
      problemColumnIOffset,
      dataList,
      contest,
      seeable,
      reason,

      calcProblemStatus,
      cellStyle,
      rowStyle,
      getAlphabetNumber,
      exportExcel,
      jumpToContestStatus,
    }
  },
})
</script>
