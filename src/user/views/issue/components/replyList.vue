<template>
  <div>
    <div class="reply__box__list">
      <div class="reply__box" v-for="item in dataList" :key="item.id">
        <div class="reply__userinfo__wrapper">
          <ul>
            <li class="reply__user__avatar">
              <router-link :to="{ name: 'userinfo', params: { id: item.user_id } }"
                ><img :src="getAbsoluteUrl(item.avatar)"
              /></router-link>
            </li>
            <li class="reply__user__name ell">
              <router-link :to="{ name: 'userinfo', params: { id: item.user_id } }">{{
                item.user_nick
              }}</router-link>
            </li>
          </ul>
        </div>
        <div class="reply__content" :class="item.is_deleted == 1 ? 'reply-content--deleted' : ''">
          <div v-html="item.content"></div>
          <div class="reply__addon mt10 clearfix">
            <p class="fr mr10">
              <span class="text-muted"> {{ item.created_at }}&nbsp;</span
              ><a v-if="item.reply_count > 0" @click="toggleReplyList(item)">{{
                `${item.reply_count}个回复(${
                  item.showReplys === undefined || item.showReplys === true ? '收起' : '展开'
                })`
              }}</a>
            </p>
            <el-button
              class="ml10"
              type="primary"
              size="mini"
              @click="handleReplyToReply(item.id, item.user_id)"
              >回复</el-button
            >
            <el-button
              class="ml10"
              v-if="$store.getters.userRole == 'admin'"
              :type="item.is_deleted == 0 ? 'danger' : 'success'"
              size="mini"
              @click="toggleReplyStatus(item.id)"
              >{{ item.is_deleted == 0 ? '删除' : '恢复' }}</el-button
            >
          </div>
        </div>
        <el-collapse-transition>
          <div
            class="subreplys__wrapper mt10"
            v-show="item.showReplys === undefined || item.showReplys === true"
          >
            <div class="subreply__box" v-for="subitem in item.sub_replys" :key="subitem.id">
              <div class="subreply__userinfo__wrapper">
                <ul>
                  <li class="reply__user__avatar">
                    <router-link :to="{ name: 'userinfo', params: { id: subitem.user_id } }"
                      ><img :src="getAbsoluteUrl(subitem.avatar)"
                    /></router-link>
                  </li>
                  <li class="reply__user__name ell">
                    <router-link :to="{ name: 'userinfo', params: { id: subitem.user_id } }">{{
                      subitem.user_nick
                    }}</router-link>
                  </li>
                </ul>
              </div>
              <div
                class="subreply__content"
                :class="subitem.is_deleted == 1 ? 'reply-content--deleted' : ''"
              >
                <div v-html="calcSubReply(subitem)"></div>
                <div class="reply__addon clearfix">
                  <p class="fr">
                    <span> {{ item.created_at }}&nbsp;</span>
                  </p>
                  <el-button
                    class="ml10"
                    type="primary"
                    size="mini"
                    @click="handleReplyToReply(item.id, subitem.user_id)"
                    >回复</el-button
                  >
                  <el-button
                    class="ml10"
                    v-if="$store.getters.userRole == 'admin'"
                    :type="subitem.is_deleted == 0 ? 'danger' : 'success'"
                    size="mini"
                    @click="toggleReplyStatus(subitem.id)"
                    >{{ subitem.is_deleted == 0 ? '删除' : '恢复' }}</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <reply-dialog ref="replyDialogRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, set } from '@vue/composition-api'
import * as adminApi from '@user/api/admints'
import { getAbsoluteUrl } from '@common/utils'
import { useMapState, useMessge } from 'common/use'
import ReplyDialog from './replyDialog.vue'

export default defineComponent({
  components: {
    'reply-dialog': ReplyDialog,
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const message = useMessge()
    const states = useMapState({
      user: state => state.user,
    })

    const replyDialogRef = ref()

    const fetchDataList = inject('fetchDataList') as Function

    const toggleReplyStatus = async replyId => {
      try {
        await adminApi.toggleReplyStatus(replyId)()
        fetchDataList()
      } catch (err) {
        console.log(err)
      }
    }

    const toggleReplyList = item => {
      if (item.showReplys === undefined) {
        set(item, 'showReplys', false)
      } else {
        item.showReplys = !item.showReplys
      }
    }
    const calcSubReply = subReply => {
      if (subReply.reply_user_nick) {
        return `回复${subReply.reply_user_nick}: ${subReply.content}`
      }
      return subReply.content
    }

    const handleReplyToReply = (replyId, replyUserId) => {
      console.log(replyId, replyUserId)
      if (!states.user.username) {
        message({
          message: '请登录后发表回复',
          type: 'error',
        })
        return
      }
      replyDialogRef.value.handleReply(replyId, replyUserId)
    }

    return {
      replyDialogRef,

      toggleReplyStatus,
      toggleReplyList,
      calcSubReply,
      getAbsoluteUrl,
      handleReplyToReply,
    }
  },
})
</script>
<style lang="scss" scoped>
.reply__box {
  background: $--color-level15;
  position: relative;
  padding: 0.1rem;

  &:not(:last-of-type) {
    border-bottom: 1px solid $--color-level13;
  }

  .reply__userinfo__wrapper {
    text-align: center;

    img {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 0.3rem;
      border: 1px solid $--color-level12;
      box-shadow: 1px 1px 1px 1px $--color-level12;
    }

    float: left;
    width: 1rem;

    .reply__user__name {
      font-size: 0.14rem;
    }
  }

  .reply__content {
    position: relative;
    box-sizing: border-box;
    padding: 0.1rem 0.2rem 0.6rem 0.1rem;
    margin-left: 1rem;
    min-height: 100px;
    text-align: left;
    font-size: 0.16rem;
  }

  .reply-content--deleted {
    background-color: #f5f7fa;
    text-decoration: line-through;
  }

  .reply__addon {
    p span,
    a {
      vertical-align: -0.05rem;
    }

    font-size: 0.14rem;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0.1rem;
  }

  .subreplys__wrapper {
    .subreply__box {
      padding: 0.1rem;
      margin-left: 1rem;
      border-top: 1px solid $--color-level13;

      .subreply__userinfo__wrapper {
        text-align: center;
        padding-top: 20px;

        img {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid $--color-level12;
          box-shadow: 1px 1px 1px 1px $--color-level12;
        }

        float: left;
        width: 1rem;
      }

      .subreply__content {
        position: relative;
        box-sizing: border-box;
        padding: 0.15rem 0.15rem 0.6rem 0.15rem;
        margin-left: 1rem;
        min-height: 100px;
        text-align: left;
        font-size: 0.16rem;
      }
    }
  }
}
</style>
