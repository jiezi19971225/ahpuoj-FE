<template lang="pug">
.admin-content
  table-tools
    template(#tool)
      router-link(:to="{name:'adminAddNew'}")
        el-button(icon="el-icon-plus") 新建
    template(#search)
      el-input(placeholder="搜索新闻标题", style="max-width:20em", v-model="queryParam", @keyup.enter.native="handleSearchByParam",maxlength="20", clearable)
        el-button(slot="append",icon="el-icon-search",@click="handleSearchByParam")
  .content__table__wrapper
    el-table(:data="tableData", style="width:100%;", v-loading="loading",border)
      el-table-column(label="ID", prop="id", width="180")
      el-table-column(label="标题", prop="title")
      el-table-column(label="状态", width="180")
        template(slot-scope="scope")
          el-tag(:type="scope.row.defunct == 0 ? 'success':'danger'",effect="dark") {{scope.row.defunct == 0?'显示':'隐藏'}}
          el-tag(v-if="scope.row.top > 0", type="success",effect="dark",style="margin-left:0.04rem;") 置顶
      el-table-column(label="操作", width="300")
        template(slot-scope="scope")
          el-button(size="mini", type="primary", @click="$router.push({name:'adminEditNew',params:{id:scope.row.id}})") 编辑
          el-button(size="mini", :type="scope.row.defunct == 0?'danger':'success'", @click="handleToggleNewStatus(scope.row)") {{scope.row.defunct == 0?'隐藏':'显示'}}
          el-button(size="mini", :type="scope.row.top == 0?'success':'danger'", @click="handleToggleNewTopStatus(scope.row)") {{scope.row.top == 0?'置顶':'取置'}}
          el-button(size="mini" type="danger" @click="handleDeleteNew(scope.row)") 删除
  .content__pagination__wrapper
    Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
</template>
<script>
import {
  getNewList,
  deleteNew,
  toggleNewStatus,
  toggleNewTopStatus,
} from 'admin/api/new';
import Paginator from 'admin/components/Paginator/index.vue';

export default {
  name: 'adminNewList',
  components: { Paginator },
  data() {
    return {
      status: -1,
      loading: true,
      currentPage: 1,
      currentRowId: 0,
      perpage: 10,
      total: 0,
      queryParam: '',
      submitMode: '',
      form: {
        title: '',
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入新闻名称',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '超出长度限制',
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
    };
  },
  activated() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      this.loading = true;
      try {
        const res = await getNewList(
          this.currentPage,
          this.perpage,
          this.queryParam,
        );
        const { data } = res;
        setTimeout(() => {
          this.tableData = data.data;
          this.total = data.total;
          this.loading = false;
        }, 200);
      } catch (err) {
        console.log(err);
      }
    },
    handleSearchByParam() {
      this.currentPage = 1;
      this.loading = true;
      this.fetchDataList();
    },
    handleSizeChange(val) {
      this.perpage = val;
      this.fetchDataList();
    },
    async handleDeleteNew(row) {
      try {
        await this.$confirm(`确认要删除新闻${row.title}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          const res = await deleteNew(row.id);
          this.$message({
            type: 'success',
            message: res.data.message,
          });
          // 删除最后一页最后一条记录，如果不是第一页，则当前页码-1
          if (this.tableData.length === 1) {
            if (this.currentPage > 1) {
              this.currentPage -= 1;
            }
          }
          this.fetchDataList();
        } catch (err) {
          this.$message({
            type: 'error',
            message: err.response.data.message,
          });
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      }
    },
    async handleToggleNewStatus(row) {
      const msg = `确认要${row.defunct === 0 ? '隐藏' : '显示'}新闻${
        row.title
      }吗?`;
      try {
        await this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          const res = await toggleNewStatus(row.id);
          this.$message({
            type: 'success',
            message: res.data.message,
          });

          row.defunct = 1 - row.defunct;
        } catch (err) {
          this.$message({
            type: 'error',
            message: err.response.data.message,
          });
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      }
    },
    async handleToggleNewTopStatus(row) {
      const msg = `确认要${row.top === 0 ? '置顶' : '取置'}新闻${row.title}吗?`;
      try {
        await this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        try {
          const res = await toggleNewTopStatus(row.id);
          this.$message({
            type: 'success',
            message: res.data.message,
          });
          this.fetchDataList();
        } catch (err) {
          this.$message({
            type: 'error',
            message: err.response.data.message,
          });
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
