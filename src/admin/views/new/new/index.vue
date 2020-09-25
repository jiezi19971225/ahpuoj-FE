<template lang="pug">
.admin-content
  el-form(:model="form",:rules="rules",ref="form",label-width="50px")
    el-form-item(label="标题", prop="title")
     el-input(v-model="form.title",placeholder="请输入标题",:autofocus="true")
    el-form-item(label="内容")
      tinymce-editor(v-model="form.content",:height="600")
    el-form-item
      el-button(type="primary",@click="submit") 提交
</template>

<script>
import TinymceEditor from 'common/components/tinymce_editor.vue';
import { createNew, editNew, getNew } from 'admin/api/new';

export default {
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
      form: {
        title: '',
        content: '',
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '超出长度限制',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  activated() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        if (this.isEdit) {
          const { id } = this.$route.params;
          const res = await getNew(id);
          if (!this.inited) {
            this.form.title = res.data.new.title;
            this.form.content = res.data.new.content;
            this.inited = true;
          }
        }
      } catch (err) {
        this.$store.dispatch('tagsView/delViewByRoute', this.$route);
        this.$router.replace({ name: 'admin404Page' });
      }
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res;
            if (!this.isEdit) {
              res = await createNew(this.form);
            } else {
              const { id } = this.$route.params;
              res = await editNew(id, this.form);
            }
            this.$message({
              message: res.data.message,
              type: 'success',
            });
            this.$store.dispatch('tagsView/delViewByRoute', this.$route);
            this.$router.push({ name: 'adminNewList' });
          } catch (err) {
            this.$message({
              message: err.response.data.message,
              type: 'error',
            });
          }
        } else {
          this.$message({
            message: '表单必填项不能为空',
            type: 'error',
          });
          return false;
        }
      });
    },
  },
};
</script>
