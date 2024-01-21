<template lang="pug">
.broker-main
  .broker-preview-mode.bg-error-main.color-error-text(v-if="preview") 
    a.color-error-text(@click.prevent="previewClean") {{$lang('预览模式 - 点击切换线上模式')}}
  Header(fixed)
  .broker-container
    router-view
  Footer
</template>

<script>
import { mapActions } from "vuex";
import Helper from "@/libs/helper";
export default {
  data() {
    return {
      preview: Helper.cookie("preview")
    };
  },
  methods: {
    ...mapActions(["setCookie"]),
    previewClean() {
      this.setCookie({ name: "preview", value: null });
      location.href = location.origin;
    }
  }
};
</script>
