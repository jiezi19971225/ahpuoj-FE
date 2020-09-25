<template lang="pug">
  .content
    .content__main
      .home__wrapper
        h1 对不起，你要访问的页面不存在，即将跳转到主页
        img(src="~common/assets/images/404.jpg")
</template>

<script>
export default {
  data() {
    return {
      timer: 0,
    };
  },
  mounted() {
    const timer = setTimeout(() => {
      console.log('index');
      this.$router.replace({ name: 'index' });
    }, 3000);
    this.$on('hook:beforeDestroy', () => {
      clearTimeout(timer);
    });
  },
};
</script>

<style lang="scss" scoped>
.home__wrapper {
  height: 100%;
  background: $--color-level15;
}
</style>
