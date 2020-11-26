<template lang="pug">
  .content
    title {{issue?`${issue.title} - AHPUOJ`:''}}
    .content__main
      .one-main(v-if="issueEnable==true")
        .link(v-if="issue",style="position:absolute;right:10px;top:10px;")
          span 板块&nbsp;
          router-link(v-if="issue.problem_id == 0",:to="{name:'issueList'}") {{`总板`}}
          router-link(v-else,:to="{name:'problemIssueList',params:{id:issue.problem_id}}") {{`问题P ${issue.ptitle}`}}
        h1.content__panel__title {{issue?issue.title:''}}
        .reply__box__list
          template(v-for="item,index in replys")
            .reply__box
              .reply__userinfo__wrapper
                ul
                  li.reply__user__avatar
                    router-link(:to="{name:'userinfo',params:{id:item.user_id}}")
                      img(:src="imgUrl(item.avatar)")
                  li.reply__user__name.ell
                    router-link(:to="{name:'userinfo',params:{id:item.user_id}}") {{item.user_nick}}
              .reply__content(:class="item.is_deleted == 1?'reply-content--deleted':''")
                div(v-html="item.content")
                .reply__addon.mt10.clearfix
                  p.fr.mr10
                    span.text-muted  {{item.created_at}}&nbsp;
                    a(v-if="item.reply_count>0",@click="toggleReplyList(item)") {{`${item.reply_count}个回复(${item.showReplys ===  undefined  || item.showReplys === true ?"收起":"展开"})`}}
                  el-button.ml10(type="primary",size="mini",@click="handleReplyToReply(item.id,item.user_id)") 回复
                  el-button.ml10(v-if="$store.getters.userRole=='admin'",:type="item.is_deleted == 0?'danger':'success'",size="mini",@click="toggleReplyStatus(item.id)") {{item.is_deleted == 0 ? "删除":"恢复"}}
              el-collapse-transition
                .subreplys__wrapper.mt10(v-show="item.showReplys ===  undefined  || item.showReplys === true")
                  template(v-for="subitem,subindex in item.sub_replys")
                    .subreply__box
                      .subreply__userinfo__wrapper
                        ul
                          li.reply__user__avatar
                            router-link(:to="{name:'userinfo',params:{id:subitem.user_id}}")
                              img(:src="imgUrl(subitem.avatar)")
                          li.reply__user__name.ell
                            router-link(:to="{name:'userinfo',params:{id:subitem.user_id}}") {{subitem.user_nick}}
                      .subreply__content(:class="subitem.is_deleted == 1?'reply-content--deleted':''")
                        div(v-html="calcSubReply(subitem)")
                        .reply__addon.clearfix
                          p.fr
                            span  {{item.created_at}}&nbsp;
                          el-button.ml10(type="primary",size="mini",@click="handleReplyToReply(item.id,subitem.user_id)") 回复
                          el-button.ml10(v-if="$store.getters.userRole=='admin'",:type="subitem.is_deleted == 0?'danger':'success'",size="mini",@click="toggleReplyStatus(subitem.id)") {{subitem.is_deleted == 0 ? "删除":"恢复"}}
        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")

        h1.mt20.content__panel__title 发表新回复
        .post__box__wrapper
          .post__box(v-if="$store.getters.username")
            tinymce-editor.mt10(v-model="replyContent",:height="300")
            el-button.mt10(type="primary",@click="reply(1)") 发表
          a(v-else,@click="goLogin") 请登陆后发表讨论
      div(v-else-if="issueEnable==false")
        p 讨论版功能已经被管理员关闭
      div(v-else)
    el-dialog(title="回复内容", :visible.sync="dialogFormVisible", @closed="closeDialog", width="8rem",:close-on-click-modal="false")
      tinymce-editor(v-model="subReplyContent",:height="300")
      .dialog-footer(slot="footer")
        el-button(@click="dialogFormVisible = false") 取消
        el-button(type="primary", native-type="submit", @click="reply(2)") 确定
</template>

<script>
import { getIssue } from 'user/api/nologin';
import TinymceEditor from 'common/components/tinymce_editor.vue';
import EventBus from 'common/eventbus';
import { postIssue, replyToIssue } from 'user/api/user';
import { toggleReplyStatus } from 'user/api/admin';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  name: 'issue',
  components: {
    TinymceEditor,
    Paginator,
  },
  data() {
    return {
      issueEnable: null,
      currentPage: 1,
      dialogFormVisible: false,
      perpage: 20,
      issue: null,
      replys: [],
      total: 0,
      replyContent: '',
      subReplyContent: '',
      replyForm: {
        content: '',
        reply_id: 0,
        reply_user_id: 0,
      },
    };
  },
  mounted() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList(resetScroll) {
      if (resetScroll !== false) {
        window.pageYOffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      try {
        const res = await getIssue({
          id: this.$route.params.id,
          page: this.currentPage,
          perpage: this.perpage,
        });
        const { data } = res;
        this.issue = data.issue;
        this.replys = data.replys;
        this.total = data.total;
        this.issueEnable = data.issue_enable;
      } catch (err) {
        console.log(err);
      }
    },
    closeDialog() {
      this.subReplyContent = '';
    },
    goLogin() {
      EventBus.$emit('goLogin');
    },
    calcSubReply(subReply) {
      if (subReply.reply_user_nick) {
        return `回复${subReply.reply_user_nick}: ${subReply.content}`;
      }
      return subReply.content;
    },
    toggleReplyList(item) {
      if (item.showReplys === undefined) {
        // 添加响应属性
        this.$set(item, 'showReplys', false);
      } else {
        item.showReplys = !item.showReplys;
      }
    },
    // way = 1 表示回复主题 way = 2 表示回复某个回复
    async reply(way) {
      console.log(way);
      // 内容不能为空
      this.replyForm.content = way === 1 ? this.replyContent : this.subReplyContent;
      if (this.replyForm.content === '') {
        this.$message({
          message: '内容不能为空',
          type: 'error',
        });
        return;
      }
      try {
        // 对主题的回复
        if (way === 1) {
          console.log('way1');
          this.replyForm.reply_id = 0;
          this.replyForm.reply_user_id = 0;
        }
        const res = await replyToIssue(this.issue.id, this.replyForm);
        this.replyForm.content = '';
        this.replyContent = '';
        this.dialogFormVisible = false;
        this.fetchDataList(false);
      } catch (err) {
        console.log(err);
      }
    },
    handleReplyToReply(replyId, replyUserId) {
      console.log(replyId, replyUserId);
      if (!this.$store.getters.username) {
        this.$message({
          message: '请登录后发表回复',
          type: 'error',
        });
        return;
      }
      this.dialogFormVisible = true;
      this.replyForm.reply_id = replyId;
      this.replyForm.reply_user_id = replyUserId;
    },
    async toggleReplyStatus(replyId) {
      try {
        const res = await toggleReplyStatus(replyId);
        this.fetchDataList(false);
      } catch (err) {
        this.$message({
          message: err.response.data.message,
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.link {
  font-size: 0.16rem;
  line-height: 0.5rem;
  padding-right: 0.2rem;
}

h1.content__panel__title {
  background: $--color-level15;
}

.reply__box {
  background: $--color-level15;
  position: relative;
  padding: 0.1rem;

  &:not(:last-of-type) {
    border-bottom: 1px solid $--color-level13;
  }

  .reply__userinfo__wrapper {
    text-align: center;

    img {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 0.3rem;
      border: 1px solid $--color-level12;
      box-shadow: 1px 1px 1px 1px $--color-level12;
    }

    float: left;
    width: 1rem;

    .reply__user__name {
      font-size: 0.14rem;
    }
  }

  .reply__content {
    position: relative;
    box-sizing: border-box;
    padding: 0.1rem 0.2rem 0.6rem 0.1rem;
    margin-left: 1rem;
    min-height: 100px;
    text-align: left;
    font-size: 0.16rem;
  }

  .reply-content--deleted {
    background-color: #f5f7fa;
    text-decoration: line-through;
  }

  .reply__addon {
    p span,
    a {
      vertical-align: -0.05rem;
    }

    font-size: 0.14rem;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0.1rem;
  }

  .subreplys__wrapper {
    .subreply__box {
      padding: 0.1rem;
      margin-left: 1rem;
      border-top: 1px solid $--color-level13;

      .subreply__userinfo__wrapper {
        text-align: center;
        padding-top: 20px;

        img {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid $--color-level12;
          box-shadow: 1px 1px 1px 1px $--color-level12;
        }

        float: left;
        width: 1rem;
      }

      .subreply__content {
        position: relative;
        box-sizing: border-box;
        padding: 0.15rem 0.15rem 0.6rem 0.15rem;
        margin-left: 1rem;
        min-height: 100px;
        text-align: left;
        font-size: 0.16rem;
      }
    }
  }
}
</style>
