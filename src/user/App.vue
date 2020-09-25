<template lang="pug">
  #app
    transition
      router-view
  </div>
</template>

<script>
import 'user/styles/main.scss';

export default {
  name: 'App',
  mounted() {
    document.body.removeChild(document.getElementById('Loading'));
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
