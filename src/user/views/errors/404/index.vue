<template>
  <div class="content">
    <div class="wrapper">
      <h1>对不起，你要访问的页面不存在</h1>
      <router-link to="/">
        <el-button type="primary" style="margin-top: 20px">返回主页</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.wrapper {
  text-align: center;

  h1 {
    margin-top: 200px;
  }
}
</style>
