<template>
  <div class="content">
    <title>{{ `${series ? series.name : ''} - AHPUOJ` }}</title>
    <div class="content__main">
      <div class="siderbar">
        <ul class="siderbar__item__list">
          <li>
            <div class="section__title">系列赛信息</div>
          </li>
          <li>
            <span style="color: #409eff">模式：</span
            ><template v-if="series">
              <el-tag
                size="small"
                :type="series.team_mode == 0 ? 'success' : 'primary'"
                effect="dark"
              >
                {{ series.team_mode == 0 ? '个人系列赛' : '团体系列赛' }}</el-tag
              >
            </template>
          </li>
        </ul>
      </div>
      <div class="main">
        <h1 class="content__panel__title">{{ series ? series.name : '' }}</h1>
        <div class="main__section" style="min-height: 200px">
          <h3>系列赛简介</h3>
          <div v-if="series" v-html="series.description"></div>
        </div>
        <div class="main__section">
          <h3>竞赛列表</h3>
          <el-table size="small" v-if="series" :data="series.contestinfos">
            <el-table-column width="90"
              ><template slot-scope="scope">
                <el-tag v-if="scope.row.status == 1" type="success" effect="dark">未开始</el-tag>
                <el-tag v-if="scope.row.status == 2" type="primary" effect="dark">进行中</el-tag>
                <el-tag v-if="scope.row.status == 3" type="danger" effect="dark">已结束</el-tag>
              </template></el-table-column
            >
            <el-table-column label="名称" min-width="180"
              ><template slot-scope="scope">
                <router-link :to="{ name: 'contest', params: { id: scope.row.id } }">{{
                  scope.row.name
                }}</router-link>
              </template></el-table-column
            >
          </el-table>
        </div>
        <div class="main__section">
          <h3>参赛人员信息</h3>
          <el-table size="small" v-if="series" :data="userRankList">
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
              </template></el-table-column
            >
            <el-table-column
              :label="`${item.name}(通过)`"
              min-width="160"
              v-for="item in series.contestinfos"
              :key="item.id"
              ><template slot-scope="scope"
                ><span>{{
                  scope.row.solved['' + item.id] ? scope.row.solved['' + item.id] : '--'
                }}</span></template
              ></el-table-column
            >
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as nologinApi from '@user/api/nologints'
import { defineComponent, ref } from '@vue/composition-api'
import { useRoute } from '@common/use'
import EventBus from '@common/eventbus'

export default defineComponent({
  setup() {
    const route = useRoute()
    const series = ref<Series>()
    const userRankList = ref([])

    const { id } = route.value.params
    nologinApi
      .getSeries(id)<SeriesResponse>()
      .then(res => {
        series.value = res.series
        userRankList.value = res.userranklist
      })
      .catch(err => {
        console.log(err)
        EventBus.$emit('errors', 404)
      })

    return {
      series,
      userRankList,
    }
  },
})
</script>
