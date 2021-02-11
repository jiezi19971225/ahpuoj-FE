<template>
  <div class="content__toolbar__wrapper">
    <div class="tool">
      <slot name="tool"></slot>
    </div>
    <div class="search">
      <slot name="search"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableTools',
}
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
