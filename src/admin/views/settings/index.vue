<template lang="pug">
.admin-content
  el-row
      el-col(:xs="24" :md="12")
        el-card(class="content__card__item")
          h2(class="content__card__title") 设置
          el-form(ref="form",:model="form")
                  el-form-item(label="讨论版")
                    el-switch(v-model="form.enable_issue",active-text="开",inactive-text="关",active-value=true,inactive-value=false)
                  el-form-item
                    el-button(type="primary",@click="submitSetSettings") 保存


</template>
<script>
import { getSettings, setSettings } from 'admin/api/settings';

export default {
  name: 'adminSetting',
  data() {
    return {
      form: {
        enable_issue: true,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        const res = await getSettings();
        const { data } = res;
        this.form = data.config;
      } catch (err) {
        console.log(err);
      }
    },
    async submitSetSettings() {
      try {
        const res = await setSettings(this.form);
        this.$message({
          type: 'success',
          message: res.data.message,
        });
      } catch (err) {
        console.log(err);
        this.$message({
          type: 'info',
          message: err.response.data.message,
        });
      }
    },
  },
};
</script>
