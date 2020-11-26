<template lang="pug">
  .content
    title {{$route.name=="issueList"?`讨论版 总版 - AHPUOJ`:`问题P${problemId}的讨论版 - AHPUOJ`}}
    .content__main
      .one-main(v-if="issueEnable==true")
        .link(style="position:absolute;right:10px;top:10px;")
          router-link(v-if="$route.name=='problemIssueList'",:to="{name:'problem',params:{id:problemId}}") {{`转到问题`}}
        h1.content__panel__title(style="height:20px;")
          span(v-if="$route.name=='issueList'") {{"讨论版 总版"}}
          span(v-if="$route.name=='problemIssueList'") {{`问题P${problemId}的讨论版`}}
        .issue__box__list
          template(v-for="item in data")
            .issue__box
              .issue__userinfo__wrapper
                ul
                  li.issue__user__avatar
                    router-link(:to="{name:'userinfo',params:{id:item.user_id}}")
                      img(:src="imgUrl(item.avatar)")
                  li.issue__user__name.ell
                    router-link(:to="{name:'userinfo',params:{id:item.user_id}}") {{item.nick}}
              .issue__content(:class="item.is_deleted == 1?'issue-content--deleted':''")
                router-link(:to="{name:'issue',params:{id:item.id}}",target="_blank") {{item.title}}
                .issue__addon.mt10
                  el-button.fl(v-if="$store.getters.userRole=='admin'",:type="item.is_deleted == 0?'danger':'success'",size="mini",@click="toggleIssueStatus(item.id)") {{item.is_deleted == 0 ? "删除":"恢复"}}
                  .issue__addon__info.tar
                    router-link(v-if="item.problem_id>0",:to="{name:'problem',params:{id:item.problem_id}}") {{`In P${item.problem_id} ${item.problem.title}`}}
                    p(v-else) 总版
                    p.text-muted {{item.reply_count}}条回复 最后回复时间 {{item.updated_at}}
        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
        h1.mt30.content__panel__title 发表新讨论
        .post__box__wrapper
          .post__box(v-if="$store.getters.username")
            el-input(placeholder="请输入讨论标题",v-model="issueForm.title",:autofocus="true")
            tinymce-editor.mt10(v-model="replyForm.content",:height="300")
            el-button.mt10(type="primary",@click="postIssue") 发表
          a(v-else,@click="goLogin") 请登陆后发表讨论
      div(v-else-if="issueEnable==false")
        p 讨论版功能已经被管理员关闭
      div(v-else)
</template>

<script>
import { getIssueList } from 'user/api/nologin';
import TinymceEditor from 'common/components/tinymce_editor.vue';
import EventBus from 'common/eventbus';
import { postIssue, replyToIssue } from 'user/api/user';
import { toggleIssueStatus } from 'user/api/admin';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  props: {
    isProblem: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TinymceEditor,
    Paginator,
  },
  data() {
    return {
      issueEnable: null,
      currentPage: 1,
      perpage: 20,
      problemId: 0,
      data: [],
      total: 0,
      issueForm: {
        title: '',
        problem_id: 0,
      },
      active: false,
      replyForm: {
        content: '',
        reply_id: 0,
        reply_user_id: 0,
      },
    };
  },
  activated() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (this.$route.name === 'issueList') {
        this.problemId = 0;
      } else {
        this.problemId = this.$route.params.id;
      }
      try {
        const res = await getIssueList({
          id: this.problemId,
          page: this.currentPage,
          perpage: this.perpage,
        });
        const { data } = res;

        this.issueEnable = data.issue_enable;
        this.data = data.data;
        this.total = data.total;
      } catch (err) {
        console.log(err);
      }
    },
    goLogin() {
      EventBus.$emit('goLogin');
    },
    async postIssue() {
      // 标题和内容不能为空
      if (this.issueForm.title === '') {
        this.$message({
          message: '标题不能为空',
          type: 'error',
        });
        return;
      }
      if (this.issueForm.title.length > 20) {
        this.$message({
          message: '标题长度限制在20个字符以内',
          type: 'error',
        });
        return;
      }
      if (this.replyForm.content === '') {
        this.$message({
          message: '内容不能为空',
          type: 'error',
        });
        return;
      }
      try {
        let res;
        if (this.$route.name === 'problemIssueList') {
          this.issueForm.problem_id = Number.parseInt(this.$route.params.id, 10);
        } else {
          this.issueForm.problem_id = 0;
        }
        res = await postIssue(this.issueForm);
        const issueId = res.data.issue.id;
        res = await replyToIssue(issueId, this.replyForm);
        this.issueForm.title = '';
        this.replyForm.content = '';
        this.fetchDataList();
      } catch (err) {
        console.log(err);
      }
    },
    async toggleIssueStatus(issueId) {
      try {
        const res = await toggleIssueStatus(issueId);
        this.fetchDataList();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.link {
  font-size: 16px;
  line-height: 0.5rem;
  padding-right: 0.2rem;
}
.issue__box__list{
  min-height: 400px;
}
.issue__box {
  background: $--color-level15;
  position: relative;
  padding: 0.1rem;

  &:not(:last-of-type) {
    border-bottom: 0.01rem solid $--color-level13;
  }

  .issue__userinfo__wrapper {
    text-align: center;
    word-wrap: break-word;
    word-break: break-all;

    img {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 0.3rem;
      border: 0.01rem solid $--color-level12;
      box-shadow: 0.01rem 0.01rem 0.01rem 0.01rem $--color-level12;
    }

    float: left;
    width: 1rem;
  }

  .issue__user__name {
    font-size: 12px;
  }

  .issue__content {
    a {
      font-size: 16px;
    }

    box-sizing: border-box;
    padding: 0.1rem 0 0 0.3rem;
    margin-left: 1rem;
    min-height: 0.8rem;
    text-align: left;
    font-size: 14px;
  }

  .issue-content--deleted {
    // background-color: #f5f7fa;
    text-decoration: line-through;
  }

  .issue__addon {
    .issue__addon__info {
      a {
        font-size: 14px;
      }

      position: absolute;
      bottom: 0.1rem;
      right: 0.1rem;
    }
  }
}
</style>
