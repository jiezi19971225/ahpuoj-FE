import Vue from 'vue';
import Cookies from 'js-cookie';
import VueRouter from 'vue-router';
import store from '../store';
import routes from '../routes';
import 'nprogress/nprogress.css';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log('npstart');
  // NProgress.start(); // 进度条开始
  if (Cookies.get('access-token')) {
    // 如果有token
    console.log('have token');
    if (store.getters.username.length === 0) {
      try {
        const res = await store.dispatch('user/GetUserInfo'); // 拉取用户信息
        const data = res.data.user;
        console.log('get user info');
        next();
      } catch (err) {
        console.log(err);
        next();
      }
    } else {
      next();
    }
  } else {
    next(); // 没有登录 不影响正常浏览
  }
});

// router.afterEach(() => {
//   NProgress.done(); // 进度条结束
// });

export default router;
