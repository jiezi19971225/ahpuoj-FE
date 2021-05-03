<template>
  <div class="content">
    <div class="content__main">
      <div class="one-main" style="text-align: center">
        <p class="welcome__title">欢迎使用AHPUOJ</p>
        <div class="carousel__wrapper">
          <el-carousel trigger="click" height="400px" indicator-position="outside">
            <el-carousel-item>
              <img src="~common/assets/images/acm.jpg" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <template v-for="(item, index) in dataList">
          <div class="new__box" :key="index">
            <div class="new__title"></div>
            <div class="new__content" v-html="item.content"></div>
            <div class="new__time">
              <span class="text-muted">{{ item.updated_at }} </span>
            </div>
          </div>
        </template>
        <oj-paginator
          @change="fetchDataList"
          :current-page.sync="page"
          :page-size.sync="perpage"
          :total="total"
        ></oj-paginator>
      </div>
      <footer>
        <a class="footer-item" href="https://github.com/jiezi19971225/ahpuojDocker" target="_blank">
          <svg-icon name="github" class="footer-item-icon" />
          <div>本项目基于 HUSTOJ 二次开发，点击查看项目</div>
        </a>
        <a class="footer-item" href="http://172.16.0.3:9999" target="_blank">
          <svg-icon name="documentfull" class="footer-item-icon" />
          <div>想要参与开发工作可以查看文档</div>
        </a>
        <router-link class="footer-item" :to="{ name: 'updateLog' }" target="_blank">
          <svg-icon name="file-text" class="footer-item-icon" />
          <div>查看系统更新日志</div>
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script lang="tsx">
import * as nologinApi from '@user/api/nologints'
import { usePagination } from '@common/use'
import { ref, onMounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'home',
  setup() {
    const pagination = usePagination({
      perpage: 5,
    })
    const dataList = ref<New[]>([])
    const fetchDataList = async () => {
      try {
        // @ts-ignore
        const res = await nologinApi.getNewList<CommonPaginationResponse<New[]>>({
          page: pagination.page,
          perpage: pagination.perpage,
        })
        dataList.value = res.data
        pagination.total.value = res.total
      } catch (err) {
        console.log(err)
      }
    }

    onMounted(() => {
      fetchDataList()
    })

    return {
      ...pagination,
      dataList,
      fetchDataList,
    }
  },
})
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

footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  .footer-item {
    width: 200px;
    display: flex;
    padding: 10px;
    align-items: center;
    color: #666;
    &:hover {
      cursor: pointer;
      color: $--text-color-hover;
    }
    .footer-item-icon {
      width: 40px;
      flex-shrink: 0;
    }
    svg {
      width: 40px;
      height: 40px;
    }
  }
  margin-top: 20px;
  padding: 10px;
  border-radius: 10px;
  background: #fff;
}
</style>
