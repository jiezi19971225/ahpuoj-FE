<template>
  <status :isContest="true"></status>
</template>

<script>
import Status from '../status/index.vue';

export default {
  name: 'contestlStatus',
  components: {
    Status,
  },
};
</script>
