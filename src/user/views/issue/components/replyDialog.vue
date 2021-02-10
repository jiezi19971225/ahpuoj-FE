<template>
  <el-dialog
    title="回复内容"
    :visible.sync="visible"
    @closed="closeDialog"
    width="8rem"
    :close-on-click-modal="false"
  >
    <tinymce-editor v-model="replyForm.content" :height="300"></tinymce-editor>
    <div class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" native-type="submit" @click="replyToReply">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { inject, reactive, Ref, ref } from '@vue/composition-api'
import { useMessge } from '@common/use'
import TinymceEditor from '@common/components/tinymce_editor.vue'
import * as userApi from '@user/api/userts'

export default {
  components: {
    TinymceEditor,
  },
  setup() {
    const message = useMessge()

    const visible = ref(false)
    const replyForm = reactive({
      content: '',
      reply_id: 0,
      reply_user_id: 0,
    })

    const fetchDataList = inject('fetchDataList') as Function
    const issue = inject('issue') as Ref<IssueInfoDto>

    const handleReply = (replyId, replyUserId) => {
      replyForm.reply_id = replyId
      replyForm.reply_user_id = replyUserId
      visible.value = true
    }

    const closeDialog = () => {
      replyForm.content = ''
    }

    const replyToReply = async () => {
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
        visible.value = false
      } catch (err) {
        console.log(err)
      }
    }
    return {
      visible,
      replyForm,

      handleReply,
      replyToReply,
      closeDialog,
    }
  },
}
</script>

<style lang="scss" scoped></style>
