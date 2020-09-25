 <template lang="pug">
  .content
    .content__main
      .siderbar
        .tags__wrapper
          ul.siderbar__item__list
            li
              .section__title 查找系列赛：
              .siderbar__searchbar__wrapper
                el-input(size="small",style="max-width:20em", placeholder="请输入系列赛名称", @keyup.enter.native="handleSearchByParam", v-model="queryParam", maxlength="20", clearable)
                  el-button(slot="append" icon="el-icon-search", @click="handleSearchByParam")
      .main.has__pagination
        el-table(size="small",:data="tableData")
          el-table-column(label="名称", min-width="180")
            template(slot-scope="scope")
              router-link(:to="{name:'series',params:{id:scope.row.id}}") {{scope.row.name}}
          el-table-column(label="模式", min-width="150")
            template(slot-scope="scope")
              el-tag(size="small",:type="scope.row.team_mode == 0 ? 'success':'primary'",effect="dark") {{ scope.row.team_mode == 0?"个人系列赛":"团体系列赛" }}
        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
</template>

<script>
import { getSeriesList } from 'user/api/nologin';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  data() {
    return {
      loading: false,
      currentPage: 1,
      perpage: 10,
      queryParam: '',
      tableData: [],
      total: 0,
      tags: [],
    };
  },
  components: { Paginator },
  activated() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      this.loading = true;
      try {
        const res = await getSeriesList({
          page: this.currentPage,
          perpage: this.perpage,
          param: this.queryParam,
        });
        const { data } = res;
        this.tableData = data.data;
        this.total = data.total;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleSearchByParam() {
      this.currentPage = 1;
      this.fetchData();
    },
  },
};
</script>
