<template lang="pug">
  .content
    title {{`${contest?contest.name:''} - AHPUOJ`}}
    .content__main
      .siderbar
        ul.siderbar__item__list
          li
            .section__title 竞赛信息
          li
            span(style="color:#409eff;") 状态：
            template(v-if="contest")
              el-tag(size="small",v-if="contest.status==1",type="success",effect="dark") 未开始
              el-tag(size="small",v-if="contest.status==2",type="primary",effect="dark") 进行中
              el-tag(size="small",v-if="contest.status==3",type="danger",effect="dark") 已结束
          li
            span(style="color:#409eff;") 模式：
            template(v-if="contest")
              el-tag(size="small",:type="contest.private == 1 ? 'danger':'success'",effect="dark")  {{ contest.private == 1?"私有赛":"公开赛" }}
              el-tag(size="small",:type="contest.team_mode == 0 ? 'success':'primary'",effect="dark")  {{ contest.team_mode == 0?"个人赛":"团体赛" }}
          li
            div
              span(style="color:#409eff;") 开始时间：
              span.fr {{contest && contest.start_time}}
            div(style="margin-top:10px;")
              span(style="color:#409eff;") 结束时间：
              span.fr {{contest && contest.end_time}}
          li
            span(style="color:#409eff;") 持续时长：
            span.fr {{contest && timeDiff}}
        .button__wrapper
          router-link(:to="{name: 'contestStatus',params: {id:contest && contest.id}}",target='_blank')
            el-button(size="small",type="primary") 记录
          router-link(:to="{name: 'contestRank',params: {id:contest && contest.id}}",target='_blank')
            el-button(size="small",type="primary") 排名
          router-link(:to="{name: 'contestTeamRank',params: {id:contest && contest.id}}",target='_blank')
            el-button(v-if="contest&&contest.team_mode == 1",size="small",type="primary") 团队排名
      .main
        h1.content__panel__title {{contest?contest.name:''}}
        .main__section(style="min-height:200px;")
          h3 竞赛简介
          div(v-if="contest",v-html="contest.description")
        .main__section
          h3 问题列表
          el-table(size="small",v-if="seeable",:data="contest.probleminfos")
            el-table-column(width="40")
              template(slot-scope="scope")
                svg-icon(name="ok",v-if="scope.row.status == 1")
                svg-icon(name="wrong",v-else-if="scope.row.status == 2")
            el-table-column(label="#", width="60")
              template(slot-scope="scope")
                span {{ engNum(scope.row.num) }}
            el-table-column(label="标题", min-width="180")
              template(slot-scope="scope")
                router-link(:to="{name:'contestProblem',params:{id:contest.id,num:scope.row.num}}", target="_blank") {{scope.row.title}}
          p(v-else) {{reason}}
</template>

<script>
import { getContest, getLanguageList } from 'user/api/nologin';

import EventBus from 'common/eventbus';
import { submitJudgeCode } from 'user/api/user';

export default {
  data() {
    return {
      seeable: false,
      reason: '',
      contest: null,
      langList: [],
    };
  },
  computed: {
    timeDiff() {
      const startDate = new Date(this.contest.start_time);
      const endDate = new Date(this.contest.end_time);
      const dateDiff = endDate.getTime() - startDate.getTime();

      const days = Math.floor(dateDiff / (24 * 3600 * 1000));
      let left = dateDiff % (24 * 3600 * 1000);
      const hours = Math.floor(left / (3600 * 1000));
      left %= 3600 * 1000;
      const minutes = Math.floor(left / (60 * 1000));
      left %= 60 * 1000;
      const seconds = Math.round(left / 1000);

      let res = '';
      res += days ? `${days}天` : '';
      res += hours ? `${hours}小时` : '';
      res += minutes ? `${minutes}分钟` : '';
      res += seconds ? `${seconds}秒` : '';
      return res;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const res = await getLanguageList();
      this.langList = res.data.languages;
      const { id } = this.$route.params;
      try {
        const res2 = await getContest(id);
        const { data } = res2;
        this.contest = data.contest;
        this.seeable = data.seeable;
        this.reason = data.reason;
      } catch (err) {
        console.log(err);
        this.$router.replace({ name: '404Page' });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
