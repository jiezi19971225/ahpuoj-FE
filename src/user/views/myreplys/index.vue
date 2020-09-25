<template lang="pug">
  .content
    .content__main
      .one-main.has__pagination
        h1.content__panel__title 回复列表
        div(v-if="replys&&replys.length==0")
          .reply__box
            p 还没有人回复你
        div(v-else)
          template(v-for="(item,index) in replys")
            .reply__box
              router-link(:to="{name:'userinfo',params:{id:item?item.user_id:0}}") {{item.username}}
              span 在帖子
              router-link(:to="{name:'issue',params:{id:item?item.issue_id:0}}") {{item.issue_title}}
              span 中回复了你
              br
              .reply__content(v-html="calcContent(item.content)")
        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
</template>

<script>
import TinymceEditor from 'common/components/tinymce_editor.vue';
import EventBus from 'common/eventbus';
import { getMyReplys } from 'user/api/user';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  name: 'myreplys',
  components: {
    TinymceEditor,
    Paginator,
  },
  data() {
    return {
      currentPage: 1,
      dialogFormVisible: false,
      perpage: 20,
      replys: [],
      total: 0,
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
        const res = await getMyReplys({
          page: this.currentPage,
          perpage: this.perpage,
        });
        const { data } = res;
        this.replys = data.replys;
        this.total = data.total;
      } catch (err) {
        console.log(err);
      }
    },
    calcContent(content) {
      return content.length <= 100 ? content : `${content.substr(0, 100)}...`;
    },
  },
};
</script>

<style lang="scss" scoped>
.reply__box {
  background: $--color-level15;
  position: relative;
  margin-top: 0.2rem;
  padding: 0 0.1rem 0.1rem 0.1rem;
  border-bottom: 1px solid $--color-level13;
  text-align: left;
  .reply__content {
    border-radius: 5px;
    background: $--color-level14;
    padding: 0.1rem;
    position: relative;
    box-sizing: border-box;
    min-height: 60px;
    text-align: left;
    font-size: 16px;
  }
}
</style>
