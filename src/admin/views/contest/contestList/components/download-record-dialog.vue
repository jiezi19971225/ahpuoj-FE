<template>
  <el-dialog title="下载提交记录" :visible.sync="visible" width="30%">
    <p class="mb20">{{ contest && contest.name }}</p>
    <el-form>
      <el-form-item label="题号">
        <el-select v-model="problemNum">
          <el-option
            v-for="(item, index) in problemList"
            :key="index"
            :label="item"
            :value="index + 1"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <a :href="downloadUrl" download="download" style="margin-right: 10px">
        <el-button type="success">下载</el-button>
      </a>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import * as contestApi from '@admin/api/contestts'
import { getAlphabetNumber } from '@common/utils'
import { apiPort } from '@common/const'

export default defineComponent({
  setup() {
    const visible = ref(false)
    const contest = ref<ContestDetailDto>()
    const problemNum = ref(1)
    const show = async row => {
      contestApi
        .getContest(row.id)<ContestResponse>()
        .then(res => {
          visible.value = true
          contest.value = res.contest
        })
    }

    const problemList = computed(() => {
      if (!contest.value) {
        return []
      }
      const { length } = contest.value.problems.split(',')
      return Array.from({ length }).map((v, index) => getAlphabetNumber(index + 1))
    })

    const downloadUrl = computed(() => {
      if (!contest.value) {
        return ''
      }
      return `${window.location.protocol}//${window.location.hostname}${apiPort}/api/admin/contest/${contest.value.id}/problem/${problemNum.value}/solutions`
    })

    return {
      contest,
      visible,
      problemNum,
      problemList,
      downloadUrl,

      show,
    }
  },
})
</script>
