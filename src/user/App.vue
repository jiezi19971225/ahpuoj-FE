<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import '@user/styles/main.scss'
import EventBus from '@common/eventbus'

export default {
  name: 'App',
  mounted() {
    document.body.removeChild(document.getElementById('Loading'))
    this.initGlobalHandler()
  },
  methods: {
    initGlobalHandler() {
      EventBus.$on('errors', code => {
        switch (code) {
          case 404:
            this.$router.replace('404Page')
            break
          default:
            this.$router.replace('404Page')
        }
      })
    },
  },
}
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
