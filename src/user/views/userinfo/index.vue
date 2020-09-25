<template lang="pug">
  .content
    title {{user?`${user.nick}的个人空间`:''}}
    .content__main
      .one-main
        h1.content__panel__title 个人空间
        .main__section
          h3 用户信息
          el-row.tac
            el-col(:span="12")
              .userinfo__avatart__wrapper
                img(:src="imgUrl(user?user.avatar:'')")
            el-col(:span="12")
              ul.infolist
                li
                  span 昵称
                  span(v-if="user") {{user.nick}}
                li
                  span 解决
                  a(v-if="user",@click="jumpToSolved") {{user.solved}}
                li
                  span 提交
                  a(v-if="user",@click="jumpToSubmit") {{user.submit}}
                li
                  span 排名
                  span(v-if="user") {{user.rank}}
                li
                  span 注册时间
                  span(v-if="user") {{user.created_at}}
        .main__section
          h3 近期提交情况
          line-chart(:chart-data="chartData",:flag="renderFlag",:id="'chart'",style="width:100%;height:5rem;")
        .main__section
          h3 已解决的问题
          .problem__links(v-if="user")
            template(v-for="item,index in user.solved_problem_list")
              router-link(:to="{name:'problem',params:{id:item}}")
                el-button(type="success",size="mini") {{item}}
        .main__section
          h3 未解决的问题
          .problem__links(v-if="user")
            template(v-for="item,index in user.unsolved_problem_list")
              router-link(:to="{name:'problem',params:{id:item}}")
                el-button(type="danger",size="mini") {{item}}
</template>

<script>
import { getUserInfo } from 'user/api/user';
import LineChart from 'common/components/LineChart/index.vue';

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      user: null,
      chartData: [],
      renderFlag: false,
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        const { id } = this.$route.params;
        const res = await getUserInfo(id);
        const { data } = res;
        this.user = data.userinfo;
        this.renderFlag = true;
        this.chartData = [
          {
            legend: '累计通过',
            data: this.user.recent_solved_statistic,
          },
          {
            legend: '累计提交',
            data: this.user.recent_submit_statistic,
          },
        ];
      } catch (err) {
        console.log(err);
      }
    },
    jumpToSolved() {
      this.$router.push({
        name: 'status',
        params: {
          id: this.$route.params.id,
        },
        query: {
          result: 4,
          nick: this.user.nick,
        },
      });
    },
    jumpToSubmit() {
      this.$router.push({
        name: 'status',
        params: {
          id: this.$route.params.id,
        },
        query: {
          nick: this.user.nick,
        },
      });
    },
  },
};
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
  >*{
    margin-right: .2rem;
    margin-bottom: .1rem;
  }
  .el-button{
    width: 50px;
  }
}
</style>
