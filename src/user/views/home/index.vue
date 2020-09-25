<template lang="pug">
  .content
    .content__main
      .one-main(style="text-align:center;")
        p(class="welcome__title") 欢迎使用AHPUOJ
        .carousel__wrapper
          el-carousel(trigger="click",height="400px", indicator-position="outside")
            el-carousel-item
              img(src="~common/assets/images/acm.jpg")
        template(v-for="item in newList")
          .new__box
            .new__title {{item.title}}
            .new__content(v-html="item.content")
            .new__time
              span.text-muted {{item.updated_at}}
        Paginator(@change="fetchDataList",:current-page.sync="currentPage",:page-size.sync="perpage",:total="total")
      div(style="margin-top:.2rem;") 本项目基于 HUSTOJ 二次开发，项目地址
        a(href="https://github.com/ahpulug/ahpuoj",target="_blank")  https://github.com/ahpulug/ahpuoj
</template>

<script>
import { getNewList } from 'user/api/nologin';
import { mapState } from 'vuex';
import Paginator from 'user/components/Paginator/index.vue';

export default {
  name: 'home',
  components: { Paginator },
  data() {
    return {
      currentPage: 1,
      perpage: 5,
      newList: [],
      total: 0,
    };
  },
  mounted() {
    this.fetchDataList();
  },
  methods: {
    async fetchDataList() {
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      try {
        const res = await getNewList({
          page: this.currentPage,
          perpage: this.perpage,
        });
        console.log(res);
        const { data } = res;
        this.newList = data.data;
        this.total = data.total;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.welcome__title {
  padding-top: 0.2rem;
  font-size: 0.4rem;
}

.carousel__wrapper {
  padding: 0 2rem;

  .el-carousel {
    overflow: hidden;
  }
}

.new__box {
  position: relative;
  padding: 0.3rem 0.5rem;
  border-top: 1px solid $--color-level13;

  &:last-child {
    border-bottom: 1px solid $--color-level13;
  }

  .new__title {
    font-weight: bold;
    text-align: left;
    font-size: 0.2rem;
    color: $--title-color;
    margin-bottom: 0.04rem;
  }

  .new__content {
    min-height: 200px;
    text-align: left;
    font-size: 0.16rem;
  }

  .new__time {
    font-size: 0.14rem;
    position: absolute;
    bottom: 5px;
    right: 0.5rem;
  }
}
</style>
