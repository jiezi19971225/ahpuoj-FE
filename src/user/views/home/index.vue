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
      <div style="margin-top: 0.2rem">
        <span> 本项目基于 HUSTOJ 二次开发，项目地址 </span>
        <a href="https://github.com/jiezi19971225/ahpuojDocker" target="_blank">
          https://github.com/jiezi19971225/ahpuojDocker</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import * as nologinApi from '@user/api/nologints'
import { usePagination } from '@common/use'
import Paginator from '@user/components/Paginator/index.vue'
import { ref, onMounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'home',
  components: { Paginator },
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
</style>
