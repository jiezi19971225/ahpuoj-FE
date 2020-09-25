<template>
  <issue-list :isProblem="false"></issue-list>
</template>

<script>
import IssueList from '../issueList/index.vue';

export default {
  name: 'mainIssueList',
  components: {
    IssueList,
  },
};
</script>
