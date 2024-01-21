<template lang="pug">
.broker-footer.bg-black-800
  .broker-footer-con
    .broker-footer-left(span="10")
      .broker-footer-logo.color-grey-500
        img(:src="common.logo" v-if="common.logo")
      .broker-footer-copyright.color-grey-500 {{common.indexConfig.copyright}}
      .broker-footer-link
        template(v-for="item in common.indexConfig.shares")
          Poptip(trigger="hover" v-if="isPic(item.shareUrl)")
            img(:src="item.shareUrl" slot="content" width="128" style="padding-top:5px")
            Icon.hover-common-surface.color-grey-200(size="32" :type="item.shareKey")
          a.hover-common-surface.color-grey-200(:href="item.shareUrl" target="_blank", rel="noopener noreferrer nofollow" v-else)
            Icon(size="32" :type="item.shareKey")
    .broker-footer-group(v-for="(item,index) in common.indexConfig.footConfigList")
      h3.Body1.color-common-surface.hover-common-surface {{item.caption}}
      p.Caption(v-for="_item in item.items")
        a.Body2.hover-common-surface.color-grey-500(:href="_item.link" target="_blank", rel="noopener noreferrer nofollow") {{_item.text}}
</template>
<script>
import { mapState } from "vuex";
import Icon from "../icon/index.vue";
export default {
  name: "Footer",
  components: { Icon },
  computed: {
    ...mapState(["common"])
  },

  methods: {
    isPic(url) {
      return /\.jpg|\.png|\.gif/.test(url);
    }
  }
};
</script>
