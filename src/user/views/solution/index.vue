<template lang="pug">
  .content
    title {{`S${solution && solution.solution_id} 评测详情 - AHPUOJ`}}
    .content__main
      .siderbar
        ul.siderbar__item__list
          li
            .section__title 评测信息
          li(class="userinfo__wrapper align__center")
            div
              router-link(:to="{name:'userinfo',params:{id:solution?solution.user_id:0}}")
                img(:src="imgUrl(solution?solution.avatar:'')")
            div
              router-link(:to="{name:'userinfo',params:{id:solution?solution.user_id:0}}") {{solution?solution.nick:""}}
          li
            div.mt10
            span(style="color:#409eff;") 代码
              span(class="fr") {{solution && (langList[solution.language] + " " + solution.code_length+"kb")}}
            div.mt10
              span(style="color:#409eff;") 提交时间
              span(class="fr") {{solution && solution.in_date}}
      .main(ref="solutionContent")
        h1.content__panel__title(style="padding-left:0;") 评测详情
        .main__section
          h3 问题
              p(v-if="solution")
                router-link(v-if="solution.contest_id==0",:to="{name:'problem',params:{id:solution.problem_id}}") {{`P${solution.problem_id}  ${solution.problem_title}`}}
                router-link(v-else,:to="{name:'contestProblem',params:{id:solution.contest_id,num:solution.num}}") {{ `C${solution.contest_id}  ${engNum(solution.num)} ${solution.problem_title}`}}
        .main__section
          h3 结果
          p {{solution && (resultList[solution.result]?resultList[solution.result].name:"")}}
        .main__section
          h3 运行信息
          p {{solution && (`用时${solution.time}ms \\ 内存${solution.memory}kb`)}}
        .main__section
          h3 编译信息
          p {{meta && (meta.compile_info?meta.compile_info:"没有编译信息")}}
        .main__section
          h3 错误信息
          p {{solution && renderWrongInfo}}
        // 非比赛模式下 代码提交者可以下载样例
        template(v-if="solution && meta.runtime_info && $store.getters.userId==solution.user_id && solution.contest_id == 0  && solution.result >= 5 && solution.result <= 8")
          .main__section
            h3 测试点数据下载
            el-button(size="mini",type="success",:loading="downloadInDataButtonInLoading",@click="handleDownloadDataFile(wrongFileName+'.in','in')") {{wrongFileName+".in"}}
            el-button(size="mini",type="success",:loading="downloadOutDataButtonInLoading",@click="handleDownloadDataFile(wrongFileName+'.out','out')") {{wrongFileName+".out"}}
        .main__section(v-if="solution && solution.contest_id == 0 && solution.result == 4 && $store.getters.userId == solution.user_id")
          h3 公开代码
          p 公开你的源码，用你的智慧帮助其他的人解决问题！
          p.mt10 当前状态
            el-tag.ml10(size="mini",type="plain",:type="solution.public == 0 ? 'danger':'success'",effect="dark") {{solution.public == 0 ? "不公开":"公开"}}
          el-button.mt10(:type="solution.public == 1?'danger':'primary'", @click="handleToggleSolutionStatus",size="small") {{solution.public == 1?'隐藏代码':'公开代码'}}
        .main__section
          h3 代码
          code-mirror(v-if="seeable",:code.sync="meta.source",:language="solution.language",:readonly="true",style="height:500px;")
          p(v-else) 你没有查看这份代码的权限
</template>

<script>
import CodeMirror from 'common/components/codemirror.vue';
import clipboard from 'clipboard';
import { getSolution } from 'user/api/nologin';
import {
  downloadDatafile,
  submitJudgeCode,
  toggleSolutionStatus,
} from 'user/api/user';
import EventBus from 'common/eventbus';

import { resultList, langList } from 'common/const';

export default {
  components: {
    CodeMirror,
  },
  data() {
    return {
      downloadInDataButtonInLoading: false,
      downloadOutDataButtonInLoading: false,
      loading: null,
      solution: null,
      meta: null,
      langList: [],
      seeable: false,
      resultList: [],
      timer: 0,
    };
  },
  computed: {
    wrongFileName() {
      return this.meta.runtime_info.substring(
        0,
        this.meta.runtime_info.lastIndexOf('.'),
      );
    },
    renderWrongInfo() {
      if (!this.meta) {
        return '';
      }
      if (!this.meta.runtime_info) {
        return '没有错误信息';
      }
      if (this.solution.result >= 5 && this.solution.result <= 8) {
        return `测试样例${this.wrongFileName}处发生了错误`;
      }
      return this.meta.runtime_info;
    },
  },
  mounted() {
    this.resultList = resultList;
    this.langList = langList;
    this.fetchData();
  },
  beforeDestroy() {
    // 关闭定时器
    if (this.loading) {
      this.loading.close();
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async fetchData() {
      const { id } = this.$route.params;
      const self = this;
      try {
        const res = await getSolution(id);
        const { data } = res;
        this.seeable = data.seeable;
        this.solution = data.solution;
        this.meta = data.meta;
        // 需要重复询问
        if (this.solution.result < 4) {
          this.loading = this.$loading({
            target: this.$refs.solutionContent,
            lock: true,
            text: '等待评测中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.3)',
          });
          this.timer = setInterval(async () => {
            const res2 = await getSolution(id);
            const { data: data2 } = res2;
            this.seeable = data2.seeable;
            this.solution = data2.solution;
            this.meta = data2.meta;
            if (this.solution.result >= 4) {
              clearInterval(this.timer);
              this.loading.close();
            }
          }, 2000);
        }
      } catch (err) {
        console.log(err);
        this.$router.replace({ name: '404Page' });
      }
    },
    handleSearchTag(tagId) {
      this.$router.push({
        name: 'problemSet',
        query: {
          tagId,
        },
      });
    },
    async handleDownloadDataFile(filename, type) {
      if (type === 'in') {
        this.downloadInDataButtonInLoading = true;
      } else {
        this.downloadOutDataButtonInLoading = true;
      }

      try {
        const res = await downloadDatafile(
          this.solution.problem_id,
          this.solution.solution_id,
          filename,
        );
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const downloadElement = document.createElement('a');
        downloadElement.style.display = 'none';
        downloadElement.href = url;
        downloadElement.setAttribute('download', filename);
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(url); // 释放掉blob对象
      } catch (err) {
        console.log(err);
      } finally {
        if (type === 'in') {
          this.downloadInDataButtonInLoading = false;
        } else {
          this.downloadOutDataButtonInLoading = false;
        }
      }
    },
    async handleToggleSolutionStatus() {
      try {
        const res = await toggleSolutionStatus(this.solution.solution_id);
        this.solution.public = !this.solution.public;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
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
