<style lang="less" scoped>
.wrapper {
  position: relative;
  padding-top: 40px;
  min-height: 660px;
}
.back {
  display: flex;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}
</style>
<template lang="pug">
Row.wrapper(:gutter="16")
  Col(span="2")
    router-link(:to="{name:'order'}")
      .back.Shadow3
        Icon.color-common-text(type="prevPage")
  Col(span="12")
    i.broker-space
    Detail(:data="orderInfo", ref="detail", :init="init" :transferLastSeconds="transferLastSeconds", :appealLastSeconds="appealLastSeconds" )
  Col(span="2")
    i.broker-space
    br
    Icon(type="alarm" v-if="orderInfo.status < 30" size="24")
  Talk(:data="orderInfo", :appealLastSeconds="appealLastSeconds")
</template>
<script>
import Detail from './components/detail_main.vue';
import Talk from './components/detail_talk.vue';
import { mapState } from 'vuex';
let fn = null;
export default {
  data() {
    return {
      init: false,
      orderInfo: {},
      transferLastSeconds: 0,
      appealLastSeconds: 0
    };
  },
  computed: {
    ...mapState(['common'])
  },
  methods: {
    load() {
      clearTimeout(fn);
      this.$axios
        .post('/api/otc/new/order/info', {
          orderId: this.$route.params.orderId
        })
        .then(result => {
          if (result.code === 0) {
            //不能使用全部刷新，每次返回结果都会重置选择结果
            if (this.init) {
              this.orderInfo.status = result.data.status;
              this.orderInfo.buyerRealName = result.data.buyerRealName;
              this.orderInfo.sellerRealName = result.data.sellerRealName;
              this.orderInfo.targetConnectInfomation =
                result.data.targetConnectInfomation;
              this.orderInfo.paymentTermResult = result.data.paymentTermResult;
            } else {
              //接口在未支付状态下接口默认值为0(银行卡)，在用户没有绑定银行卡的时候会报错
              if (result.data.status == 10) {
                result.data.paymentId = result.data.paymentTermList[0].id;
              }
              this.orderInfo = result.data;
            }

            this.transferLastSeconds = result.data.transferLastSeconds;
            this.appealLastSeconds = result.data.appealLastSeconds;
            this.init = true;
          }
        });
      fn = setTimeout(() => {
        if (this.orderInfo.status < 40) {
          this.load();
        }
      }, this.common.time.fast);
    }
  },
  created() {
    this.load();
  },
  components: {
    Detail,
    Talk
  },
  beforeDestroy() {
    clearTimeout(fn);
  }
};
</script>
