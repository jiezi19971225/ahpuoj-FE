<template>
  <contest :isEdit="false"></contest>
</template>

<script>
import Contest from '../contest/index.vue';

export default {
  name: 'adminAddContest',
  components: {
    Contest,
  },
};
</script>
