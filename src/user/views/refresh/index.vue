<template>
  <div></div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace(from.path)
    })
  },
})
</script>
