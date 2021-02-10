<template>
  <div class="content">
    <title>
      {{
        $route.name == 'issueList' ? `讨论版 总版 - AHPUOJ` : `问题P${problemId}的讨论版 - AHPUOJ`
      }}
    </title>
    <div class="content__main">
      <div class="one-main" v-if="issueEnable == true">
        <div class="link" style="position: absolute; right: 10px; top: 10px">
          <router-link
            v-if="$route.name == 'problemIssueList'"
            :to="{ name: 'problem', params: { id: problemId } }"
            >{{ `转到问题` }}</router-link
          >
        </div>
        <h1 class="content__panel__title" style="height: 20px">
          <span v-if="$route.name == 'issueList'">{{ '讨论版 总版' }}</span
          ><span v-if="$route.name == 'problemIssueList'">{{ `问题P${problemId}的讨论版` }}</span>
        </h1>
        <issue-list :dataList="dataList" @refresh="fetchDataList" />
        <oj-paginator
          sync-path
          @change="fetchDataList"
          :current-page.sync="page"
          :page-size.sync="perpage"
          :total="total"
        ></oj-paginator>
        <h1 class="mt30 content__panel__title">发表新讨论</h1>
        <div class="post__box__wrapper">
          <div class="post__box" v-if="$store.getters.username">
            <el-input
              placeholder="请输入讨论标题"
              v-model="issueForm.title"
              :autofocus="true"
            ></el-input>
            <tinymce-editor class="mt10" v-model="replyForm.content" :height="300"></tinymce-editor>
            <el-button class="mt10" type="primary" @click="postIssue" :loading="postBtnLoading"
              >发表</el-button
            >
          </div>
          <a v-else @click="goLogin">请登陆后发表讨论</a>
        </div>
      </div>
      <div v-else-if="issueEnable === false">
        <p>讨论版功能已经被管理员关闭</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import * as nologinApi from '@user/api/nologints'
import * as userApi from '@user/api/userts'
import TinymceEditor from '@common/components/tinymce_editor.vue'
import EventBus from '@common/eventbus'
import { useMessge, useRoute, usePagination } from 'common/use'
import { onActivated, reactive, ref } from '@vue/composition-api'
import IssueList from './components/issueList.vue'

interface IssueListResponse extends CommonPaginationResponse<IssueInfoDto[]> {
  issue_enable: boolean
}

export default {
  props: {
    isProblem: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TinymceEditor,
    'issue-list': IssueList,
  },
  setup() {
    const route = useRoute()
    const message = useMessge()
    const pagination = usePagination({
      perpage: 20,
    })

    const postBtnLoading = ref(false)
    const problemId = ref(0)
    const issueEnable = ref()
    const dataList = ref([])
    const issueForm = reactive({
      title: '',
      problem_id: 0,
    })
    const replyForm = reactive({
      content: '',
      reply_id: 0,
      reply_user_id: 0,
    })

    const fetchDataList = async () => {
      try {
        const res = await nologinApi.getIssueList(problemId.value)<IssueListResponse>({
          page: pagination.page,
          perpage: pagination.perpage,
        })
        console.log(res, '!23')

        issueEnable.value = res.issue_enable
        dataList.value = res.data
        pagination.total.value = res.total
      } catch (err) {
        console.log(err)
      }
    }

    const goLogin = () => {
      EventBus.$emit('goLogin')
    }

    const postIssue = async () => {
      // 标题和内容不能为空
      if (issueForm.title === '') {
        message({
          message: '标题不能为空',
          type: 'error',
        })
        return
      }
      if (issueForm.title.length > 20) {
        message({
          message: '标题长度限制在20个字符以内',
          type: 'error',
        })
        return
      }
      if (replyForm.content === '') {
        message({
          message: '内容不能为空',
          type: 'error',
        })
        return
      }
      try {
        postBtnLoading.value = true
        if (route.value.name === 'problemIssueList') {
          issueForm.problem_id = Number.parseInt(route.value.params.id, 10)
        } else {
          issueForm.problem_id = 0
        }
        const res1 = await userApi.postIssue<PostIssueResponse>(issueForm)
        const issueId = res1.issue.id
        await userApi.replyToIssue(issueId)(replyForm)
        issueForm.title = ''
        replyForm.content = ''
        fetchDataList()
      } catch (err) {
        console.log(err)
      } finally {
        postBtnLoading.value = false
      }
    }

    if (route.value.name === 'issueList') {
      problemId.value = 0
    } else {
      problemId.value = +route.value.params.id
    }

    onActivated(() => {
      fetchDataList()
    })

    return {
      ...pagination,
      issueEnable,
      problemId,
      issueForm,
      replyForm,
      dataList,
      postBtnLoading,

      fetchDataList,
      goLogin,
      postIssue,
    }
  },
}
</script>

<style lang="scss" scoped>
.link {
  font-size: 16px;
  line-height: 0.5rem;
  padding-right: 0.2rem;
}
</style>
