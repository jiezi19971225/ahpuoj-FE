<template>
  <status :isContest="false"></status>
</template>

<script>
import Status from '../status/index.vue';

export default {
  name: 'normalStatus',
  components: {
    Status,
  },
};
</script>
