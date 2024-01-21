<template lang="pug">
div
  Nav
  Create
  List
</template>
<script>
import Create from "./create.vue";
import List from "./list.vue";
export default {
  data() {
    return {
      shaows: []
    };
  },
  created() {},
  components: {
    Create,
    List
  }
};
</script>