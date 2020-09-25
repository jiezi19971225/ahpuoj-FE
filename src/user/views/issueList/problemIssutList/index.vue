<template>
  <issue-list :isProblem="true"></issue-list>
</template>

<script>
import IssueList from '../issueList/index.vue';

export default {
  name: 'problemIssueList',
  components: {
    IssueList,
  },
};
</script>
