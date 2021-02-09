<template>
  <status :isContest="false"></status>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import Status from '../status/index.vue'

export default defineComponent({
  name: 'normalStatus',
  components: {
    Status,
  },
})
</script>
