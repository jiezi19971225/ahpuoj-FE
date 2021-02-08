<template>
  <div class="problem__page">
    <title>{{ problem ? `${problemTitle} - AHPUOJ` : '' }}</title>
    <div class="problem__part" ref="problemPart">
      <div class="problem__header">
        <h1 class="problem__title">{{ problemTitle }}</h1>
        <div class="header__right">
          <router-link
            :to="{ name: 'problemIssueList', params: { id: problem && problem.id } }"
            target="_blank"
          >
            <el-button plain="plain" size="mini" type="success" v-if="$route.name == 'problem'"
              >讨论版</el-button
            >
          </router-link>
          <el-button
            plain="plain"
            size="mini"
            type="success"
            @click="jumpToSolutions"
            style="margin-left: 10px"
            >记录</el-button
          >
        </div>
      </div>
      <div class="problem__info">
        <div class="info__top">
          <div>
            <i class="el-icon-circle-check"></i><span>通过:</span
            ><span>{{ problem && problem.accepted }}</span>
          </div>
          <div>
            <i class="el-icon-s-promotion"></i><span>提交:</span
            ><span>{{ problem && problem.submit }}</span>
          </div>
          <div>
            <i class="el-icon-time"></i><span>时间限制:</span
            ><span>{{ problem && problem.time_limit }} S</span>
          </div>
          <div>
            <i class="el-icon-cpu"></i><span>内存限制:</span
            ><span>{{ problem && problem.memory_limit }} MB</span>
          </div>
          <div>
            <i class="el-icon-stopwatch"></i><span>难度:</span
            ><span v-if="problem && problem.level == 0" style="color: #85ce61">简单</span
            ><span v-if="problem && problem.level == 1" style="color: #409eff">中等</span
            ><span v-if="problem && problem.level == 2" style="color: #f78989">困难</span>
          </div>
        </div>
        <div class="info__bottom">
          <i class="el-icon-collection-tag" style="margin-right: 5px"></i
          ><span style="margin-right: 5px">标签:</span
          ><template v-if="problem">
            <el-button
              v-for="tag in problem.tags"
              :key="tag.id"
              size="mini"
              round="round"
              @click="handleSearchTag(tag.id)"
              >{{ tag.name }}</el-button
            >
          </template>
        </div>
      </div>
      <div class="problem__content">
        <div class="main__section">
          <span class="title">问题描述</span>
          <div v-if="problem" v-html="problem.description"></div>
        </div>
        <div class="main__section">
          <span class="title">输入</span>
          <div v-if="problem" v-html="problem.input"></div>
        </div>
        <div class="main__section">
          <span class="title">输出</span>
          <div v-if="problem" v-html="problem.output"></div>
        </div>
        <div class="main__section">
          <span class="title">样例输入</span
          ><span
            class="clipboard__btn copyBtn"
            style="margin-left: 0.04rem"
            v-clipboard:copy="problem && problem.sample_input"
            >复制</span
          >
          <div v-if="problem" style="white-space: pre-wrap">
            {{ problem.sample_input }}
          </div>
        </div>
        <div class="main__section">
          <span class="title">样例输出</span
          ><span
            class="clipboard__btn copyBtn"
            style="margin-left: 0.04rem"
            v-clipboard:copy="problem && problem.sample_output"
          >
            复制</span
          >
          <div v-if="problem" style="white-space: pre-wrap">
            {{ problem.sample_output }}
          </div>
        </div>
        <div class="main__section">
          <span class="title">提示</span>
          <div v-if="problem" v-html="problem.hint"></div>
        </div>
      </div>
    </div>
    <div class="gutter" ref="gutter"></div>
    <div class="editor__part" ref="editorPart">
      <div class="editor__header">
        <el-select size="mini" v-model="form.language" placeholder="请选择"
          ><template v-for="(item, index) in langList">
            <el-option
              v-if="item.available == true"
              :key="item.name"
              :label="item.name"
              :value="index"
            ></el-option> </template
        ></el-select>
        <el-button
          type="primary"
          size="mini"
          @click="shortcutDialogVisible = true"
          style="margin-left: 5px"
          >快捷键说明</el-button
        >
      </div>
      <div class="editor__content">
        <code-mirror :code.sync="form.source" :language="form.language"></code-mirror>
      </div>
      <div class="editor__console">
        <div class="left">
          <el-input
            type="textarea"
            resize="none"
            :rows="4"
            v-model="testRunForm.input_text"
            placeholder="在这里输入测试用例"
          ></el-input>
        </div>
        <div class="right">
          <el-input
            type="textarea"
            resize="none"
            :rows="4"
            v-model="outputText"
            disablecursor="text"
            placeholder="这里显示代码运行结果"
            readonly="readonly"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="page_footer">
      <div class="left" v-if="$route.name === 'problem'">
        <el-button
          plain="plain"
          size="medium"
          @click="jumpProblem('random')"
          icon="el-icon-magic-stick"
          >随机跳题</el-button
        >
        <el-button plain="plain" size="medium" @click="jumpProblem('prev')">上一题</el-button>
        <el-button size="medium" @click="jumpProblem('next')">下一题</el-button>
      </div>
      <div class="right">
        <el-button
          plain="plain"
          size="medium"
          type="success"
          @click="submitToTestRun"
          :disabled="testrunDisabled"
          >{{ testrunButtonText }}</el-button
        >
        <el-button
          size="medium"
          type="success"
          :loading="submitButtonInLoading"
          @click="submitToJudge"
          >提交</el-button
        >
      </div>
    </div>
    <el-dialog
      class="tal"
      title="快捷键指南"
      :visible.sync="shortcutDialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <pre>{{ helpText }}</pre>
      <span class="dialog-footer" slot="footer">
        <el-button ref="submitBtn" type="primary" @click="shortcutDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <problemlistDrawer ref="problemlistDrawer"></problemlistDrawer>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import CodeMirror from '@common/components/codemirror.vue'
import { testRunInterval } from 'common/const'
import * as nologinApi from '@user/api/nologints'
import EventBus from '@common/eventbus'
import * as userApi from '@user/api/userts'
import { setInterval, clearInterval } from 'timers'
import { clipboard } from '@common/directives/clipboard'
import { computed, reactive, ref } from '@vue/composition-api'
import { useLangList, useMapState, useMessge, useRoute, useRouter } from '@common/use'
import { getAlphabetNumber } from '@common/utils'
import problemlistDrawer from './problemlistDrawer.vue'
import helpText from './shortcutHelp'
import { useGutter } from './use/useGutter'

interface LatestSourceResponse {
  message: string
  sourcecode: {
    language: number
    source: string
  }
}

interface ProblemResponse {
  message: string
  problem: Problem
}

interface TestrunResponse {
  // eslint-disable-next-line camelcase
  custom_output: string
  message: string
  show: boolean
}

interface SubmitCodeResponse {
  // eslint-disable-next-line camelcase
  message: string
  show: true
  solution: Solution
}

export default {
  name: 'problem',
  components: {
    CodeMirror,
    problemlistDrawer,
  },
  directives: { clipboard },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const message = useMessge()
    const states = useMapState({
      user: (state: any) => state.user,
    })

    const testrunButtonText = ref('测试运行')
    const testrunDisabled = ref(false)
    const submitButtonInLoading = ref(false)
    const outputText = ref('')
    const shortcutDialogVisible = ref(false)
    const problem = ref<Problem>()

    const form = reactive({
      language: 0,
      problem_id: 0,
      contest_id: 0,
      num: 0,
      source: '',
    })
    const testRunForm = reactive({
      language: 0,
      problem_id: 0,
      source: '',
      input_text: '',
    })

    const langList = useLangList()

    const id = Number.parseInt(route.value.params.id, 10)
    try {
      //  如果已经登录 拉取最近一次提交的代码
      if (states.user.username) {
        if (route.value.name === 'problem') {
          userApi
            .getLatestSource(id)<LatestSourceResponse>()
            .then(res => {
              form.language = res.sourcecode.language
              form.source = res.sourcecode.source
            })
        } else {
          const num = Number.parseInt(route.value.params.num, 10)
          userApi
            .getLatestContestSource(id, num)<LatestSourceResponse>()
            .then(res => {
              form.language = res.sourcecode.language
              form.source = res.sourcecode.source
            })
        }
      }
      // 如果是普通题目路由
      if (route.value.name === 'problem') {
        nologinApi
          .getProblem(id)<ProblemResponse>()
          .then(res => {
            problem.value = res.problem
            form.problem_id = problem.value.id
            testRunForm.input_text = problem.value.sample_input
            outputText.value = `结果应为\n${problem.value.sample_output}`
          })
      } else {
        // 如果是比赛题目路由
        const num = Number.parseInt(route.value.params.num, 10)
        nologinApi
          .getContestProblem(id, num)<ProblemResponse>()
          .then(res => {
            problem.value = res.problem
            Object.assign(form, {
              problem_id: problem.value.id,
              contest_id: id,
              num: problem.value.id,
            })
            testRunForm.input_text = problem.value.sample_input
          })
      }
    } catch (err) {
      console.log(err)
      EventBus.$emit('errors', 404)
    }

    const problemTitle = computed(() => {
      if (route.value.name === 'problem' && problem !== null) {
        return `P${problem.value?.id}  ${problem.value?.title}`
      }
      if (route.value.name === 'contestProblem' && problem != null) {
        const num = Number.parseInt(route.value.params.num, 10)
        const alphabetNumber = getAlphabetNumber(num)
        return `C${route.value.params.id}  ${alphabetNumber} ${problem.value?.title}`
      }
      return ''
    })

    const handleSearchTag = tagId => {
      router.push({
        name: 'problemSet',
        query: {
          tagId,
        },
      })
    }

    const jumpToSolutions = () => {
      if (route.value.name === 'problem') {
        router.push({
          name: 'status',
          query: {
            queryParam: problem.value.id.toString(),
          },
        })
      } else {
        const num = Number.parseInt(route.value.params.num, 10)
        router.push({
          name: 'contestStatus',
          // TODO: 传参移动到 query 中
          params: {
            id: route.value.params.id.toString(),
            // @ts-ignore
            query: {
              queryParam: getAlphabetNumber(num),
            },
          },
        })
      }
    }

    const jumpProblem = async action => {
      const id = Number.parseInt(route.value.params.id, 10)
      const queryParams = {
        action,
        problemId: id,
      }
      try {
        const res = await nologinApi.jumpProblem<BaseResponse<number>>(queryParams)
        router.push({
          name: 'problem',
          // TODO: 传参移动到 query 中
          params: {
            // @ts-ignore
            id: res.data,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }

    const submitToTestRun = async () => {
      if (!states.user.username) {
        EventBus.$emit('goLogin')
        return
      }
      if (form.source.length === 0) {
        message({
          message: '代码不能为空',
          type: 'error',
        })
        return
      }
      testRunForm.source = form.source
      testRunForm.language = form.language
      outputText.value = '正在评测中，耐心请等待.......'

      // 短暂时间内无法重复提交评测
      let countDown = testRunInterval
      testrunDisabled.value = true
      testrunButtonText.value = `测试运行（${countDown}）`
      const timer = setInterval(() => {
        if (countDown === 0) {
          clearInterval(timer)
          testrunDisabled.value = false
          testrunButtonText.value = '测试运行'
        } else {
          countDown -= 1
          testrunButtonText.value = `测试运行（${countDown}）`
        }
      }, 1000)
      try {
        const res = await userApi.submitTestRunCode<TestrunResponse>(testRunForm)
        console.log(res)
        outputText.value = res.custom_output
      } catch (err) {
        console.log(err)
      }
    }

    const submitToJudge = async () => {
      if (!states.user.username) {
        EventBus.$emit('goLogin')
        return
      }
      if (form.source.length === 0) {
        message({
          message: '代码不能为空',
          type: 'error',
        })
        return
      }
      submitButtonInLoading.value = true

      try {
        const res = await userApi.submitJudgeCode<SubmitCodeResponse>(form)
        router.push({
          name: 'solution',
          params: { id: res.solution.solution_id.toString() },
        })
      } catch (err) {
        console.log(err)
      } finally {
        submitButtonInLoading.value = false
      }
    }

    const { gutter, problemPart, editorPart } = useGutter()
    return {
      gutter,
      problemPart,
      editorPart,

      shortcutDialogVisible,
      helpText,
      testrunButtonText,
      testrunDisabled,
      submitButtonInLoading,
      outputText,
      langList,
      form,
      testRunForm,
      problem,
      problemTitle,

      handleSearchTag,
      jumpProblem,
      jumpToSolutions,
      submitToTestRun,
      submitToJudge,
    }
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>
<style lang="scss" scoped>
.problem__page {
  position: relative;
  height: calc(100vh - 50px);
  text-align: left;
  border-radius: 10px;
  background: $--color-level15;
  display: flex;
  .problem__part,
  .editor__part {
    box-sizing: border-box;
    flex: 1 0 0px;
    overflow-y: auto;
  }
  .dragbar {
    height: 100%;
  }
  .problem__part {
    padding-left: 0.2rem;
    padding-top: 0.1rem;
    overflow-y: auto;
    margin-bottom: 50px;
    .problem__header {
      .problem__title {
        font-size: 16px;
        color: $--color-primary;
      }
      display: flex;
      .header__right {
        text-align: right;
        width: 140px;
        flex-shrink: 0;
        margin-right: 0.05rem;
        margin-left: auto;
      }
    }
    .problem__info {
      min-height: 0.3rem;
      .info__top {
        display: flex;
        flex-wrap: wrap;
        & > * {
          i {
            margin-right: 0.05rem;
          }
          color: #999;
          margin-right: 0.2rem;
        }
      }
      .info__bottom {
        color: #999;
        margin-top: 0.1rem;
        min-height: 0.3rem;
      }
    }
    .problem__content {
      margin-top: 0.1rem;
    }
    .main__section {
      .title {
        color: $--color-primary;
      }
      padding-top: 0.1rem;
      border-top: 1px solid #ddd;
      margin-bottom: 0.2rem;
    }
  }
  .editor__part {
    padding: 0 0.1rem;
    position: relative;
    .editor__header {
      position: absolute;
      top: 0;
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      padding: 10px 0;
    }
    .editor__content {
      margin-top: 50px;
      height: calc(100% - 210px);
    }
    .editor__console {
      height: 110px;
      padding: 5px 0;
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        width: 49%;
      }
    }
  }
  .gutter {
    z-index: 500;
    cursor: col-resize;
    width: 10px;
    height: 100%;
    box-sizing: border-box;
    background-color: #eee;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    &:hover {
      background-color: #2d6db3;
    }
  }
  .page_footer {
    z-index: 1000;
    background: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-top: 1px solid #ddd;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    .el-button {
      margin-right: 0.2rem;
    }
    .left {
      margin-left: 30px;
    }
    .right {
      margin-left: auto;
    }
  }
}
</style>
