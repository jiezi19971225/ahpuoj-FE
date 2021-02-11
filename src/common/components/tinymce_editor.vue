<template>
  <div class="tinymce-editor" :style="{ height: height + 'px' }">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
      :key="tinymceKey"
    ></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/themes/mobile/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/code'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import { staticAssetsBase } from 'common/const'
import axios from 'axios'

export default {
  name: 'TinymceEditor',
  components: {
    Editor,
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default: 'lists image table wordcount code',
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image  table | removeformat',
    },
    height: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      tinymceKey: 0,
      // 初始化配置
      init: {
        relative_urls: false,
        language_url: `${staticAssetsBase}/static/tinymce/langs/zh_CN.js`,
        skin_url: `${staticAssetsBase}/static/tinymce/skins/ui/oxide`,
        content_css: `${staticAssetsBase}/static/tinymce/skins/ui/oxide/content.min.css`,
        language: 'zh_CN',
        height: this.height,
        resize: false,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        automatic_uploads: false,
        // 禁用移动主题
        mobile: {
          theme: 'silver',
        },
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())
          const config = {
            // 添加请求头
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: this.$store.getters.token,
            },
          }
          axios
            .post('/api/admin/image', formData, config)
            .then(res => {
              success(res.data.url)
            })
            .catch(err => {
              console.log(err)
            })
          // const img = "data:image/jpeg;base64," + blobInfo.base64();
        },
      },
      myValue: this.value,
    }
  },
  activated() {
    this.tinymceKey += 1
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    },
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    },
  },
}
</script>
