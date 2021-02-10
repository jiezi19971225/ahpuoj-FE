<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
    <auth-form />
  </div>
</template>

<script>
import '@user/styles/main.scss'
import EventBus from '@common/eventbus'
import AuthForm from '@user/components/AuthForm/index.vue'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  components: {
    'auth-form': AuthForm,
  },
  setup() {
    document.body.removeChild(document.getElementById('Loading'))
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
})
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
