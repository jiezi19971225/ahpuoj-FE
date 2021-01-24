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
import TopBar from 'user/components/topbar.vue'

const { body } = document
const WIDTH = 960

export default {
  name: 'Layout',
  components: {
    TopBar,
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    this.$_resizeHandler()
  },
  methods: {
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        this.$store.dispatch('app/setDevice', isMobile ? 'mobile' : 'desktop')
      }
    },
  },
}
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
