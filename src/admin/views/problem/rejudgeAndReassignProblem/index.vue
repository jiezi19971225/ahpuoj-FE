<template lang="pug">
.admin-content
  el-row
    el-col(:xs="24" :md="12")
      el-card(class="content__card__item")
        h2(class="content__card__title") 重判问题
        el-form(:inline="true",:model="rejudgeSolutionForm",ref="rejudgeSolutionForm",:rules="rejudgeSolutionFormRules",@submit.native.prevent)
          el-form-item(label="重判提交",prop="id")
            el-input(v-model.number="rejudgeSolutionForm.id",@keyup.enter.native="submitRejudgeSolution",placeholder="请输入提交ID")
          el-form-item
            el-button(type="primary",@click="submitRejudgeSolution") 提交
        el-form(:inline="true",:model="rejudgeProblemForm",ref="rejudgeProblemForm",:rules="rejudgeProblemFormRules",@submit.native.prevent)
          el-form-item(label="重判问题",prop="id")
            el-input(v-model.number="rejudgeProblemForm.id",@keyup.enter.native="submitRejudgeProblem",placeholder="请输入问题ID")
          el-form-item
            el-button(type="primary",@click="submitRejudgeProblem") 提交
    // 只有管理员可以重排问题
    el-col(:xs="24" :md="12" v-if="user.role === 'admin'")
      el-card(class="content__card__item")
        h2(class="content__card__title") 重排问题
        el-form(:model="form",ref="form",:rules="rules",@submit.native.prevent)
          el-form-item(label="原ID",prop="oldId")
            el-input(v-model.number="form.oldId",@keyup.enter.native="submitRejudgeSolution",placeholder="请输入要移动的问题ID")
          el-form-item(label="新ID",prop="newId")
            el-input(v-model.number="form.newId",@keyup.enter.native="submitRejudgeSolution",placeholder="请输入要移动到的ID")
          el-form-item
            el-button(type="primary",@click="submit") 提交
</template>

<script>
import { rejudgeSolution, rejudgeProblem, reassignProblem } from 'admin/api/problem';
import { mapState } from 'vuex';

export default {
  name: 'adminRejudgeAndReassignProblem',
  data() {
    return {
      rejudgeSolutionForm: {
        id: null,
      },
      rejudgeProblemForm: {
        id: null,
      },
      // problemId: null,
      rejudgeSolutionFormRules: {
        id: [
          {
            required: true,
            message: '请输入提交ID',
            trigger: 'blur',
          },
        ],
      },
      rejudgeProblemFormRules: {
        id: [
          {
            required: true,
            message: '请输入问题ID',
            trigger: 'blur',
          },
        ],
      },
      form: {
        oldId: null,
        newId: null,
      },
      // problemId: null,
      rules: {
        oldId: [
          {
            required: true,
            message: '原ID不能为空',
            trigger: 'blur',
          },
        ],
        newId: [
          {
            required: true,
            message: '新ID不能为空',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    submitRejudgeSolution() {
      this.$refs.rejudgeSolutionForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await rejudgeSolution(this.rejudgeSolutionForm.id);
            const pageUrl = `${window.location.protocol}//${window.location.host}/solution/${this.rejudgeSolutionForm.id}`;
            window.open(pageUrl, '_blank');
          } catch (err) {
            console.log(err);
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
    submitRejudgeProblem() {
      this.$refs.rejudgeProblemForm.validate(async (valid) => {
        if (valid) {
          try {
            console.log(this.rejudgeProblemForm);
            const res = await rejudgeProblem(this.rejudgeProblemForm.id);
            const pageUrl = `${window.location.protocol}//${window.location.host}/status?queryParam=${this.rejudgeProblemForm.id}`;
            window.open(pageUrl, '_blank');
          } catch (err) {
            console.log(err);
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
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const res = await reassignProblem(this.form.oldId, this.form.newId);
            this.$message({
              message: res.data.message,
              type: 'success',
            });
          } catch (err) {
            console.log(err);
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
