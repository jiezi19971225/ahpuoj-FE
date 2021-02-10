<template>
  <div class="content">
    <title>{{ `${contest ? contest.name : ''} - AHPUOJ` }}</title>
    <div class="content__main">
      <div class="siderbar">
        <ul class="siderbar__item__list">
          <li>
            <div class="section__title">竞赛信息</div>
          </li>
          <li>
            <span style="color: #409eff">状态：</span
            ><template v-if="contest">
              <el-tag
                size="small"
                v-if="contest.status === ContestStatus.NotStart"
                type="success"
                effect="dark"
                >未开始</el-tag
              >
              <el-tag
                size="small"
                v-if="contest.status == ContestStatus.Running"
                type="primary"
                effect="dark"
                >进行中</el-tag
              >
              <el-tag
                size="small"
                v-if="contest.status == ContestStatus.Finish"
                type="danger"
                effect="dark"
                >已结束</el-tag
              >
            </template>
          </li>
          <li>
            <span style="color: #409eff">模式：</span
            ><template v-if="contest">
              <el-tag
                size="small"
                :type="contest.private === 1 ? 'danger' : 'success'"
                effect="dark"
              >
                {{ contest.private === 1 ? '私有赛' : '公开赛' }}</el-tag
              >
              <el-tag
                size="small"
                :type="contest.team_mode === 0 ? 'success' : 'primary'"
                effect="dark"
              >
                {{ contest.team_mode === 0 ? '个人赛' : '团体赛' }}</el-tag
              >
            </template>
          </li>
          <li>
            <div>
              <span style="color: #409eff">开始时间：</span
              ><span class="fr">{{ contest && contest.start_time }}</span>
            </div>
            <div style="margin-top: 10px">
              <span style="color: #409eff">结束时间：</span
              ><span class="fr">{{ contest && contest.end_time }}</span>
            </div>
          </li>
          <li>
            <span style="color: #409eff">持续时长：</span
            ><span class="fr">{{ contest && timeDiff }}</span>
          </li>
        </ul>
        <div class="button__wrapper">
          <router-link
            :to="{ name: 'contestStatus', params: { id: contest && contest.id } }"
            target="_blank"
          >
            <el-button size="small" type="primary">记录</el-button>
          </router-link>
          <router-link
            :to="{ name: 'contestRank', params: { id: contest && contest.id } }"
            target="_blank"
          >
            <el-button size="small" type="primary">排名</el-button>
          </router-link>
          <router-link
            :to="{ name: 'contestTeamRank', params: { id: contest && contest.id } }"
            target="_blank"
          >
            <el-button v-if="contest && contest.team_mode == 1" size="small" type="primary"
              >团队排名</el-button
            >
          </router-link>
        </div>
      </div>
      <div class="main">
        <h1 class="content__panel__title">{{ contest ? contest.name : '' }}</h1>
        <div class="main__section" style="min-height: 200px">
          <h3>竞赛简介</h3>
          <div v-if="contest" v-html="contest.description"></div>
        </div>
        <div class="main__section">
          <h3>问题列表</h3>
          <el-table size="small" v-if="seeable" :data="contest && contest.probleminfos">
            <el-table-column width="40"
              ><template slot-scope="scope">
                <svg-icon name="ok" v-if="scope.row.status == 1"></svg-icon>
                <svg-icon name="wrong" v-else-if="scope.row.status == 2"></svg-icon> </template
            ></el-table-column>
            <el-table-column label="#" width="60"
              ><template slot-scope="scope"
                ><span>{{ getAlphabetNumber(scope.$index + 1) }}</span></template
              ></el-table-column
            >
            <el-table-column label="标题" min-width="180"
              ><template slot-scope="scope">
                <router-link
                  :to="{
                    name: 'contestProblem',
                    params: { id: contest.id, num: scope.$index + 1 },
                  }"
                  target="_blank"
                  >{{ scope.row.title }}</router-link
                >
              </template></el-table-column
            >
          </el-table>
          <p v-else>{{ reason }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as nologinApi from 'user/api/nologints'
import EventBus from '@common/eventbus'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useLangList, useRoute } from 'common/use'
import { ContestStatus } from '@common/const/enum'
import { getAlphabetNumber } from '@common/utils'

interface ContestResponse {
  message: string
  show: boolean
  contest: ContestDto
  seeable: boolean
  reason: string
}

export default defineComponent({
  name: 'contest',
  setup() {
    const route = useRoute()
    const langList = useLangList()

    const seeable = ref(false)
    const reason = ref('')
    const contest = ref<ContestDto>()

    const timeDiff = computed(() => {
      const startDate = new Date(contest.value?.start_time)
      const endDate = new Date(contest.value?.end_time)
      const dateDiff = endDate.getTime() - startDate.getTime()

      const days = Math.floor(dateDiff / (24 * 3600 * 1000))
      let left = dateDiff % (24 * 3600 * 1000)
      const hours = Math.floor(left / (3600 * 1000))
      left %= 3600 * 1000
      const minutes = Math.floor(left / (60 * 1000))
      left %= 60 * 1000
      const seconds = Math.round(left / 1000)

      let res = ''
      res += days ? `${days}天` : ''
      res += hours ? `${hours}小时` : ''
      res += minutes ? `${minutes}分钟` : ''
      res += seconds ? `${seconds}秒` : ''
      return res
    })

    const { id } = route.value.params
    nologinApi
      .getContest(id)<ContestResponse>()
      .then(res => {
        console.log('res', res)

        contest.value = res.contest
        seeable.value = res.seeable
        reason.value = res.reason
      })
      .catch(err => {
        console.log(err)
        EventBus.$emit('errors', 404)
      })

    return {
      ContestStatus: Object.freeze(ContestStatus),
      seeable,
      reason,
      langList,
      contest,
      timeDiff,

      getAlphabetNumber,
    }
  },
})
</script>
