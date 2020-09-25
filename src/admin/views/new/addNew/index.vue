<template>
  <new :isEdit="false"></new>
</template>

<script>
import New from '../new/index.vue';

export default {
  name: 'adminAddNew',
  components: {
    New,
  },
};
</script>
