<template>
  <div class="content">
    <title>{{ `S${solution && solution.solution_id} 评测详情 - AHPUOJ` }}</title>
    <div class="content__main">
      <div class="siderbar">
        <ul class="siderbar__item__list">
          <li>
            <div class="section__title">评测信息</div>
          </li>
          <li class="userinfo__wrapper align__center">
            <div>
              <router-link
                :to="{ name: 'userinfo', params: { id: solution ? solution.user_id : 0 } }"
                ><img :src="imgUrl(solution ? solution.avatar : '')"
              /></router-link>
            </div>
            <div>
              <router-link
                :to="{ name: 'userinfo', params: { id: solution ? solution.user_id : 0 } }"
                >{{ solution ? solution.nick : '' }}</router-link
              >
            </div>
          </li>
          <li>
            <div class="mt10"></div>
            <span style="color: #409eff"
              >代码<span class="fr">{{
                solution && langList[solution.language] + ' ' + solution.code_length + 'kb'
              }}</span></span
            >
            <div class="mt10">
              <span style="color: #409eff">提交时间</span
              ><span class="fr">{{ solution && solution.in_date }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="main" ref="solutionContent">
        <h1 class="content__panel__title" style="padding-left: 0">评测详情</h1>
        <div class="main__section">
          <h3>
            问题
            <p v-if="solution">
              <router-link
                v-if="solution.contest_id == 0"
                :to="{ name: 'problem', params: { id: solution.problem_id } }"
                >{{ `P${solution.problem_id}  ${solution.problem_title}` }}</router-link
              >
              <router-link
                v-else
                :to="{
                  name: 'contestProblem',
                  params: { id: solution.contest_id, num: solution.num },
                }"
                >{{
                  `C${solution.contest_id}  ${engNum(solution.num)} ${solution.problem_title}`
                }}</router-link
              >
            </p>
          </h3>
        </div>
        <div class="main__section">
          <h3>结果</h3>
          <p>
            {{ solution && (resultList[solution.result] ? resultList[solution.result].name : '') }}
          </p>
        </div>
        <div class="main__section">
          <h3>运行信息</h3>
          <p>{{ solution && `用时${solution.time}ms \\ 内存${solution.memory}kb` }}</p>
        </div>
        <div class="main__section">
          <h3>编译信息</h3>
          <p>{{ meta && (meta.compile_info ? meta.compile_info : '没有编译信息') }}</p>
        </div>
        <div class="main__section">
          <h3>错误信息</h3>
          <p>{{ solution && renderWrongInfo }}</p>
        </div>
        <!-- 非比赛模式下 代码提交者可以下载样例--><template
          v-if="solution &amp;&amp; meta.runtime_info &amp;&amp; $store.getters.userId==solution.user_id &amp;&amp; solution.contest_id == 0  &amp;&amp; solution.result &gt;= 5 &amp;&amp; solution.result &lt;= 8"
        >
          <div class="main__section">
            <h3>测试点数据下载</h3>
            <el-button
              size="mini"
              type="success"
              :loading="downloadInDataButtonLoading"
              @click="handleDownloadDataFile(wrongFileName + '.in', 'in')"
              >{{ wrongFileName + '.in' }}</el-button
            >
            <el-button
              size="mini"
              type="success"
              :loading="downloadOutDataButtonLoading"
              @click="handleDownloadDataFile(wrongFileName + '.out', 'out')"
              >{{ wrongFileName + '.out' }}</el-button
            >
          </div>
        </template>
        <div
          class="main__section"
          v-if="solution &amp;&amp; solution.contest_id == 0 &amp;&amp; solution.result == 4 &amp;&amp; $store.getters.userId == solution.user_id"
        >
          <h3>公开代码</h3>
          <p>公开你的源码，用你的智慧帮助其他的人解决问题！</p>
          <p class="mt10">
            当前状态<el-tag
              class="ml10"
              size="mini"
              :type="solution.public == 0 ? 'danger' : 'success'"
              effect="dark"
              >{{ solution.public == 0 ? '不公开' : '公开' }}</el-tag
            >
          </p>
          <el-button
            class="mt10"
            :type="solution.public == 1 ? 'danger' : 'primary'"
            @click="handleToggleSolutionStatus"
            size="small"
            >{{ solution.public == 1 ? '隐藏代码' : '公开代码' }}</el-button
          >
        </div>
        <div class="main__section">
          <h3>代码</h3>
          <code-mirror
            v-if="seeable"
            :code.sync="meta.source"
            :language="solution.language"
            :readonly="true"
            style="height: 500px"
          ></code-mirror>
          <p v-else>你没有查看这份代码的权限</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import CodeMirror from '@common/components/codemirror.vue'
import * as nologinApi from '@user/api/nologints'
import * as userApi from '@user/api/userts'
import EventBus from 'common/eventbus'

import { resultList, langList } from '@common/const'
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
import { useLoading, useRoute } from '@common/use'
import { handleDownloadFile } from 'common/utils'

interface SolutionMeta {
  compile_info: string
  runtime_info: string
  source: string
}

interface SolutionResponse {
  message: string
  meta: SolutionMeta
  seeable: boolean
  solution: SolutionInfo
}

export default defineComponent({
  name: 'solution',
  components: {
    CodeMirror,
  },
  setup() {
    const route = useRoute()
    const loadingFactory = useLoading()

    let loading
    let timer
    const solutionContent = ref<HTMLDivElement>()
    const downloadInDataButtonLoading = ref(false)
    const downloadOutDataButtonLoading = ref(false)
    const solution = ref<SolutionInfo>()
    const seeable = ref(false)
    const meta = ref<SolutionMeta>()

    const wrongFileName = computed(() => {
      return meta.value.runtime_info.substring(0, meta.value.runtime_info.lastIndexOf('.'))
    })
    const renderWrongInfo = computed(() => {
      if (!meta.value) {
        return ''
      }
      if (!meta.value.runtime_info) {
        return '没有错误信息'
      }
      if (solution.value.result >= 5 && solution.value.result <= 8) {
        return `测试样例${wrongFileName.value}处发生了错误`
      }
      return meta.value.runtime_info
    })

    const { id } = route.value.params
    try {
      nologinApi
        .getSolution(id)<SolutionResponse>()
        .then(async res => {
          seeable.value = res.seeable
          solution.value = res.solution
          meta.value = res.meta
          // 轮询是否评测完成
          if (solution.value.result < 4) {
            loading = loadingFactory({
              target: solutionContent.value,
              lock: true,
              text: '等待评测中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.3)',
            })
            timer = setInterval(async () => {
              const res2 = await nologinApi.getSolution(id)<SolutionResponse>()
              seeable.value = res2.seeable
              solution.value = res2.solution
              meta.value = res2.meta
              if (solution.value.result >= 4) {
                clearInterval(timer)
                loading.close()
              }
            }, 2000)
          }
        })
    } catch (err) {
      console.log(err)
      EventBus.$emit('errors', 404)
    }

    onMounted(() => {
      if (loading) {
        loading.close()
      }
      if (timer) {
        clearInterval(timer)
      }
    })

    const handleToggleSolutionStatus = () => {
      try {
        userApi.toggleSolutionStatus(solution.value.solution_id)()
        solution.value.public = 1 - solution.value.public
      } catch (err) {
        console.log(err)
      }
    }

    const handleDownloadDataFile = async (filename, type) => {
      if (type === 'in') {
        downloadInDataButtonLoading.value = true
      } else {
        downloadOutDataButtonLoading.value = true
      }

      try {
        const res = await userApi.downloadDatafile<any>({
          pid: solution.value.problem_id,
          sid: solution.value.solution_id,
          filename,
        })
        handleDownloadFile(res, filename)
      } catch (err) {
        console.log(err)
      } finally {
        if (type === 'in') {
          downloadInDataButtonLoading.value = false
        } else {
          downloadOutDataButtonLoading.value = false
        }
      }
    }
    return {
      resultList: Object.freeze(resultList),
      langList: Object.freeze(langList),
      downloadInDataButtonLoading,
      downloadOutDataButtonLoading,
      solution,
      seeable,
      meta,
      wrongFileName,
      renderWrongInfo,

      handleDownloadDataFile,
      handleToggleSolutionStatus,
    }
  },
})
</script>
<style lang="scss" scoped>
.userinfo__wrapper {
  img {
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
}
</style>
