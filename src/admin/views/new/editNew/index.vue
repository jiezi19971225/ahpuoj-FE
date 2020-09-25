<template>
  <new :isEdit="true"></new>
</template>

<script>
import New from '../new/index.vue';

export default {
  name: 'adminEditNew',
  components: {
    New,
  }
};
</script>
