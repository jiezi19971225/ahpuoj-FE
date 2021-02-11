<template>
  <div class="admin-content">
    <div class="content__main">
      <el-form :model="form" :rules="rules" ref="form" label-width="6em">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入名称" v-model="form.name" :autofocus="true"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time" required="required">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time" required="required">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间"
            style="width: 100%"
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
        <el-form-item label="团队模式">
          <el-switch
            v-model="form.team_mode"
            active-text="团队"
            inactive-text="个人"
            inactive-color="#99cc33"
            :active-value="1"
            :inactive-value="0"
            @change="notifyModeChange"
          ></el-switch>
        </el-form-item>
        <el-form-item label="语言">
          <el-checkbox-group v-model="selectedLangList" @change="calcMask">
            <el-checkbox
              v-for="(item, index) in langList"
              :key="item.name"
              :label="item.name"
              :disabled="!item.available"
              :checked="(form.langmask &amp; (1&lt;&lt;index))&gt;0"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="fl">
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import TinymceEditor from 'common/components/tinymce_editor.vue'
import * as contestApi from '@admin/api/contestts'
import { getLanguageList } from 'user/api/nologin'

export default {
  components: {
    TinymceEditor,
  },
  data() {
    const validateStartTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入开始时间'))
      } else if (this.form.end_time !== '') {
        const startTime = new Date(this.form.start_time)
        const endTime = new Date(this.form.end_time)
        if (startTime.getTime() < endTime.getTime()) {
          this.$refs.form.validateField('end_time')
          callback()
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateEndTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入结束时间'))
      } else if (this.form.start_time !== '') {
        const startTime = new Date(this.form.start_time)
        const endTime = new Date(this.form.end_time)
        if (startTime.getTime() < endTime.getTime()) {
          callback()
        } else {
          callback(new Error('结束必须大于开始时间'))
        }
      } else {
        callback()
      }
    }
    return {
      inited: false,
      langList: [],
      selectedLangList: [],
      form: {
        name: '',
        start_time: '',
        end_time: '',
        problems: '',
        description: '',
        langmask: 0,
        private: 0,
        team_mode: 0,
      },
      rules: {
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
        start_time: [
          {
            validator: validateStartTime,
            trigger: 'blur',
          },
        ],
        end_time: [
          {
            validator: validateEndTime,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    private() {
      return this.form.private
    },
    teamMode() {
      return this.form.team_mode
    },
  },
  watch: {
    private(to) {
      if (to === 0) {
        this.form.team_mode = 0
      }
    },
    teamMode(to) {
      if (to === 1) {
        this.form.private = 1
      }
    },
  },
  async activated() {
    if (!this.inited) {
      const res = await getLanguageList()
      this.langList = res.data.languages
    }
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (this.$route.name === 'adminEditContest') {
        try {
          const { id } = this.$route.params
          const res = await contestApi.getContest(id)()
          if (!this.inited) {
            this.form = res.contest
          }
          this.inited = true
          this.$notify({
            title: '提示',
            message: '更改公开度与团队模式后私有比赛的参赛人员需要重新进行设置！',
            duration: 6000,
          })
          // 重新计算selectlist
          // TODO: 改成foreach
          // eslint-disable-next-line no-restricted-syntax
          for (const i in this.langList) {
            // eslint-disable-next-line no-bitwise
            if (this.langList[i].available && this.form.langmask & (1 << i)) {
              this.selectedLangList.push(this.langList[i].name)
            }
          }
        } catch (err) {
          console.log(err)
          this.$store.dispatch('tagsView/delViewByRoute', this.$route)
          this.$router.replace({ name: 'admin404Page' })
        }
      }
      // 计算默认的langmask
      this.langList.forEach((x, index) => {
        if (x.available) {
          // eslint-disable-next-line no-bitwise
          this.form.langmask |= 1 << index
        }
      })
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            if (this.$route.name === 'adminAddContest') {
              await contestApi.createContest(this.form)
            } else {
              const { id } = this.$route.params
              await contestApi.editContest(id)(this.form)
            }
            this.$store.dispatch('tagsView/delViewByRoute', this.$route)
            this.$router.push({ name: 'adminContestList' })
          } catch (err) {
            console.log(err)
          }
        } else {
          this.$message({
            message: '表单必填项不能为空',
            type: 'error',
          })
          return false
        }
      })
    },
    calcMask() {
      let langmask = 0
      for (let i = 0; i < this.selectedLangList.length; i += 1) {
        for (let j = 0; j < this.langList.length; j += 1) {
          if (this.selectedLangList[i] === this.langList[j].name) {
            // eslint-disable-next-line no-bitwise
            langmask |= 1 << j
          }
        }
      }
      this.form.langmask = langmask
    },
    notifyModeChange() {
      if (this.form.team_mode === 1) {
        this.$notify({
          title: '提示',
          message: '团队模式只能为私有',
          duration: 6000,
        })
      }
    },
  },
}
</script>
