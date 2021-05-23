<template>
  <div class="admin-content">
    <div class="content__main">
      <el-alert type="info">更改公开度与团队模式后私有比赛的参赛人员需要重新进行设置！</el-alert>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入名称" v-model="form.name" :autofocus="true"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="timerange">
          <el-date-picker
            v-model="form.timerange"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="题目编号">
          <el-input
            placeholder="使用 , 半角逗号 分隔题目ID列表，格式如:1000,1001,1002"
            v-model="form.problems"
            :autofocus="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <tinymce-editor v-model="form.description" :height="300"></tinymce-editor>
        </el-form-item>
        <el-form-item label="公开度">
          <el-switch
            v-model="form.private"
            active-text="私有"
            inactive-text="公开"
            inactive-color="#99cc33"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-alert type="info">团队模式只能为私有</el-alert>
        <el-form-item label="团队模式">
          <el-switch
            v-model="form.team_mode"
            active-text="团队"
            inactive-text="个人"
            inactive-color="#99cc33"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="语言">
          <el-checkbox-group v-model="selectedLangList" @change="calcMask">
            <el-checkbox
              v-for="(item, index) in langList"
              v-show="item.available"
              :key="item.name"
              :label="item.name"
              :checked="(form.langmask &amp; (1&lt;&lt;index))&gt;0"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-alert type="info"
          >开启后，对于每次用户提交，将会计算它与所有已提交的该题通过代码的相似度，如果超过设定的阈值，将拒绝用户的提交。</el-alert
        >
        <el-form-item label="判重设置">
          <el-switch
            v-model="form.check_repeat"
            active-text="开启"
            inactive-text="关闭"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <div v-show="form.check_repeat">
            <div>重复率阈值</div>
            <SliderInput v-model="form.check_repeat_rate" />
          </div>
        </el-form-item>
        <el-form-item class="fl">
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import TinymceEditor from 'common/components/tinymce_editor.vue'
import * as contestApi from '@admin/api/contestts'
import * as nologinApi from '@common/api/nologin'
import { useDispatch, useMessge, useRoute, useRouter } from 'common/use'
import { defineComponent, markRaw, onActivated, reactive, ref, watch } from '@vue/composition-api'
import SliderInput from '@common/components/SliderInput/index.vue'

type ContestResponse = BaseResponse & {
  contest: Contest
}

export default defineComponent({
  components: {
    TinymceEditor,
    SliderInput,
  },
  setup() {
    const inited = ref(false)
    const langList = ref<any[]>([])
    const selectedLangList = ref<any[]>([])
    const route = useRoute()
    const router = useRouter()
    const dispatch = useDispatch()
    const message = useMessge()

    const formRef = ref(null)

    const rules = markRaw({
      name: [
        {
          required: true,
          message: '请输入问题名称',
          trigger: 'blur',
        },
        {
          max: 20,
          message: '超出长度限制',
          trigger: 'blur',
        },
      ],
      timerange: [
        {
          required: true,
          message: '请设置起止时间',
        },
      ],
    })

    const form = reactive({
      name: '',
      start_time: '',
      end_time: '',
      problems: '',
      description: '',
      langmask: 0,
      private: 0,
      team_mode: 0,
      check_repeat: 0,
      check_repeat_rate: 80,
      timerange: [],
    })

    watch(
      () => form.private,
      val => {
        if (val === 0) {
          form.team_mode = 0
        }
      }
    )

    watch(
      () => form.team_mode,
      val => {
        if (val === 1) {
          form.private = 1
        }
      }
    )

    const fetchData = async () => {
      if (route.value.name === 'adminEditContest') {
        try {
          const { id } = route.value.params
          const res = await contestApi.getContest(id)<ContestResponse>()
          Object.assign(form, res.contest)
          form.timerange = [res.contest.start_time, res.contest.end_time]

          langList.value.forEach((x, index) => {
            // eslint-disable-next-line no-bitwise
            if (x.available && form.langmask & (1 << index)) {
              selectedLangList.value.push(x.name)
            }
          })
        } catch (err) {
          console.log(err)
          dispatch('tagsView/delViewByRoute', route.value)
          router.replace({ name: 'admin404Page' })
        }
      }
      // 计算默认的langmask
      langList.value.forEach((x, index) => {
        if (x.available) {
          // eslint-disable-next-line no-bitwise
          form.langmask |= 1 << index
        }
      })
    }

    const calcMask = () => {
      let langmask = 0
      for (let i = 0; i < selectedLangList.value.length; i += 1) {
        for (let j = 0; j < langList.value.length; j += 1) {
          if (selectedLangList.value[i] === langList.value[j].name) {
            // eslint-disable-next-line no-bitwise
            langmask |= 1 << j
          }
        }
      }
      form.langmask = langmask
    }

    onActivated(async () => {
      if (!inited.value) {
        await nologinApi.getLanguageList<LangListResponse>().then(res => {
          langList.value = res.languages
        })
        inited.value = true
      }
      fetchData()
    })

    const submit = async () => {
      formRef.value.validate(async valid => {
        if (valid) {
          const postData: any = { ...form }
          // eslint-disable-next-line prefer-destructuring
          postData.start_time = form.timerange[0]
          // eslint-disable-next-line prefer-destructuring
          postData.end_time = form.timerange[1]
          Reflect.deleteProperty(postData, 'timerange')

          try {
            if (route.value.name === 'adminAddContest') {
              await contestApi.createContest(postData)
            } else {
              const { id } = route.value.params
              await contestApi.editContest(id)(postData)
            }
            dispatch('tagsView/delViewByRoute', route.value)
            router.push({ name: 'adminContestList' })
          } catch (err) {
            console.log(err)
          }
        } else {
          message({
            message: '表单必填项不能为空',
            type: 'error',
          })
          return false
        }
      })
    }

    return {
      formRef,
      form,
      rules,
      langList,
      selectedLangList,

      calcMask,
      submit,
    }
  },
})
</script>
