<template lang="pug">
  .content__toolbar__wrapper
    .tool
      slot(name="tool")
    .search
      slot(name="search")
</template>

<script>
export default {
  name: 'TableTools',
};
</script>
<style lang="scss" scoped>
  .content__toolbar__wrapper {
    margin-bottom: 0.05rem;
    display: flex;

    .tool {
      display: flex;

      > * {
        margin-right: 0.06rem;
      }
    }

    .search {
      margin-left: auto;
    }
  }
</style>
