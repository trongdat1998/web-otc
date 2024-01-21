<style lang="less" scoped>
.settings {
  .content {
    position: relative;
    padding-bottom: 40px;
    margin-top: 48px;
    border-top-width: 1px;
    border-top-style: solid;
    padding-top: 15px;
    .item {
      .col {
        padding: 17px 0;
      }
      .info {
        padding: 8px 0;
        line-height: 32px;
      }
    }
  }
  .caption {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top:0;
    padding:0 20px;
  }
}
</style>
<template lang="pug">
.settings
  Nav
  .content.Body2.border-grey-100
    .caption.bg-common-background.Subtitle1 {{$lang("OTC账户设置")}}
    TraderInfo
    Security
    Kyc(:verifyInfo="verifyInfo" v-if="init")
    Payment(:verifyInfo="verifyInfo" v-if="init")
</template>

<script>
import TraderInfo from "./traderInfo";
import Security from "./security";
import Payment from "./payment";
import Kyc from "./kyc";
import { mapState } from "vuex";
import Helper from "@/libs/helper";
export default {
  components: {
    TraderInfo,
    Security,
    Payment,
    Kyc
  },
  data() {
    return {
      verifyInfo: {},
      init: false
    };
  },
  computed: {
    ...mapState(["common"])
  },
  created() {
    if (this.common.isLogin) {
      this.$axios.post("/api/user/verify_info").then(result => {
        this.verifyInfo = result.data;
        this.init = true;
      });
    } else {
      Helper.goLogin();
    }
  }
};
</script>
