<template>
  <div class="admin-content">
    <el-form :model="form" :rules="rules" ref="form" label-width="6em">
      <el-form-item label="标题" prop="title">
        <el-input placeholder="请输入标题" v-model="form.title" :autofocus="true"></el-input>
      </el-form-item>
      <el-form-item label="时间限制" prop="time_limit">
        <el-input placeholder="请输入内容" v-model.number="form.time_limit"
          ><template slot="append">秒</template></el-input
        >
      </el-form-item>
      <el-form-item label="内存限制" prop="memory_limit">
        <el-input placeholder="请输入内容" v-model.number="form.memory_limit"
          ><template slot="append">兆字节</template></el-input
        >
      </el-form-item>
      <el-form-item label="题目描述">
        <tinymce-editor v-model="form.description" :height="300"></tinymce-editor>
      </el-form-item>
      <el-form-item label="输入">
        <tinymce-editor v-model="form.input" :height="300"></tinymce-editor>
      </el-form-item>
      <el-form-item label="输出">
        <tinymce-editor v-model="form.output" :height="300"></tinymce-editor>
      </el-form-item>
      <el-form-item label="样例输入">
        <el-input type="textarea" :rows="10" resize="none" v-model="form.sample_input"></el-input>
      </el-form-item>
      <el-form-item label="样例输出">
        <el-input type="textarea" :rows="10" resize="none" v-model="form.sample_output"></el-input>
      </el-form-item>
      <el-form-item label="提示">
        <tinymce-editor v-model="form.hint" :height="300"></tinymce-editor>
      </el-form-item>
      <el-form-item label="难度">
        <el-select
          style="width: 100%"
          v-model="form.level"
          default-first-option="default-first-option"
          placeholder="请选择题目难度"
        >
          <el-option label="简单" :value="0"></el-option>
          <el-option label="中等" :value="1"></el-option>
          <el-option label="困难" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          style="width: 100%"
          v-model="form.tags"
          multiple="multiple"
          filterable="filterable"
          allow-create="allow-create"
          default-first-option="default-first-option"
          placeholder="请选择题目标签"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="fl">
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TinymceEditor from 'common/components/tinymce_editor.vue'
import { createProblem, editProblem, getProblem } from 'admin/api/problem'
import { getAllTags } from 'admin/api/tag'

export default {
  name: 'adminAddProblem',
  components: {
    TinymceEditor,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inited: false,
      tags: [],
      form: {
        title: '',
        time_limit: 1,
        memory_limit: 128,
        description: '',
        input: '',
        output: '',
        sample_input: '',
        sample_output: '',
        hint: '',
        spj: 0,
        level: 1,
        tags: [],
      },
      rules: {
        title: [
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
        time_limit: [
          {
            required: true,
            message: '请输入时间限制',
            trigger: 'blur',
          },
          {
            type: 'integer',
            min: 1,
            message: '清输入大于零的整数',
            trigger: 'blur',
          },
        ],
        memory_limit: [
          {
            required: true,
            message: '请输入时间限制',
            trigger: 'blur',
          },
          {
            type: 'integer',
            min: 1,
            message: '清输入大于零的整数',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  activated() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getAllTags()
      this.tags = res.data.tags
      if (this.isEdit) {
        try {
          const { id } = this.$route.params
          const res2 = await getProblem(id)
          if (!this.inited) {
            Object.assign(this.form, res2.data.problem)
            this.form.tags = []
            // 将tag对象数组中的id取出
            res2.data.problem.tags.forEach(x => {
              this.form.tags.push(x.id)
            })
            this.inited = true
          }
        } catch (err) {
          this.$store.dispatch('tagsView/delViewByRoute', this.$route)
          this.$router.replace({ name: 'admin404Page' })
        }
      }
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            if (!this.isEdit) {
              await createProblem(this.form)
            } else {
              const { id } = this.$route.params
              await editProblem(id, this.form)
            }
            this.$store.dispatch('tagsView/delViewByRoute', this.$route)
            this.$router.push({ name: 'adminProblemList' })
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
  },
}
</script>

<style lang="scss" scoped></style>
