import Vue from 'vue';
import { Message } from 'element-ui';
import Cookies from 'js-cookie';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import store from '../store';
import routes from '../routes';
import 'nprogress/nprogress.css';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});

// 动态生成路由
router.beforeEach(async (to, from, next) => {
  NProgress.start(); // 进度条开始
  let ok = false;
  if (Cookies.get('access-token')) {
    // 如果有token
    console.log('have token');
    if (store.getters.username.length === 0) {
      try {
        await store.dispatch('user/GetUserInfo'); // 拉取用户信息
      } catch (err) {
        Message.error('登录失败');
      }
    }
    if (store.getters.userRole !== 'user') {
      ok = true;
      next();
    }
  }
  if (!ok) {
    Message.error('对不起，你没有登录权限，即将跳转到首页');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }
});

router.afterEach(() => {
  NProgress.done(); // 进度条结束
});

export default router;
