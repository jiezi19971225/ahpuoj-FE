<template lang="pug">
  .content
    .content__main
      .siderbar
        ul.siderbar__item__list
          li
           el-button(size="mini",round,@click="handleSearchByResetConf()") 重置
           el-button(size="mini",round,@click="handleSearchMine(0)",:disabled="$store.getters.username.length===0") 我的记录
          li
            .section__title 按问题检索：
            .siderbar__searchbar__wrapper
              el-input(size="small",style="max-width:20em", :placeholder="!isContest?'请输入问题名/ID':'请输入题号(如A)'", @keyup.enter.native="handleSearch", v-model="queryParams.queryParam", maxlength="20", clearable)
                el-button(slot="append" icon="el-icon-search", @click="handleSearch")
          li
            .section__title 按用户检索：
            .siderbar__searchbar__wrapper
              el-input(size="small",style="max-width:20em", placeholder="请输入用户昵称", @keyup.enter.native="handleSearch", v-model="queryParams.nick", maxlength="20", clearable)
                el-button(slot="append" icon="el-icon-search", @click="handleSearch")
          li
            .section__title 按语言检索：
            ul.button-list
              li
                el-button(size="mini",round,:class="[queryParams.language == -1?'is-active':'']", @click="handleSearchByLanguage(-1)",) 全部
              template(v-for="item,index in langList")
                li(v-if="item.available")
                  el-button(size="mini",round,:class="[queryParams.language == index?'is-active':'']",@click="handleSearchByLanguage(index)") {{item.name}}
          li
            .section__title 按结果检索：
            ul.button-list
              li
                el-button(size="mini",round,:class="[queryParams.result==-1?'is-active':'']", @click="handleSearchByResult(-1)") 全部
              template(v-for="item in searchableResultList")
                li
                  el-button(size="mini",round,:class="[queryParams.result==item.code?'is-active':'']", @click="handleSearchByResult(item.code)") {{item.name}}
      .main.has__pagination
        Paginator(style="float:left;",@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
        el-table(size="small",:data="tableData", v-loading="tableLoading")
          el-table-column(label="ID", prop="solution_id", width="60")
          el-table-column(label="用户",min-width="70")
            template(slot-scope="scope")
                router-link(:to="{name:'userinfo',params:{id:scope.row.user_id}}")
                  .user__avatar__wrapper
                    img(:src="imgUrl(scope.row.avatar)",class="user__avatar")
          el-table-column( min-width="180")
            template(slot-scope="scope")
              router-link(:to="{name:'userinfo',params:{id:scope.row.user_id}}")
                span {{`${scope.row.nick}`}}
          el-table-column(label="问题", min-width="180")
            template(slot-scope="scope")
              router-link(:to="isContest?{name:'contestProblem',params:{id:contestId,num:scope.row.num}}:{name:'problem',params:{id:scope.row.problem_id}}") {{ !isContest?`P${scope.row.problem_id} ${scope.row.problem_title}`:`${engNum(scope.row.num)} ${scope.row.problem_title}` }}
          el-table-column(label="评测状态", min-width="80")
            template(slot-scope="scope")
              router-link(:to="{name:'solution',params:{id:scope.row.solution_id}}")
                el-button(size="mini",:type="calcRerultType(scope.row.result)") {{ resultList[scope.row.result]?resultList[scope.row.result].name:"" }}
          el-table-column(label="语言", min-width="80")
            template(slot-scope="scope")
              span {{ langList[scope.row.language].name}}
          el-table-column(label="时间", min-width="80")
            template(slot-scope="scope")
              span {{ `${scope.row.time}ms`}}
          el-table-column(label="内存", min-width="80")
            template(slot-scope="scope")
              span {{ `${scope.row.memory}KB`}}
          el-table-column(label="代码长度", min-width="80")
            template(slot-scope="scope")
              span {{ calcCodeLength(scope.row.code_length)}}
          el-table-column(label="评测时间", min-width="75")
            template(slot-scope="scope")
              div(style="word-break:break-word;white-space:pre-line;") {{scope.row.judgetime}}
          el-table-column(label="公开", min-width="60",v-if="!isContest")
            template(slot-scope="scope")
              span {{ scope.row.public == 1?"是":"否"}}
        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
</template>

<script>
import { getSolutionList, getLanguageList } from 'user/api/nologin';
import { resultList } from 'common/const';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  name: 'status',
  components: { Paginator },
  props: {
    isContest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableLoading: false,
      currentPage: 1,
      perpage: 30,
      tableData: [],
      queryParams: {
        queryParam: '',
        nick: '',
        language: -1,
        result: -1,
      },
      contestId: 0,
      contestPnum: -1,
      total: 0,
      langList: [],
      resultList,
      timer: 0,
    };
  },
  computed: {
    searchableResultList() {
      return this.resultList.filter(
        (val, index, arr) => val.code >= 4 && val.code <= 11,
      );
    },
  },
  async mounted() {
    const res = await getLanguageList().then((res) => {
      this.langList = res.data.languages;
    });
  },
  activated() {
    if (this.isContest) {
      this.contestId = this.$route.params.id;
    } else {
      this.contestId = 0;
    }
    if (JSON.stringify(this.$route.query) !== '{}') {
      Object.assign(this.queryParams, this.$route.query);
    }
    // 10s请求一次数据
    const timer = setInterval(() => {
      this.fetchDataList();
    }, 10000);
    this.$on('hook:deactivated', () => {
      clearInterval(timer);
    });
    this.tableLoading = true;
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      try {
        const res = await getSolutionList({
          contest_id: this.contestId,
          page: this.currentPage,
          perpage: this.perpage,
          param: this.queryParams.queryParam,
          username: this.queryParams.nick,
          language: this.queryParams.language,
          result: this.queryParams.result,
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
      this.queryParams.queryParam = '';
      this.queryParams.nick = '';
      this.queryParams.language = -1;
      this.queryParams.result = -1;
      this.handleSearch();
    },
    handleSearchMine() {
      this.queryParams.nick = this.$store.getters.userNick;
      this.handleSearch();
    },
    handleSearchByLanguage(language) {
      this.queryParams.language = language;
      this.handleSearch();
    },
    handleSearchByResult(result) {
      this.queryParams.result = result;
      this.handleSearch();
    },
    calcRate(row) {
      const rate = row.submit === 0 ? 0 : row.solved / row.submit;
      return `${Number(rate * 100).toFixed(2)}%`;
    },
    calcRerultType(result) {
      if (result === 4) {
        return 'success';
      }
      return 'danger';
    },
    calcCodeLength(codeLength) {
      return `${Number(codeLength / 1000).toFixed(2)}KB`;
    },
  },
};
</script>
<style lang="scss" scoped>
.user__avatar__wrapper {
  img {
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }
}
</style>
