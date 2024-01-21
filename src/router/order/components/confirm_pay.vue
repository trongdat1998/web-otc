<style lang="less" scoped>
.order_detail_modal {
  .desc {
    margin: 0 0 25px;
  }
  .order_price {
    margin: 20px 0 0;
    li {
      padding: 4px 0;
      display: flex;
      align-items: center;
      span {
        flex: 0 0 40%;
      }
      em {
        flex: 0 0 60%;
        font-style: initial;
      }
    }
  }
  .tip{
    text-align: justify;
  }
  .icon {
    width: 20px;
    vertical-align: middle;
  }
}
</style>
<template lang="pug">
Dialog(:title="title", :desc="description",  v-model="visible")
  .order_detail_modal
    ul.order_price.Body2
      li 
        span.color-grey-500 {{$lang('付款货币')}}:
        em(v-if="data.currencyId") {{data.currencyId}}
      li 
        span.color-grey-500 {{$lang('付款金额')}}: 
        em.color-secondary-dark(v-if="data.amount") {{data.amount}}
      li 
        span.color-grey-500 {{$lang('付款对象')}}:
        em {{data.targetNickName}}
      template(v-if="data.paymentTermList && payment")
        li
          span.color-grey-500 {{$lang('支付方式')}}:
          em {{common.paymentTypes[payment.paymentType].paymentName}} 
            img.icon(:src="common.paymentTypes[payment.paymentType].icon")

        li(v-for="_item,_key in payment" v-if="common.paymentTypes[payment.paymentType].views[_key]&&common.paymentTypes[payment.paymentType].items[_key].type!='image'")
          span.color-grey-500 {{common.paymentTypes[payment.paymentType].items[_key].label}}:
          em {{_item}} 

  .Subtitle2.tip.Caption.color-error-main {{$lang('平台不支持自动扣款，请您向以上账号自行付款。')}}
  template(slot="footer")
    Button(type="primary" text @click="visible=false" v-if="!loading") {{$lang('取消')|toUP}}
    Button(type="primary" :loading="loading" text @click="submit") {{$lang('我已完成付款')|toUP}}
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.value,
      loading: false
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible() {
      this.$emit("input", this.visible);
    }
  },
  computed: {
    ...mapState(["common"]),
    title() {
      if (this.data.price) {
        return `${this.$lang("您已付款")} ${this.data.amount} ${this.data.currencyId}?`;
      } else {
        return "";
      }
    },
    description() {
      return this.$lang(
        "请确认您付款的金额和支付方式与下方信息无误，否则卖家可拒绝放币并提交投诉。"
      );
    },
    payment() {
      return this.data.paymentTermList.filter(el => {
        return el.id == this.data.paymentId;
      })[0];
    }
  },
  methods: {
    submit() {
      this.loading = true;
      this.$axios
        .post("/api/otc/order/pay", {
          orderId: this.data.id,
          id: this.data.paymentId,
          paymentType: 0
        })
        .then(() => {
          location.reload();
        });
    }
  }
};
</script>