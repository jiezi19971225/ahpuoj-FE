<template>
  <div class="topbar__wrapper">
    <div class="topbar__title" v-if="app.device === 'desktop'">
      <router-link :to="{ name: 'index' }">AHPUOJ</router-link>
    </div>
    <div class="topbar__mobile_nav" v-else>
      <div class="mobile-humber" @click="toggleMobileNav">
        <a href="#" :class="{ active: showMobileNav }"
          ><span class="line"></span><span class="line"></span><span class="line"></span
        ></a>
      </div>
    </div>
    <div class="topbar__nav" v-if="app.device === 'desktop'">
      <ul class="topbar__nav__bar clearfix">
        <li
          class="topbar__nav__item topbar__section"
          v-for="item in menuList"
          :key="item.label"
          :class="{ active: activeTag === item.routeName }"
        >
          <router-link :to="{ name: item.routeName }">
            <svg-icon :name="item.icon"></svg-icon><span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="topbar__right__section">
      <div
        class="topbar__userinfo__wrapper"
        v-if="$store.getters.token && $store.getters.userDefunct == 0"
        @mouseleave="showDropDownMenu = false"
      >
        <div class="username-wrapper ell tar">
          <span class="username"> {{ $store.getters.userNick }}</span>
        </div>
        <img
          :src="getAbsoluteUrl($store.getters.userAvatar)"
          @mouseover="showDropDownMenu = true"
        />
        <el-collapse-transition>
          <ul class="topbar__userinfo__dropdown" v-if="showDropDownMenu">
            <li>
              <router-link :to="{ name: 'userinfo', params: { id: $store.getters.userId } }"
                >个人空间</router-link
              >
            </li>
            <li>
              <router-link :to="{ name: 'account' }">账号设置</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'myreplys' }">查看回复</router-link>
            </li>
            <li v-if="$store.getters.userRole !== 'user'"><a :href="adminHref">后台管理</a></li>
            <li @click="handleLogout"><a>登出</a></li>
          </ul>
        </el-collapse-transition>
      </div>
      <div class="topbar__login__wrapper" v-else @click="handleLogin">
        <el-button round="round">登录</el-button>
      </div>
    </div>
    <transition name="slide-fade">
      <el-menu
        class="topbar__mobile__nav__menu"
        @select="toggleMobileNav"
        background-color="#111144"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
        v-if="showMobileNav && app.device === 'mobile'"
      >
        <el-menu-item class="submenu-title-noDropdown" index="home" :route="{ name: 'index' }">
          <svg-icon class="m__svg" name="dashboard"></svg-icon><span>首页</span>
        </el-menu-item>
        <el-menu-item
          class="submenu-title-noDropdown"
          v-for="item in menuList"
          :key="item.label"
          :route="{ name: item.routeName }"
          :index="item.label"
        >
          <svg-icon class="m__svg" :name="item.icon"></svg-icon><span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </transition>
  </div>
</template>

<script lang="ts">
import EventBus from '@common/eventbus'
import { computed, defineComponent, markRaw, ref } from '@vue/composition-api'
import { useDispatch, useMapState, useMessge, useRoute, useRouter } from '@common/use'
import { getAbsoluteUrl } from '@common/utils'

const menuList = [
  {
    label: '问题集',
    routeName: 'problemSet',
    icon: 'problem',
  },
  {
    label: '讨论区',
    routeName: 'issueList',
    icon: 'chat',
  },
  {
    label: '评测机',
    routeName: 'status',
    icon: 'server',
  },
  {
    label: '竞赛',
    routeName: 'contestList',
    icon: 'champion',
  },
  {
    label: '系列赛',
    routeName: 'seriesList',
    icon: 'tournament',
  },
  {
    label: '排名',
    routeName: 'ranklist',
    icon: 'ranking',
  },
]

export default defineComponent({
  name: 'TopBar',
  setup() {
    markRaw(menuList)
    const adminHref = `${window.location.origin}/admin/`

    const route = useRoute()
    const router = useRouter()
    const dispatch = useDispatch()
    const message = useMessge()
    const states = useMapState({
      app: state => state.app,
    })

    const showMobileNav = ref(false)
    const showDropDownMenu = ref(false)

    const activeTag = computed(() => {
      const { name: routeName } = route.value
      if (['problemSet', 'problem'].includes(routeName)) {
        return 'problemSet'
      }
      if (['status', 'contestStatus', 'solution'].includes(routeName)) {
        return 'status'
      }
      if (
        ['contest', 'contestList', 'contestRank', 'contestTeamRank', 'contestProblem'].includes(
          routeName
        )
      ) {
        return 'contestList'
      }
      if (['ranklist'].includes(routeName)) {
        return 'ranklist'
      }
      if (['issueList', 'issue'].includes(routeName)) {
        return 'issueList'
      }
      if (['series', 'seriesList'].includes(routeName)) {
        return 'seriesList'
      }
      return ''
    })

    const toggleMobileNav = () => {
      showMobileNav.value = !showMobileNav.value
    }

    const handleLogin = () => {
      EventBus.$emit('goLogin')
    }
    const handleLogout = () => {
      showDropDownMenu.value = false
      setTimeout(() => {
        router.push({ name: 'index' })
        dispatch('user/Logout')
        message({
          message: '登出成功',
          type: 'success',
        })
      }, 500)
    }

    return {
      menuList,
      adminHref,
      activeTag,
      showMobileNav,
      showDropDownMenu,
      app: states.app,

      getAbsoluteUrl,
      toggleMobileNav,
      handleLogin,
      handleLogout,
    }
  },
})
</script>

<style lang="scss" scoped>
$mibile-nav-height: 50px;
$topbar-height: 50px;

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
  max-height: 10rem;
}

.slide-fade-enter,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 1;
}

.topbar__mobile__nav__menu {
  text-align: left;
  overflow: hidden;
  position: absolute !important;
  top: $mibile-nav-height;
  width: 100%;
  z-index: 1000;
}

.topbar__wrapper {
  box-sizing: border-box;
  position: relative;
  background: #fff;
  height: $topbar-height;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 0 0 #ddd;

  @media screen and (max-width: 960px) {
    height: $mibile-nav-height;
  }

  .topbar__title {
    text-indent: 10px;
    a {
      cursor: pointer;
    }
    height: 100%;
    line-height: $topbar-height;
    float: left;
    width: 150px;
    font-size: 30px;
    text-align: center;
    a {
      font-weight: bold;
      cursor: pointer;
      color: #999;
      transition: all 0.6s;
      &:hover {
        color: #333;
      }
    }
  }

  .topbar__nav {
    color: $--color-level9;
    position: relative;
    margin-left: 150px;
    line-height: $topbar-height;

    .topbar__nav__bar {
      display: flex;
      justify-content: space-around;
      margin-right: 200px;

      & > .topbar__nav__item {
        flex: 1 1 auto;
      }

      li.topbar__nav__item {
        display: inline-block;
        height: 100%;
        cursor: pointer;
      }
    }

    .topbar__section {
      position: relative;
      display: block;
      height: 100%;
      transition: all 0.2s ease-out;
      cursor: pointer;

      a {
        font-size: 18px;
        display: block;
        color: #666;
      }

      svg {
        vertical-align: -3px;
        height: 20px;
        margin-right: 0.05rem;
      }

      &:hover,
      &.active {
        color: #111;
        a {
          color: #111;
        }

        &::before {
          background: $--color-primary;
          transform: translate3d(0, 0, 0) scaleX(0.8);
        }
      }

      &::before {
        content: '';
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        position: absolute;
        background: $--color-blue;
        height: 0.02rem;
        width: 60%;
        transition: all 0.2s ease;
        transform: translate3d(0, 0, 0) scaleX(0);
      }

      &.active {
        color: $--color-blue;

        &::before {
          background: $--color-blue;
          transform: translate3d(0, 0, 0) scaleX(0.8);
        }
      }
    }
  }

  .topbar__right__section {
    line-height: $topbar-height;
    height: 100%;
    position: absolute;
    width: 200px;
    right: 30px;
    top: 0;

    .topbar__login__wrapper {
      width: 100px;
      float: right;

      a {
        font-size: 18px;
        display: block;
        color: #666;
        svg {
          vertical-align: -3px;
          height: 20px !important;
        }
      }
    }

    .topbar__userinfo__wrapper {
      display: flex;
      .username-wrapper {
        text-align: right;
        box-sizing: border-box;
        height: $topbar-height;
        width: 140px;
        line-height: $topbar-height;
        color: #666;
        font-size: 14px;
      }
      img {
        cursor: pointer;
        margin-left: auto;
        margin-top: 5px;
        height: 40px;
        width: 40px;
        border-radius: 40px;
      }

      .topbar__userinfo__dropdown {
        border-radius: 10px;
        position: absolute;
        width: 120px;
        top: $topbar-height;
        right: 0;
        z-index: 100;
        background: $--color-level15;
        border: 1px solid $--color-level12;
        font-size: 0.18rem;
        transition: all 0.3s;

        li {
          cursor: pointer;
          height: 40px;
          line-height: 40px;
          border-bottom: 0.01rem solid $--color-level13;
          transition: all 0.3s;
          a {
            color: #999;
            display: block;
            width: 100%;
            height: 100%;
            font-size: 14px;
            &:hover {
              color: #333;
              transition: all, 0.3s;
            }
          }
        }
      }
    }
  }
}

.topbar__mobile_nav {
  position: relative;
  height: 100%;
  float: left;

  .mobile-humber {
    margin-left: 10px;
    width: 40px;
    float: left;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 0;

    a {
      height: 100%;
      width: 100%;
      margin: 0 auto;
      display: block;
      position: relative;
      transition: all 0.3s;

      .line {
        position: absolute;
        width: 100%;
        margin: 0 auto;
        height: 2px;
        display: block;
        background: $--color-level15;
        transition: all 0.3s;

        &:nth-child(1) {
          top: 0;
        }

        &:nth-child(2) {
          top: 50%;
        }

        &:nth-child(3) {
          top: 100%;
        }
      }
    }

    .active {
      .line {
        position: absolute;
        width: 100%;
        margin: 0 auto;
        height: 2px;
        display: block;
        background: $--color-level15;
        transition: all 0.3s;

        &:nth-child(1) {
          top: 0;
          transform: translateY(15px) rotate(45deg);
        }

        &:nth-child(2) {
          display: none;
        }

        &:nth-child(3) {
          top: 100%;
          transform: translateY(-15px) rotate(-45deg);
        }
      }
    }
  }
}
</style>
