<template lang="pug">
  .content
    .content__main
      .one-main.has__pagination
        el-table(size="small",:data="tableData",v-loading="tableLoading")
          el-table-column(label="排名", width="60")
            template(slot-scope="scope")
              span {{ (currentPage-1) * 50 + scope.$index + 1}}
          el-table-column(label="用户",width="70")
            template(slot-scope="scope")
                router-link(:to="{name:'userinfo',params:{id:scope.row.id}}")
                  .user__avatar__wrapper
                    img(:src="imgUrl(scope.row.avatar)",class="user__avatar")
          el-table-column
            template(slot-scope="scope")
              router-link(:to="{name:'userinfo',params:{id:scope.row.id}}")
                span {{`${scope.row.nick}`}}
          el-table-column(label="通过率", width="80")
            template(slot-scope="scope") {{calcRate(scope.row)}}
          el-table-column(label="解决",width="70",prop="solved")
          el-table-column(label="提交",width="70",prop="submit")

        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
</template>

<script>
import { getRankList } from 'user/api/nologin';
import { setTimeout } from 'timers';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  name: 'ranklist',
  components: { Paginator },
  data() {
    return {
      tableLoading: false,
      currentPage: 1,
      perpage: 50,
      problemId: 0,
      tableData: [],
      total: 0,
    };
  },
  mounted() {
    this.fetchDataList();
  },
  methods: {
    test(row) {
      console.log(row);
    },
    async fetchDataList() {
      this.tableLoading = true;
      try {
        const res = await getRankList({
          page: this.currentPage,
          perpage: this.perpage,
        });
        const { data } = res;
        this.tableData = data.data;
        this.total = data.total;
        this.tableLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    calcRate(row) {
      const rate = row.submit === 0 ? 0 : row.solved / row.submit;
      return `${Number(rate * 100).toFixed(2)}%`;
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
