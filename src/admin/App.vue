<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import 'admin/styles/main.scss'

export default defineComponent({
  name: 'App',
  setup() {
    document.body.removeChild(document.getElementById('Loading'))
  },
})
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
