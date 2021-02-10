<template>
  <div>
    <div class="account-setting__img-wrapper">
      <img class="account-setting__avatar" :src="imgUrl($store.getters.userAvatar)" /><a
        @click="toggleShowAvatarUploader"
      >
        <div class="img-mask">
          <p>更换头像</p>
        </div>
      </a>
    </div>
    <avatar-upload
      field="img"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      method="PUT"
      v-model="showAvatarUploader"
      :width="200"
      :height="200"
      url="/api/user/avatar"
      :headers="headers"
      :noRotate="false"
      img-format="png"
    ></avatar-upload>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useDispatch, useMapState, useMessge } from 'common/use'
// @ts-ignore
import AvatarUpload from 'vue-image-crop-upload'

export default defineComponent({
  components: {
    AvatarUpload,
  },
  setup() {
    const showAvatarUploader = ref(false)
    const message = useMessge()
    const dispatch = useDispatch()

    const states = useMapState({
      user: state => state.user,
    })

    const cropUploadSuccess = (res, field) => {
      dispatch('user/UpdateUserAvatar', res.url)
      message({
        message: '更新头像成功',
        type: 'success',
      })
    }
    const cropUploadFail = (status, field) => {
      message({
        message: '更新头像失败',
        type: 'success',
      })
    }
    const headers = computed(() => {
      return {
        Authorization: states.user.token,
      }
    })

    const toggleShowAvatarUploader = () => {
      showAvatarUploader.value = !showAvatarUploader.value
    }

    return {
      showAvatarUploader,
      headers,

      toggleShowAvatarUploader,
      cropUploadSuccess,
      cropUploadFail,
    }
  },
})
</script>

<style lang="scss">
.account-setting__img-wrapper {
  position: relative;

  .account-setting__avatar {
    height: 2rem;
    width: 2rem;
    border-radius: 1.5rem;
    border: 0.03rem solid $--color-level15;
  }

  .img-mask {
    text-align: center;
    line-height: 2rem;
    font-size: 0.2rem;
    position: absolute;
    left: 0;
    top: 0;
    height: 2rem;
    width: 2rem;
    border: 0.03rem solid $--color-level15;
    color: $--color-level15;
    background: rgba($color: $--color-level3, $alpha: 0.5);
    opacity: 0;
    transition: all 0.3s;
    border-radius: 1.5rem;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
