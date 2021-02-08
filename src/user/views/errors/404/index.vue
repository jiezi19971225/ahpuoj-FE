<template>
  <div class="content">
    <a-result status="404" title="404" sub-title="对不起，你访问的页面不存在。">
      <template #extra>
        <router-link to="/">
          <el-button type="primary">返回主页</el-button>
        </router-link>
      </template>
    </a-result>
  </div>
</template>

<script>
import { Result } from 'ant-design-vue'
import 'ant-design-vue/lib/result/style/css'

export default {
  data() {
    return {
      timer: 0,
    }
  },
  components: {
    'a-result': Result,
  },
}
</script>
