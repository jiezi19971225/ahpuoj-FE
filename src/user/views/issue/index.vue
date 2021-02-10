<template>
  <div class="content">
    <title>{{ issue ? `${issue.title} - AHPUOJ` : '' }}</title>
    <div class="content__main">
      <div class="one-main" v-if="issueEnable === true">
        <div class="link" v-if="issue" style="position: absolute; right: 10px; top: 10px">
          <span>板块&nbsp;</span>
          <router-link v-if="issue.problem_id == 0" :to="{ name: 'issueList' }">{{
            `总板`
          }}</router-link>
          <router-link
            v-else
            :to="{ name: 'problemIssueList', params: { id: issue.problem_id } }"
            >{{ `问题P ${issue.ptitle}` }}</router-link
          >
        </div>
        <h1 class="content__panel__title">{{ issue ? issue.title : '' }}</h1>
        <reply-list :dataList="replys" />
        <oj-paginator
          @change="fetchDataList"
          :current-page.sync="page"
          :page-size.sync="perpage"
          :total="total"
        ></oj-paginator>
        <h1 class="mt20 content__panel__title">发表新回复</h1>
        <div class="post__box__wrapper">
          <div class="post__box" v-if="$store.getters.username">
            <tinymce-editor class="mt10" v-model="replyForm.content" :height="300"></tinymce-editor>
            <el-button class="mt10" type="primary" @click="replyToIssue">发表</el-button>
          </div>
          <a v-else @click="goLogin">请登陆后发表讨论</a>
        </div>
      </div>
      <div v-else-if="issueEnable == false">
        <p>讨论版功能已经被管理员关闭</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as nologinApi from '@user/api/nologints'
import TinymceEditor from '@common/components/tinymce_editor.vue'
import EventBus from '@common/eventbus'
import * as userApi from '@user/api/userts'
import { useMessge, usePagination, useRoute } from '@common/use'
import { provide, onMounted, reactive, ref } from '@vue/composition-api'
import ReplyList from './components/replyList.vue'

export default {
  name: 'issue',
  components: {
    TinymceEditor,
    'reply-list': ReplyList,
  },
  setup() {
    const pagination = usePagination()
    const route = useRoute()
    const message = useMessge()

    const issueEnable = ref()
    const issue = ref<IssueInfoDto>()
    const replys = ref<ReplyInfoDto[]>()

    const replyForm = reactive({
      content: '',
      reply_id: 0,
      reply_user_id: 0,
    })

    const issueId = route.value.params.id
    const fetchDataList = async () => {
      try {
        const res = await nologinApi.getIssue(issueId)<IssueResponse>({
          id: issueId,
          page: pagination.page,
          perpage: pagination.perpage,
        })
        issue.value = res.issue
        replys.value = res.replys
        pagination.total.value = res.total
        issueEnable.value = res.issue_enable
      } catch (err) {
        console.log(err)
      }
    }
    provide('fetchDataList', fetchDataList)
    provide('issue', issue)

    const goLogin = () => {
      EventBus.$emit('goLogin')
    }

    onMounted(() => {
      fetchDataList()
    })

    const replyToIssue = async () => {
      if (replyForm.content === '') {
        message({
          message: '内容不能为空',
          type: 'error',
        })
        return
      }
      try {
        await userApi.replyToIssue(issue.value.id)(replyForm)
        fetchDataList()
        replyForm.content = ''
      } catch (err) {
        console.log(err)
      }
    }

    return {
      ...pagination,
      issue,
      replys,
      issueEnable,
      replyForm,

      fetchDataList,
      goLogin,
      replyToIssue,
    }
  },
}
</script>

<style lang="scss" scoped>
.link {
  font-size: 0.16rem;
  line-height: 0.5rem;
  padding-right: 0.2rem;
}

h1.content__panel__title {
  background: $--color-level15;
}
</style>
