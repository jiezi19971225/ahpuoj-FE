<template>
    <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :direction="direction">
        <span>我来啦!</span>
    </el-drawer>
</template>

<script>
export default {
  name: 'problemlistDrawer',
  data() {
    return {
      drawer: false,
      direction: 'ltr',
    };
  },
  methods: {
    showDrawer() {
      this.show = true;
    },
  },
};
</script>

<style>

</style>
