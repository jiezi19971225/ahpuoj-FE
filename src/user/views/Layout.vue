<template>
  <div class="front__page">
    <title v-if="$route.meta.title">{{ $route.meta.title }}</title>
    <top-bar></top-bar>
    <transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 500, leave: 0 }"
      appear="appear"
      appear-active-class="animated fadeInUp fade-enter-active"
      enter-active-class="animated fadeInUp fade-enter-active"
      leave-active-class="animated fade-leave-active"
    >
      <router-view v-if="$route.meta.keepAlive !== true" :key="$route.fullPath"></router-view>
    </transition>
    <transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 500, leave: 0 }"
      appear="appear"
      appear-active-class="animated fadeInUp fade-enter-active"
      enter-active-class="animated fadeInUp fade-enter-active"
      leave-active-class="animated fade-leave-active"
    >
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive === true"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { defineComponent, onUnmounted } from '@vue/composition-api'
import { useDispatch } from 'common/use'
import { debounce } from 'lodash'
import TopBar from '@user/components/TopBar/index.vue'

const { body } = document
const WIDTH = 960

export default defineComponent({
  name: 'Layout',
  components: {
    'top-bar': TopBar,
  },
  setup() {
    const dispatch = useDispatch()
    const getIsMobile = () => {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    }

    const resizeHandler = debounce(() => {
      if (!document.hidden) {
        const isMobile = getIsMobile()
        dispatch('app/setDevice', isMobile ? 'mobile' : 'desktop')
      }
    }, 100)

    resizeHandler()
    window.addEventListener('resize', resizeHandler)

    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })
  },
})
</script>

<style lang="scss" scoped type="text/css">
.animated {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.userlayout__transtion {
  animation-duration: 3s;
  animation-delay: 0s;
}
</style>
