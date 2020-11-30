<template lang="pug">
  .content
    .content__main
      .siderbar
        ul.siderbar__item__list
          li
            .tags__wrapper
              .section__title 查找竞赛：
              .siderbar__searchbar__wrapper
                el-input(size="small",style="max-width:20em", placeholder="请输入竞赛名称", @keyup.enter.native="handleSearchByParam", v-model="queryParam", maxlength="20", clearable)
                  el-button(slot="append" icon="el-icon-search", @click="handleSearchByParam")
      .main.has__pagination
        el-table(size="small",:data="tableData",v-loading="tableLoading")
          el-table-column(width="90")
            template(slot-scope="scope")
              el-tag(size="small",v-if="scope.row.status==1",type="success",effect="dark") 未开始
              el-tag(size="small",v-if="scope.row.status==2",type="primary",effect="dark") 进行中
              el-tag(size="small",v-if="scope.row.status==3",type="danger",effect="dark") 已结束
          el-table-column(label="名称", min-width="180")
            template(slot-scope="scope")
              router-link(:to="{name:'contest',params:{id:scope.row.id}}") {{scope.row.name}}
          el-table-column(label="模式", min-width="150")
            template(slot-scope="scope")
              el-tag(size="small",:type="scope.row.private == 0 ? 'success':'danger'",effect="dark") {{ scope.row.private == 0?"公开赛":"私有赛" }}
              el-tag(size="small",:type="scope.row.team_mode == 0 ? 'success':'primary'",effect="dark",style="margin-left:3px;") {{ scope.row.team_mode == 0?"个人赛":"团体赛" }}
          el-table-column(label="开始时间", min-width="100",prop="start_time")
          el-table-column(label="结束时间", min-width="100",prop="end_time")
        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
</template>

<script>
import { getContestList } from 'user/api/nologin';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  name: 'contestList',
  components: { Paginator },
  data() {
    return {
      tableLoading: false,
      currentPage: 1,
      perpage: 20,
      queryParam: '',
      tableData: [],
      total: 0,
      tags: [],
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
      this.tableLoading = true;
      try {
        const res = await getContestList({
          page: this.currentPage,
          perpage: this.perpage,
          param: this.queryParam,
        });
        const { data } = res;
        this.tableData = data.data;
        this.total = this.tableData.length;
        this.tableLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleSearchByParam() {
      this.currentPage = 1;
      this.tableLoading = true;
      this.fetchDataList();
    },
    spliteDate(dateTimeString) {
      return dateTimeString.split(' ')[0];
    },
    spliteTime(dateTimeString) {
      return dateTimeString.split(' ')[1];
    },
  },
};
</script>
<style lang="scss" scoped>
.contestlist__time__tag {
  display: inline-block;
}
</style>
