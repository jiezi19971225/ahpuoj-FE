<template>
  <div class="admin-content">
    <el-row>
      <el-col :xs="24" :md="12">
        <el-card class="content__card__item">
          <h2 class="content__card__title">设置</h2>
          <el-form ref="form" :model="form">
            <el-form-item label="讨论版">
              <el-switch
                v-model="form.enable_issue"
                active-text="开"
                inactive-text="关"
                active-value="active-value"
              ></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSetSettings" :loading="btnLoading"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
import * as settingsApi from 'admin/api/settingsts'

export default defineComponent({
  name: 'adminSetting',
  setup() {
    const btnLoading = ref(false)
    const form = reactive({
      enable_issue: true,
    })

    settingsApi.getSettings<SettingsResposne>().then(res => {
      Object.assign(form, res.config)
    })

    const submitSetSettings = () => {
      btnLoading.value = true
      try {
        settingsApi.setSettings(form)
      } catch (err) {
        console.log(err)
      } finally {
        btnLoading.value = false
      }
    }
    return {
      form,
      btnLoading,

      submitSetSettings,
    }
  },
})
</script>
