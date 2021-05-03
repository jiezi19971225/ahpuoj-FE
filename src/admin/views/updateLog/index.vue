<template>
  <div class="admin-content">
    <UpdateLoger />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import UpdateLoger from '@common/components/UpdateLoger/index.vue'

export default defineComponent({
  name: 'updateLoger',
  components: {
    UpdateLoger,
  },
})
</script>
