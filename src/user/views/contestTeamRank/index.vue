<template>
  <div class="content">
    <title>{{ contest ? `竞赛团队排名 -- ${contest.name} - AHPUOJ` : '' }}</title>
    <div class="content__main">
      <div class="one-main">
        <h1 class="content__panel__title">
          {{ contest ? `竞赛团队排名 -- ${contest.name}` : '' }}
        </h1>
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
          id="ranktable"
        >
          <el-table-column label="排名" type="index" min-width="40"></el-table-column>
          <el-table-column label="团队名" min-width="160" prop="team.name"></el-table-column>
          <el-table-column label="总通过" min-width="70" prop="solved"></el-table-column>
          <el-table-column label="总罚时" min-width="100"
            ><template slot-scope="scope">{{
              secToTimeStr(scope.row.time)
            }}</template></el-table-column
          >
          <el-table-column min-width="100" v-for="index in contest.problem_count" :key="index"
            ><template slot="header" slot-scope="scope">
              <router-link
                :to="{
                  name: 'contestProblem',
                  params: { id: contest.id, num: scope.$index - problemColumnIOffset + 1 },
                }"
                >{{ getAlphabetNumber(scope.$index - problemColumnIOffset + 1) }}</router-link
              > </template
            ><template slot-scope="scope">{{
              calcProblemStatus(scope.row, index)
            }}</template></el-table-column
          >
        </el-table>
        <p v-else>{{ reason }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as nologinApi from '@user/api/nologints'
import { handleExportTableToExcel } from '@common/utils/excel'
import EventBus from '@common/eventbus'
import { useRoute } from '@common/use'
import { onDeactivated, onUnmounted, ref } from '@vue/composition-api'
import { getAlphabetNumber, secToTimeStr } from '@common/utils'
import { problemColumnIOffset } from './constants'
import { useTableStyle } from './use/useTableStyle'

export default {
  setup() {
    const route = useRoute()
    const tableLoading = ref(false)
    const seeable = ref(false)
    const reason = ref('')
    const contest = ref<RankListContestInfo>()
    const dataList = ref<RankListItem[]>([])

    const { calcProblemStatus, cellStyle } = useTableStyle()
    const fetchDataList = async () => {
      tableLoading.value = true
      try {
        const res = await nologinApi.getContestTeamRankList(
          route.value.params.id
        )<ContestTeamRankListResponse>()
        dataList.value = res.teamranklist
        seeable.value = res.seeable
        reason.value = res.reason
        contest.value = res.contest
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

    const exportExcel = () => {
      handleExportTableToExcel('#ranktable', `${contest.value.name}团队排名.xlsx`)
    }
    return {
      problemColumnIOffset,
      dataList,
      contest,
      seeable,
      reason,

      getAlphabetNumber,
      secToTimeStr,
      exportExcel,
      calcProblemStatus,
      cellStyle,
    }
  },
}
</script>
