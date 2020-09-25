<template lang="pug">
  el-pagination(@size-change="handleSizeChange",@current-change="handleCurrentPageChange",:current-page="currentPage",:page-sizes="[10, 20, 30, 40,50]",:page-size="pageSize",layout="total, sizes, prev, pager, next, jumper",:total="total")
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('update:pageSize', val);
      this.$emit('change');
    },
    handleCurrentPageChange(val) {
      this.$emit('update:currentPage', val);
      this.$emit('change');
    },
  },
};
</script>
