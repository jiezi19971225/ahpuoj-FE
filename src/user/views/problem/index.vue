<template lang="pug">
.problem__page
  title {{problem?`${problemTitle} - AHPUOJ`:''}}
  .problem__part(ref="problemPart")
    .problem__header
      h1.problem__title {{problemTitle}}
      .header__right
        router-link(:to="{name: 'problemIssueList',params: {id: problem && problem.id}}",target="_blank")
          el-button(plain,size="mini",type="success",v-if="$route.name=='problem'") 讨论版
        el-button(plain,size="mini",type="success",@click="jumpToSolutions",style="margin-left:10px;") 记录
    .problem__info
      .info__top
        div
          i(class="el-icon-circle-check")
          span 通过:
          span {{problem && problem.accepted}}
        div
          i(class="el-icon-s-promotion")
          span 提交:
          span {{problem && problem.submit}}
        div
          i(class="el-icon-time")
          span 时间限制:
          span {{problem && problem.time_limit}} S
        div
          i(class="el-icon-cpu")
          span 内存限制:
          span {{problem && problem.memory_limit}} MB
        div
          i(class="el-icon-stopwatch")
          span 难度:
          span(v-if="problem && problem.level==0",style="color:#85ce61;") 简单
          span(v-if="problem && problem.level==1",style="color:#409eff;") 中等
          span(v-if="problem && problem.level==2",style="color:#f78989;") 困难
      .info__bottom
        i(class="el-icon-collection-tag",style="margin-right:5px;")
        span(style="margin-right:5px;") 标签:
        template(v-if="problem")
          el-button(v-for="tag in problem.tags",:key="tag.id",size="mini",round,@click="handleSearchTag(tag.id)") {{tag.name}}
    .problem__content
      .main__section
        span.title 问题描述
        div(v-if="problem",v-html="problem.description")
      .main__section
        span.title 输入
        div(v-if="problem",v-html="problem.input")
      .main__section
        span.title 输出
        div(v-if="problem",v-html="problem.output")
      .main__section
        span.title 样例输入
        span.clipboard__btn(style="margin-left:0.04rem;",@click="handleCopyInput",ref="copyInputBtn",data-clipboard-action="copy",data-clipboard-target="#input_content",class="copyBtn") 复制
        div(v-if="problem",id="input_content",style="white-space: pre-wrap;")  {{problem.sample_input}}
      .main__section
        span.title 样例输出
        span.clipboard__btn(style="margin-left:0.04rem;",@click="handleCopyOutput",ref="copyOutputBtn",data-clipboard-action="copy",data-clipboard-target="#output_content",class="copyBtn")  复制
        div(v-if="problem",id="output_content",style="white-space: pre-wrap;") {{problem.sample_output}}
      .main__section
        span.title 提示
        div(v-if="problem",v-html="problem.hint")
  .gutter(ref="gutter")
  .editor__part(ref="editorPart")
    .editor__header
      el-select(size="mini",v-model="form.language", placeholder="请选择")
        template(v-for="item,index in langList")
          el-option(v-if="item.available==true", :key="item.name", :label="item.name", :value="index")
      el-button(type="primary",size="mini",@click="dialogVisible = true",style="margin-left:5px;") 快捷键说明
    .editor__content
      code-mirror(:code.sync="form.source",:language="form.language")
    .editor__console
      .left
        el-input(type="textarea",resize="none",:rows="4",v-model="testRunForm.input_text",placeholder="在这里输入测试用例")
      .right
        el-input(type="textarea",resize="none",:rows="4",v-model="outputText",disablecursor="text",placeholder="这里显示代码运行结果",readonly)
  .page_footer
    .left(v-if="$route.name === 'problem'")
      //- el-button(plain,size="medium",@click="showProblemlistDrawer",:disabled="testrunDisabled",icon="el-icon-notebook-2") 题目列表
      el-button(plain,size="medium",@click="jumpProblem('random')",icon="el-icon-magic-stick") 随机跳题
      el-button(plain,size="medium",@click="jumpProblem('prev')",) 上一题
      el-button(size="medium",@click="jumpProblem('next')") 下一题
    .right
      el-button(plain,size="medium",type="success",@click="submitToTestRun",:disabled="testrunDisabled") {{testrunButtonText}}
      el-button(size="medium",type="success",:disabled="submitButtonDisabled",:loading="submitButtonInLoading",@click="submitToJudge") 提交
  el-dialog.tal(title="快捷键指南",:visible.sync="dialogVisible",width="800px",:close-on-click-modal="false")
    pre {{helpText}}
    span(slot="footer" class="dialog-footer")
      el-button(ref="submitBtn",type="primary",@click="dialogVisible = false") 确 定
  problemlistDrawer(ref="problemlistDrawer")
</template>

<script>
import { mapState } from 'vuex';
import CodeMirror from 'common/components/codemirror.vue';
import Clipboard from 'clipboard';
import { testRunInterval } from 'common/const';
import {
  getProblem,
  getContestProblem,
  getLanguageList,
  jumpProblem,
} from 'user/api/nologin';
import EventBus from 'common/eventbus';
import {
  submitJudgeCode,
  submitTestRunCode,
  getLatestSource,
  getLatestContestSource,
} from 'user/api/user';
import { throttle, debounce } from 'throttle-debounce';
import { setInterval, clearInterval } from 'timers';
import problemlistDrawer from './problemlistDrawer.vue';
import helpText from './shortcutHelp';

export default {
  name: 'problem',
  components: {
    CodeMirror,
    problemlistDrawer,
  },
  data() {
    return {
      helpText,
      testrunDisabled: false,
      testrunButtonText: '测试运行',
      submitButtonInLoading: false,
      submitButtonDisabled: false,
      outputText: '',
      dialogVisible: false,
      problemView: true,
      problem: null,
      copyInputBtn: null,
      copyOutputBtn: null,
      langList: [],
      form: {
        language: 0,
        problem_id: 0,
        contest_id: 0,
        num: 0,
        source: '',
      },
      testRunForm: {
        language: 0,
        problem_id: 0,
        source: '',
        input_text: '',
      },
    };
  },
  computed: {
    ...mapState(['user']),
    problemTitle() {
      if (this.$route.name === 'problem' && this.problem != null) {
        return `P${this.problem.id}  ${this.problem.title}`;
      }
      if (this.$route.name === 'contestProblem' && this.problem != null) {
        const num = Number.parseInt(this.$route.params.num, 10);
        const engNum = this.engNum(num);
        return `C${this.$route.params.id}  ${engNum} ${this.problem.title}`;
      }
      return '';
    },
  },
  mounted() {
    this.init();
    this.$refs.gutter.addEventListener('mousedown', () => {
      document.onmousemove = (e) => {
        e = e || window.event;
        const { clientWidth } = document.documentElement;
        // clientWidth += 10;
        // 计算比率
        const rate = (e.clientX / clientWidth) * 2;
        this.$refs.problemPart.style.flexGrow = rate;
        this.$refs.editorPart.style.flexGrow = 2 - rate;
      };
      document.onmouseup = (e) => {
        e = e || window.event;
        const { clientWidth } = document.documentElement;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    });
  },
  methods: {
    async init() {
      getLanguageList().then((res) => {
        this.langList = res.data.languages;
      });
      const id = Number.parseInt(this.$route.params.id, 10);
      try {
        // 如果已经登录 拉取最近一次提交的代码
        if (this.user.username) {
          if (this.$route.name === 'problem') {
            getLatestSource(id).then((res) => {
              this.form.language = res.data.sourcecode.language;
              this.form.source = res.data.sourcecode.source;
            });
          } else {
            const num = Number.parseInt(this.$route.params.num, 10);
            getLatestContestSource(id, num).then((res) => {
              this.form.language = res.data.sourcecode.language;
              this.form.source = res.data.sourcecode.source;
            });
          }
        }
        // 如果是普通题目路由
        if (this.$route.name === 'problem') {
          const res = await getProblem(id);
          const { data } = res;
          this.problem = data.problem;
          this.form.problem_id = this.problem.id;
          this.testRunForm.input_text = data.problem.sample_input;
          this.outputText = `结果应为\n${data.problem.sample_output}`;
        } else {
          // 如果是比赛题目路由
          const num = Number.parseInt(this.$route.params.num, 10);
          const res = await getContestProblem(id, num);
          const { data } = res;
          this.problem = data.problem;
          this.form.problem_id = this.problem.id;
          this.form.contest_id = id;
          this.form.num = num;
          this.testRunForm.input_text = data.problem.sample_input;
        }
        this.copyInputBtn = new Clipboard(this.$refs.copyInputBtn);
        this.copyOutputBtn = new Clipboard(this.$refs.copyOutputBtn);
      } catch (err) {
        console.log(err);
        this.$router.replace({ name: '404Page' });
      }
    },
    showProblemlistDrawer() {
      this.$refs.problemlistDrawer.showDrawer();
    },
    // 跳转题目
    async jumpProblem(action) {
      const id = Number.parseInt(this.$route.params.id, 10);
      const queryParams = {
        action,
        problemId: id,
      };
      try {
        const res = await jumpProblem(queryParams);
        const { data } = res;
        this.$router.push({
          name: 'problem',
          params: {
            id: data.data,
          },
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    handleCopyInput() {
      const clipboard = this.copyInputBtn;
      clipboard.on('success', () => {
        this.$message({
          message: '复制成功',
          type: 'success',
        });
      });
      clipboard.on('error', () => {
        this.$message({
          message: '复制失败，请手动复制',
          type: 'error',
        });
      });
    },
    handleCopyOutput() {
      const clipboard = this.copyOutputBtn;
      clipboard.on('success', () => {
        this.$message({
          message: '复制成功',
          type: 'success',
        });
      });
      clipboard.on('error', () => {
        this.$message({
          message: '复制失败，请手动复制',
          type: 'error',
        });
      });
    },
    handleSearchTag(tagId) {
      this.$router.push({
        name: 'problemSet',
        query: {
          tagId,
        },
      });
    },
    async submitToTestRun() {
      if (!this.user.username) {
        EventBus.$emit('goLogin');
        return;
      }
      if (this.form.source.length === 0) {
        this.$message({
          message: '代码不能为空',
          type: 'error',
        });
        return;
      }
      this.testRunForm.source = this.form.source;
      this.testRunForm.language = this.form.language;
      this.outputText = '正在评测中，耐心请等待.......';

      // 短暂时间内无法重复提交评测
      let countDown = testRunInterval;
      this.testrunDisabled = true;
      this.testrunButtonText = `测试运行（${countDown}）`;
      const t = setInterval(() => {
        if (countDown === 0) {
          clearInterval(t);
          this.testrunDisabled = false;
          this.testrunButtonText = '测试运行';
        } else {
          countDown -= 1;
          this.testrunButtonText = `测试运行（${countDown}）`;
        }
      }, 1000);
      try {
        const res = await submitTestRunCode(this.testRunForm);
        this.outputText = res.data.custom_output;
      } catch (err) {
        this.$message({
          message: err.response.data.message,
          type: 'error',
        });
        console.log(err);
      }
    },
    submitToJudge: debounce(500, async function debounced() {
      if (!this.user.username) {
        EventBus.$emit('goLogin');
        return;
      }
      if (this.form.source.length === 0) {
        this.$message({
          message: '代码不能为空',
          type: 'error',
        });
        return;
      }
      this.submitButtonDisabled = true;
      this.submitButtonInLoading = true;
      try {
        const res = await submitJudgeCode(this.form);
        this.$router.push({
          name: 'solution',
          params: { id: res.data.solution.solution_id },
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.submitButtonDisabled = false;
        this.submitButtonInLoading = false;
      }
    }),
    jumpToSolutions() {
      if (this.$route.name === 'problem') {
        this.$router.push({
          name: 'status',
          query: {
            queryParam: this.problem.id,
          },
        });
      } else {
        const num = Number.parseInt(this.$route.params.num, 10);
        this.$router.push({
          name: 'contestStatus',
          params: {
            id: this.$route.params.id,
            query: {
              queryParam: this.engNum(num),
            },
          },
        });
      }
    },
  },
};
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
