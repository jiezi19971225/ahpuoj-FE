<template>
  <div class="content">
    <div class="content__main">
      <div class="one-main has__pagination">
        <h1 class="content__panel__title">回复列表</h1>
        <div v-if="replys&amp;&amp;replys.length==0">
          <div class="reply__box">
            <p>还没有人回复你</p>
          </div>
        </div>
        <div v-else>
          <div class="reply__box" v-for="item in replys" :key="item.id">
            <router-link :to="{ name: 'userinfo', params: { id: item ? item.user_id : 0 } }">{{
              item.username
            }}</router-link
            ><span>在帖子</span>
            <router-link :to="{ name: 'issue', params: { id: item ? item.issue_id : 0 } }">{{
              item.issue_title
            }}</router-link
            ><span>中回复了你</span><br />
            <div class="reply__content" v-html="calcContent(item.content)"></div>
          </div>
        </div>
        <oj-paginator
          @change="fetchDataList"
          :current-page.sync="page"
          :page-size.sync="perpage"
          :total="total"
        ></oj-paginator>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as userApi from '@user/api/userts'
import { usePagination } from '@common/use'
import { defineComponent, onActivated, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'myreplys',
  setup() {
    const pagination = usePagination()
    const replys = ref<ReplyInfoDto[]>([])

    const fetchDataList = async () => {
      try {
        const res = await userApi.getMyReplys<MyReplysResponse>({
          page: pagination.page,
          perpage: pagination.perpage,
        })
        replys.value = res.replys
        pagination.total.value = res.total
      } catch (err) {
        console.log(err)
      }
    }

    const calcContent = content => {
      return content.length <= 100 ? content : `${content.substr(0, 100)}...`
    }

    onActivated(() => {
      fetchDataList()
    })

    return {
      ...pagination,
      replys,

      fetchDataList,
      calcContent,
    }
  },
})
</script>

<style lang="scss" scoped>
.reply__box {
  background: $--color-level15;
  position: relative;
  margin-top: 0.2rem;
  padding: 0 0.1rem 0.1rem 0.1rem;
  border-bottom: 1px solid $--color-level13;
  text-align: left;
  .reply__content {
    border-radius: 5px;
    background: $--color-level14;
    padding: 0.1rem;
    position: relative;
    box-sizing: border-box;
    min-height: 60px;
    text-align: left;
    font-size: 16px;
  }
}
</style>
