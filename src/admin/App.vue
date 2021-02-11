<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import '@admin/styles/main.scss'
import { defineComponent } from '@vue/composition-api'
import EventBus from '@common/eventbus'
import { useDispatch, useRoute, useRouter } from 'common/use'

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const dispatch = useDispatch()
    document.body.removeChild(document.getElementById('Loading'))
    EventBus.$on('errors', code => {
      switch (code) {
        case 404:
          router.replace({ name: 'admin404Page' })
          dispatch('tagsView/delViewByRoute', route.value)
          break
        default:
          router.replace({ name: 'admin404Page' })
          dispatch('tagsView/delViewByRoute', route.value)
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
  color: #2c3e50;
}
</style>
