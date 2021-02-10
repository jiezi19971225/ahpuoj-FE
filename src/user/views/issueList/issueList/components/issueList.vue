<template>
  <div class="issue__box__list">
    <div class="issue__box" v-for="item in dataList" :key="item.id">
      <div class="issue__userinfo__wrapper">
        <ul>
          <li class="issue__user__avatar">
            <router-link :to="{ name: 'userinfo', params: { id: item.user_id } }"
              ><img :src="getAbsoluteUrl(item.avatar)"
            /></router-link>
          </li>
          <li class="issue__user__name ell">
            <router-link :to="{ name: 'userinfo', params: { id: item.user_id } }">{{
              item.nick
            }}</router-link>
          </li>
        </ul>
      </div>
      <div class="issue__content" :class="item.is_deleted == 1 ? 'issue-content--deleted' : ''">
        <router-link :to="{ name: 'issue', params: { id: item.id } }" target="_blank">{{
          item.title
        }}</router-link>
        <div class="issue__addon mt10">
          <el-button
            class="fl"
            v-if="$store.getters.userRole == 'admin'"
            :type="item.is_deleted == 0 ? 'danger' : 'success'"
            size="mini"
            @click="toggleIssueStatus(item.id)"
            >{{ item.is_deleted == 0 ? '删除' : '恢复' }}</el-button
          >
          <div class="issue__addon__info tar">
            <router-link
              v-if="item.problem_id > 0"
              :to="{ name: 'problem', params: { id: item.problem_id } }"
              >{{ `In P${item.problem_id} ${item.ptitle}` }}</router-link
            >
            <p v-else>总版</p>
            <p class="text-muted">
              {{ item.reply_count }}条回复 最后回复时间 {{ item.updated_at }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as adminApi from '@user/api/admints'
import { defineComponent } from '@vue/composition-api'
import { getAbsoluteUrl } from '@common/utils'

export default defineComponent({
  props: {
    dataList: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const toggleIssueStatus = async issueId => {
      try {
        await adminApi.toggleIssueStatus(issueId)()
        emit('refresh')
      } catch (err) {
        console.log(err)
      }
    }

    return {
      toggleIssueStatus,
      getAbsoluteUrl,
    }
  },
})
</script>

<style lang="scss" scoped>
.issue__box__list {
  min-height: 400px;
}
.issue__box {
  background: $--color-level15;
  position: relative;
  padding: 0.1rem;

  &:not(:last-of-type) {
    border-bottom: 0.01rem solid $--color-level13;
  }

  .issue__userinfo__wrapper {
    text-align: center;
    word-wrap: break-word;
    word-break: break-all;

    img {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 0.3rem;
      border: 0.01rem solid $--color-level12;
      box-shadow: 0.01rem 0.01rem 0.01rem 0.01rem $--color-level12;
    }

    float: left;
    width: 1rem;
  }

  .issue__user__name {
    font-size: 12px;
  }

  .issue__content {
    a {
      font-size: 16px;
    }

    box-sizing: border-box;
    padding: 0.1rem 0 0 0.3rem;
    margin-left: 1rem;
    min-height: 0.8rem;
    text-align: left;
    font-size: 14px;
  }

  .issue-content--deleted {
    // background-color: #f5f7fa;
    text-decoration: line-through;
  }

  .issue__addon {
    .issue__addon__info {
      a {
        font-size: 14px;
      }

      position: absolute;
      bottom: 0.1rem;
      right: 0.1rem;
    }
  }
}
</style>
