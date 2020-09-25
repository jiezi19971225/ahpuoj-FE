<template>
  <problem :isEdit="false"></problem>
</template>

<script>
import Problem from '../problem/index.vue';

export default {
  name: 'adminAddProblem',
  components: {
    Problem,
  },
};
</script>
