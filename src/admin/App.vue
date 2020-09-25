<template lang="pug">
  #app
    transition
      router-view
  </div>
</template>

<script>
import 'admin/styles/main.scss';

export default {
  name: 'App',
  created() {
    document.body.removeChild(document.getElementById('Loading'));
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
