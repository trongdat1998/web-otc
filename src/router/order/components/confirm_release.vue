<style lang="less" scoped>
.order_detail_modal {
  .order_price {
    margin: 20px 0 0;
    li {
      height: 32px;
      padding: 8px 0;
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
  .icon {
    width: 20px;
    vertical-align: middle;
  }
}
</style>
<template lang="pug">
Dialog(:title="title", :desc="description", v-model="visible")
  .order_detail_modal
    ul.order_price.Body2
      li 
        span.color-grey-500 {{$lang('放行币种')}}:
        em {{data.tokenName}}
      li 
        span.color-grey-500  {{$lang('放行数量')}}: 
        em.color-secondary-dark(v-if="data.currencyId") {{data.quantity}} {{data.tokenName}}
      li(v-if="data.price")
        span.color-grey-500(v-if="data.currencyId")  {{$lang('应收金额')}}:
        em {{data.amount}} {{data.currencyId}}
      template(v-if="data.paymentTermResult&& data.paymentTermResult.accountNo")
        li
          span.color-grey-500 {{$lang('支付方式')}}:
          em {{common.paymentTypes[data.paymentType].paymentName}} 
            img.icon(:src="common.paymentTypes[data.paymentType].icon")

        li(v-for="_item,_key in data.paymentTermResult" v-if="common.paymentTypes[data.paymentType].views[_key]&&common.paymentTypes[data.paymentType].items[_key].type!='image'")
          span.color-grey-500 {{common.paymentTypes[data.paymentType].items[_key].label}}:
          em {{_item}} 
      li 
        span.color-grey-500  {{$lang('付款人')}}: 
        em {{data.targetNickName}}
  form
    input(type="text" style="display: none;" autocomplete="username")
    Input(type="password", v-model="tradePwd", :label="$lang('资金密码')" visible :error="!!help", :help="help" @input="help=''")
  template(slot="footer")
    Button(type="primary" text @click="visible=false" v-if="!loading") {{$lang('取消')|toUP}}
    Button(type="primary" :loading="loading" text @click="submit") {{$lang('确认放币')|toUP}}
</template>
<script>
import md5 from "md5";
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
      tradePwd: "",
      loading: false,
      help: ""
    };
  },
  watch: {
    value(val) {
      if (val) {
        this.tradePwd = "";
      }
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
        return `${this.$lang("放行")} ${this.data.quantity} ${
          this.data.tokenName
        } ?`;
      } else {
        return "";
      }
    },
    description() {
      return this.$lang(
        "买方已确定付款，请及时查收并尽快向买方放行。务必确认收到款项后再放行数字资产，否则有可能造成您财产的损失。"
      );
    }
  },
  methods: {
    submit() {
      if (!this.tradePwd) {
        return (this.help = this.$lang("请输入资金密码"));
      }
      this.loading = true;
      this.$axios
        .post("/api/otc/order/finish", {
          orderId: this.data.id,
          paymentType: this.data.paymentType,
          tradePwd: md5(this.tradePwd)
        })
        .then(result => {
          if (result.code == 0) {
            location.reload();
          } else {
            this.loading = false;
          }
        });
    }
  }
};
</script>