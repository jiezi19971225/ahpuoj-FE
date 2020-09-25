<template lang="pug">
.topbar__wrapper
  .topbar__title(v-if="device==='desktop'")
    router-link(:to="{name:'index'}") AHPUOJ
  .topbar__mobile_nav(v-else)
    .mobile-humber(@click="toggleMobileNav")
      a(href="#", :class="{active:showMobileNav}")
        span.line
        span.line
        span.line
  .topbar__nav(v-if="device==='desktop'")
    ul.topbar__nav__bar.clearfix
      li.topbar__nav__item.topbar__section(v-for="item in menuList",:key="item.label",@click="handleMenuItemClick(item)",:class="{active:activeTag === item.routeName}")
        router-link(:to="{name:item.routeName}")
          svg-icon(:name="item.icon")
          span {{item.label}}
  .topbar__right__section
    .topbar__userinfo__wrapper(v-if="$store.getters.token && $store.getters.userDefunct == 0",@mouseleave="showDropDownMenu=false")
      .username-wrapper.ell.tar
        span.username  {{$store.getters.userNick}}
      img(:src="imgUrl($store.getters.userAvatar)",@mouseover="showDropDownMenu = true")
      el-collapse-transition
        ul.topbar__userinfo__dropdown(v-if="showDropDownMenu")
          li
            router-link(:to="{name:'userinfo',params:{id:$store.getters.userId}}") 个人空间
          li
            router-link(:to="{name:'account'}") 账号设置
          li
            router-link(:to="{name:'myreplys'}") 查看回复
          li(v-if="$store.getters.userRole!=='user'")
            a(:href="adminHref") 后台管理
          li(@click="handleLogout")
            a 登出

    .topbar__login__wrapper(v-else, @click="handleLogin")
        el-button(round) 登录

  transition(name="slide-fade")
      el-menu(@select="toggleMobileNav",class="topbar__mobile__nav__menu",background-color="#111144",
      text-color="#fff",active-text-color="#ffd04b",:router="true", v-if="showMobileNav && device === 'mobile' ")
        el-menu-item(index="home", :route="{name:'index'}", class="submenu-title-noDropdown")
          svg-icon.m__svg(name="dashboard")
          span 首页
        el-menu-item.submenu-title-noDropdown(v-for="item in menuList",:key="item.label",@click.native="handleMenuItemClick(item)",:route="{name:item.routeName}",:index="item.label")
          svg-icon.m__svg(:name="item.icon")
          span {{item.label}}

  el-dialog(:visible.sync="dialogFormVisible",width="5rem",:close-on-click-modal="false",custom-class="auth__dialog__wrapper")
    .auth__dialog
      .title(slot="header")
        span(:class="[method=='login'?'active':'']",@click="method='login'") &nbsp登 录&nbsp
        span(:class="[method=='register'?'active':'']", @click="method='register'") &nbsp注 册&nbsp
      el-form(v-if="method=='login'", ref="loginForm", :model="loginForm", :rules="loginRules", key="login")
        el-form-item(prop="username")
          el-input(v-model="loginForm.username", placeholder="请输入用户名")
            svg-icon(slot="prefix", name="user", class="auth__input__prefix")
        el-form-item(prop="password")
          el-input(v-model="loginForm.password",type="password", placeholder="请输入密码")
              svg-icon(slot="prefix", name="password", class="auth__input__prefix")
        el-form-item
          el-button(type="primary",style="width:100%;", @click="submitLogin") 登录
        router-link(:to="{name:'findpass'}",target="_blank") 忘记密码？点击找回
      el-form(v-if="method=='register'", ref="registerForm", :model="registerForm", :rules="registerRules", key="register")
        el-form-item(prop="email")
          el-input(v-model="registerForm.email", placeholder="请输入邮箱")
            svg-icon(slot="prefix", name="email", class="auth__input__prefix")
        el-form-item(prop="username")
          el-input(v-model="registerForm.username", placeholder="请输入用户名")
            svg-icon(slot="prefix", name="user", class="auth__input__prefix")
        el-form-item(prop="nick")
          el-input(v-model="registerForm.nick", placeholder="请输入昵称")
            svg-icon(slot="prefix", name="user", class="auth__input__prefix")
        el-form-item(prop="password")
          el-input(v-model="registerForm.password",type="password", placeholder="请输入密码")
            svg-icon(slot="prefix", name="password", class="auth__input__prefix")
        el-form-item(prop="confirmpassword")
          el-input(v-model="registerForm.confirmpassword",type="password", placeholder="请确认密码")
            svg-icon(slot="prefix", name="password", class="auth__input__prefix")
        el-form-item
          el-button(type="primary",style="width:100%;",@click="submitRegister") 注册
</template>

<script>
import { login, register } from 'user/api/auth';
import EventBus from 'common/eventbus';
import { mapState } from 'vuex';

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerForm.confirmpassword !== '') {
          this.$refs.registerForm.validateField('confirmpassword');
        }
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      showMobileNav: false,
      showDropDownMenu: false,
      dialogFormVisible: false,
      method: 'login',
      menuList: [
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
      ],
      loginForm: {
        username: '',
        password: '',
      },
      registerForm: {
        email: '',
        username: '',
        nick: '',
        password: '',
        confirmpassword: '',
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
      registerRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur',
          },
        ],
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '用户名不能超过20个字符',
            trigger: 'blur',
          },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '用户名只能包含英文和数字字符',
            trigger: 'blur',
          },
        ],
        nick: [
          {
            required: true,
            message: '请输入用户昵称',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '昵称不能超过20个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {
            validator: validatePassword,
            trigger: 'blur',
          },
          {
            min: 6,
            message: '密码不能少于6个字符',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '密码不能超过20个字符',
            trigger: 'blur',
          },
        ],
        confirmpassword: [
          {
            validator: validateConfirmPassword,
            trigger: 'blur',
          },
          {
            min: 6,
            message: '密码不能少于6个字符',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '密码不能超过20个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      device: (state) => state.app.device,
    }),
    adminHref(){
      return location.origin + "/admin/"
    },
    activeTag() {
      const { name: routeName } = this.$route;
      if (['problemSet', 'problem'].includes(routeName)) {
        return 'problemSet';
      }
      if (['status', 'contestStatus', 'solution'].includes(routeName)) {
        return 'status';
      }
      if (['contest', 'contestList', 'contestRank', 'contestTeamRank', 'contestProblem'].includes(routeName)) {
        return 'contestList';
      }
      if (['ranklist'].includes(routeName)) {
        return 'ranklist';
      }
      if (['issueList', 'issue'].includes(routeName)) {
        return 'issueList';
      }
      if (['series', 'seriesList'].includes(routeName)) {
        return 'seriesList';
      }
      return '';
    },
  },
  mounted() {
    EventBus.$on('goLogin', () => {
      this.handleLogin();
    });
  },
  methods: {
    toggleMobileNav() {
      this.showMobileNav = !this.showMobileNav;
    },
    handleLogin() {
      this.dialogFormVisible = true;
    },
    handleLogout() {
      this.showDropDownMenu = false;
      setTimeout(() => {
        this.$router.push({ name: 'index' });
        this.$store.dispatch('user/Logout');
        this.$message({
          message: '登出成功',
          type: 'success',
        });
      }, 500);
    },
    submitLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$store.dispatch('user/Login', this.loginForm);
            this.$message({
              message: res.data.message,
              type: 'success',
            });
            this.dialogFormVisible = false;
            this.showDropDownMenu = false;
            await this.$store.dispatch('user/GetUserInfo');
            this.$router.replace({ name: 'refresh' });
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    async submitRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$store.dispatch('user/Register', this.registerForm);
            console.log(res);
            this.$message({
              message: res.data.message,
              type: 'success',
            });
            this.dialogFormVisible = false;
            this.showDropDownMenu = false;
            await this.$store.dispatch('user/GetUserInfo');
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    handleMenuItemClick(item) {
      if (item.label === '评测机') {
        this.$store.dispatch('bus/resetSolutionFilter');
      }
    },
  },
};
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
      font-weight:bold;
      cursor: pointer;
      color: #999;
      transition: all .6s;
      &:hover{
        color:#333;
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

      &:hover,&.active {
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
        content: "";
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
              transition:all, .3s;
            }
          }
        }
      }
    }
  }
}

.auth__dialog {
  border-radius: 10px;

  .title {
    text-align: left;
    margin-bottom: 0.1rem;
    padding-left: 0.1rem;
    color: $--color-blue;
    font-size: 24px;

    span {
      cursor: pointer;
      color: $--color-level10;
      border-bottom: 4px solid $--color-level12;
    }

    span.active {
      color: $--color-blue;
      border-bottom: 4px solid $--color-blue;
    }
  }

  .auth__input__prefix {
    height: 100%;
    line-height: 100%;
    width: 20px;
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
