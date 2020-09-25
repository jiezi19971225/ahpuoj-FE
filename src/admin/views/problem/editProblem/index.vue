<template>
  <problem :isEdit="true"></problem>
</template>

<script>
import Problem from '../problem/index.vue';

export default {
  name: 'adminEditProblem',
  components: {
    Problem,
  },
};
</script>
