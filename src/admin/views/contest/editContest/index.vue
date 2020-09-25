<template>
  <contest :isEdit="true"></contest>
</template>

<script>
import Contest from '../contest/index.vue';

export default {
  name: 'adminEditContest',
  components: {
    Contest,
  },
};
</script>
