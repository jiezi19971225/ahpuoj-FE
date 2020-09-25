<template lang="pug">
  el-pagination(@size-change="handleSizeChange",@current-change="handleCurrentPageChange",:current-page="currentPage",background,:page-size="pageSize",:pager-count="5",:layout="'prev, pager, next'+(device=='desktop'?',jumper':'')",:total="total")
</template>

<script>
import { mapState } from 'vuex';

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
  computed: {
    ...mapState({
      device: (state) => state.app.device,
    }),
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
