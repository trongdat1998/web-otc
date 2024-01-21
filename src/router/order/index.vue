<template lang="pug">
div
  Nav
  Pending
  History
</template>
<script>
import History from "./components/index_history.vue";
import Pending from "./components/index_pending.vue";
import { mapState } from "vuex";
import Helper from "@/libs/helper";
export default {
  components: {
    History,
    Pending
  },
  computed: {
    ...mapState(["common"])
  },
  created() {
    if (!this.common.isLogin) {
      Helper.goLogin();
    }
  }
};
</script>