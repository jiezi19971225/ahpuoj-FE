<template>
  <div class="content">
    <title>{{ user ? `${user.nick}的个人空间` : '' }}</title>
    <div class="content__main">
      <div class="one-main">
        <h1 class="content__panel__title">个人空间</h1>
        <div class="main__section">
          <h3>用户信息</h3>
          <el-row class="tac">
            <el-col :span="12">
              <div class="userinfo__avatart__wrapper">
                <img :src="getAbsoluteUrl(user ? user.avatar : '')" />
              </div>
            </el-col>
            <el-col :span="12">
              <ul class="infolist">
                <li>
                  <span>昵称</span><span v-if="user">{{ user.nick }}</span>
                </li>
                <li>
                  <span>解决</span><a v-if="user" @click="jumpToSolved">{{ user.solved }}</a>
                </li>
                <li>
                  <span>提交</span><a v-if="user" @click="jumpToSubmit">{{ user.submit }}</a>
                </li>
                <li>
                  <span>排名</span><span v-if="user">{{ user.rank }}</span>
                </li>
                <li>
                  <span>注册时间</span><span v-if="user">{{ user.created_at }}</span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
        <div class="main__section">
          <h3>近期提交情况</h3>
          <v-chart
            style="width: 100%; height: 5rem"
            ref="chart"
            :options="chartOption"
            autoresize="autoresize"
          ></v-chart>
        </div>
        <div class="main__section">
          <h3>已解决的问题</h3>
          <div class="problem__links" v-if="user">
            <router-link
              :to="{ name: 'problem', params: { id: item } }"
              v-for="item in user.solved_problem_list"
              :key="item"
            >
              <el-button type="success" size="mini">{{ item }}</el-button>
            </router-link>
          </div>
        </div>
        <div class="main__section">
          <h3>未解决的问题</h3>
          <div class="problem__links" v-if="user">
            <router-link
              :to="{ name: 'problem', params: { id: item } }"
              v-for="item in user.unsolved_problem_list"
              :key="item"
            >
              <el-button type="danger" size="mini">{{ item }}</el-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import * as userApi from '@user/api/userts'
import { getAbsoluteUrl } from '@common/utils'
import { useRoute, useRouter } from '@common/use'

import 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import { defineComponent, reactive, ref } from '@vue/composition-api'

import defaultChartOption from './chartOption'

interface StatisticUnit {
  date: string
  count: number
}

interface UserInfoDto extends User {
  rank: number
  solved_problem_list: number[]
  unsolved_problem_list: number[]
  recent_solved_statistic: StatisticUnit[]
  recent_submit_statistic: StatisticUnit[]
}

interface UserInfoResponse {
  message: string
  userinfo: UserInfoDto
}

export default defineComponent({
  name: 'userInfo',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const user = ref<UserInfoDto>()
    const chartOption = reactive(defaultChartOption)

    try {
      const { id } = route.value.params
      userApi
        .getUserInfo(id)<UserInfoResponse>()
        .then(res => {
          user.value = res.userinfo
          chartOption.series[0].data = user.value.recent_solved_statistic.map(x => x.count)
          chartOption.series[1].data = user.value.recent_submit_statistic.map(x => x.count)
          chartOption.xAxis.data = user.value.recent_solved_statistic.map(x => x.date)
        })
    } catch (err) {
      console.log(err)
    }

    const jumpToSolved = () => {
      router.push({
        name: 'status',
        params: {
          id: route.value.params.id.toString(),
        },
        query: {
          result: '4',
          username: user.value.nick,
        },
      })
    }

    const jumpToSubmit = () => {
      router.push({
        name: 'status',
        params: {
          id: route.value.params.id,
        },
        query: {
          username: user.value.nick,
        },
      })
    }

    return {
      user,
      chartOption,

      jumpToSolved,
      jumpToSubmit,
      getAbsoluteUrl,
    }
  },
})
</script>

<style lang="scss" scoped>
.userinfo__avatart__wrapper {
  img {
    height: 2rem;
    width: 2rem;
    border-radius: 1rem;
    border: 0.01rem solid $--color-level14;
  }
}

ul.infolist {
  text-align: left;

  li {
    margin-top: 0.15rem;
    font-size: 0.16rem;

    span {
      display: inline-block;

      &:first-child {
        width: 1rem;
      }
    }
  }
}

.problem__links {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  > * {
    margin-right: 0.2rem;
    margin-bottom: 0.1rem;
  }
  .el-button {
    width: 50px;
  }
}
</style>
