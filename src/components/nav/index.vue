<template lang="pug">
.broker-nav
  .broker-nav-links
    router-link.Body1.color-common-text(v-for="item in common.token", :to="{name:'trade', params:{ tokenId: item.tokenId }}" @click.native="getTradeList({page:1,tokenId:item.tokenId})" :key="item.tokenId") {{item.tokenName}}
    template(v-if="common.isLogin")
      span.bg-grey-100.broker-nav-line
      router-link.Body1.color-common-text.broker-nav-offer(:to="{name:'offer'}" v-if="common.userInfo.whiteFlag") {{$lang('发布广告')}}
      Badge(:count="count" class-name="Shadow2 bg-error-main")
        router-link.Body1.color-common-text(:to="{name:'order'}") {{$lang('订单')}}
  .broker-nav-setting(v-if="common.isLogin")
    router-link.Body1.color-common-text(:to="{name:'settings'}") {{$lang('设置')}}
</template>
<script>
let fn = null;
import { mapState, mapActions } from "vuex";
export default {
  name: "Nav",
  data() {
    return {
      count: 0
    };
  },
  methods: {
    ...mapActions(["getTradeList"]),
    load() {
      this.$axios.post("/api/otc/order/pending/count").then(result => {
        if (result.code == 0) {
          this.count = result.data.count;
        }
      });
      fn = setTimeout(this.load, this.common.time.fast);
    }
  },
  computed: {
    ...mapState(["common"])
  },
  beforeDestroy() {
    clearTimeout(fn);
  },
  created() {
    if (this.common.isLogin) {
      this.load();
    }
  }
};
</script>
