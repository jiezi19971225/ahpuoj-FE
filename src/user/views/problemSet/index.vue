<template lang="pug">
  .content
    .content__main
      .siderbar
        ul.siderbar__item__list
          li
            el-button(size="mini",round,@click="handleSearchByResetConf(0)") 重置
          li
            .section__title 查找问题：
            .siderbar__searchbar__wrapper
              el-input(size="small",style="max-width:20em", placeholder="请输入问题名或ID", @keyup.enter.native="handleSearch", v-model="queryParam", maxlength="20", clearable)
                el-button(slot="append" icon="el-icon-search", @click="handleSearch")
            .tags__wrapper
          li
            .section__title 按难度检索：
            ul.button-list
                li
                  el-button(size="mini",round,:class="[queryParams.level == -1?'is-active':'']",@click="handleSearchByLevel(-1)") 全部
                li
                  el-button(size="mini",round,:class="[queryParams.level == 0?'is-active':'']",@click="handleSearchByLevel(0)") 简单
                li
                  el-button(size="mini",round,:class="[queryParams.level == 1?'is-active':'']",@click="handleSearchByLevel(1)") 中等
                li
                  el-button(size="mini",round,:class="[queryParams.level == 2?'is-active':'']",@click="handleSearchByLevel(2)") 困难
          li
            .section__title 按标签检索：
            ul.button-list
              li
                el-button(size="mini",round,:class="[queryParams.tagId == -1?'is-active':'']",@click="handleSearchByTag(-1)") 全部
              template(v-for="tag in tags")
                li
                  el-button(size="mini",round,:class="[queryParams.tagId == tag.id?'is-active':'']",@click="handleSearchByTag(tag.id)") {{tag.name}}
      .main.has__pagination
        Paginator(style="float:left;",@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
        el-table(size="small",:data="tableData",v-loading="tableLoading",row-key="id")
          el-table-column(width="40")
            template(slot-scope="scope")
              svg-icon(name="ok",v-if="scope.row.status == 1")
              svg-icon(name="wrong",v-else-if="scope.row.status == 2")
          el-table-column(label="ID", prop="id", width="60")
          el-table-column(label="标题", min-width="160")
            template(slot-scope="scope")
              router-link(:to="{name:'problem',params:{id:scope.row.id}}") {{scope.row.title}}
          el-table-column(label="难度", min-width="60",align="center")
            template(slot-scope="scope")
              el-tag(size="small",v-if="scope.row.level==0",type="success",effect="dark") 简单
              el-tag(size="small",v-if="scope.row.level==1",type="warnning",effect="dark") 中等
              el-tag(size="small",v-if="scope.row.level==2",type="danger",effect="dark") 困难
          el-table-column(label="标签", min-width="160",align="center")
            template(slot-scope="scope")
              el-tag(size="small",v-for="tag in scope.row.tags",type="info",:key="tag.id",style="margin-left:3px;",effect="dark") {{tag.name}}
          el-table-column(label="通过率", min-width="80",align="center")
            template(slot-scope="scope") {{calcRate(scope.row)}}
          el-table-column(label="通过", prop="accepted", min-width="60",align="center")
          el-table-column(label="提交", prop="submit", min-width="60",align="center")
        Paginator.user__pagination(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
</template>

<script>
import { getProblemList, getAllTags } from 'user/api/nologin';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  name: 'problemSet',
  components: { Paginator },
  data() {
    return {
      tableLoading: false,
      currentPage: 1,
      perpage: 50,
      queryParams: {
        queryParam: '',
        tagId: -1,
        level: -1,
      },
      queryParam: '',
      tableData: [],
      total: 0,
      tags: [],
    };
  },
  async mounted() {
    getAllTags().then((res) => {
      this.tags = res.data.tags;
    });
  },
  activated() {
    if (JSON.stringify(this.$route.query) !== '{}') {
      Object.assign(this.queryParams, this.$route.query);
    }
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      this.tableLoading = true;
      try {
        const res = await getProblemList({
          page: this.currentPage,
          perpage: this.perpage,
          tag_id: this.queryParams.tagId,
          level: this.queryParams.level,
          param: this.queryParams.queryParam,
        });
        const { data } = res;
        this.tableData = data.data;
        this.total = data.total;
        this.tableLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleSearch() {
      this.currentPage = 1;
      this.fetchDataList();
    },
    handleSearchByResetConf() {
      this.queryParams.level = -1;
      this.queryParams.tagId = -1;
      this.queryParams.queryParam = '';
      this.handleSearch();
    },
    handleSearchByLevel(level) {
      this.queryParams.level = level;
      this.handleSearch();
    },
    handleSearchByTag(tagId) {
      this.queryParams.tagId = tagId;
      this.handleSearch();
    },
    calcRate(row) {
      const rate = row.submit === 0 ? 0 : row.accepted / row.submit;
      return `${(rate * 100).toFixed(2)}%`;
    },
  },
};
</script>
