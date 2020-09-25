<template lang="pug">
  .content
    title {{`${series?series.name:''} - AHPUOJ`}}
    .content__main
      .siderbar
        ul.siderbar__item__list
          li
            .section__title 系列赛信息
          li
            span(style="color:#409eff;") 模式：
            template(v-if="series")
              el-tag(size="small",:type="series.team_mode == 0 ? 'success':'primary'",effect="dark")  {{ series.team_mode == 0?"个人系列赛":"团体系列赛" }}

      .main
        h1.content__panel__title {{series?series.name:''}}
        .main__section(style="min-height:200px;")
          h3 系列赛简介
          div(v-if="series",v-html="series.description")
        .main__section
          h3 竞赛列表
          el-table(size="small",v-if="series",:data="series.contestinfos")
            el-table-column(width="90")
              template(slot-scope="scope")
                el-tag(v-if="scope.row.status==1", type="success",effect="dark") 未开始
                el-tag(v-if="scope.row.status==2",type="primary",effect="dark") 进行中
                el-tag(v-if="scope.row.status==3",type="danger",effect="dark") 已结束
            el-table-column(label="名称", min-width="180")
              template(slot-scope="scope")
                router-link(:to="{name:'contest',params:{id:scope.row.id}}") {{scope.row.name}}
        .main__section
          h3 参赛人员信息
          el-table(size="small",v-if="series",:data="userRankList")
            el-table-column(label="用户名",min-width="160")
              template(slot-scope="scope")
                  router-link(:to="{name:'userinfo',params:{id:scope.row.user.id}}")  {{scope.row.user.username}}
            el-table-column(label="昵称",min-width="160")
              template(slot-scope="scope")
                  router-link(:to="{name:'userinfo',params:{id:scope.row.user.id}}")  {{scope.row.user.nick}}
            template(v-for="item in series.contestinfos")
              //- el-table-column(:label="`${item.name}(排名)`",min-width="160")
              el-table-column(:label="`${item.name}(通过)`",min-width="160")
                template(slot-scope="scope")
                  span {{scope.row.solved[""+item.id]?scope.row.solved[""+item.id]:"--"   }}

</template>

<script>
import { getSeries } from 'user/api/nologin';
import EventBus from 'common/eventbus';
import { submitJudgeCode } from 'user/api/user';

export default {
  data() {
    return {
      seeable: false,
      reason: '',
      series: null,
      userRankList: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const { id } = this.$route.params;
      try {
        const res = await getSeries(id);
        const { data } = res;
        this.series = data.series;
        this.userRankList = data.userranklist;
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
