<style lang="less" scoped>
.orderInfo {
  padding: 15px 0 24px;
  display: flex;
  align-items: flex-start;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  .price {
    flex: 1;
    display: flex;
    align-items: center;
    .icon {
      margin: 0 16px 0 0;
    }
    .info {
      span,
      em {
        font-style: initial;
      }
    }
  }
  .userInfo {
    flex: 2;
    ul {
      display: flex;
      list-style: none;
      flex-wrap: wrap;
    }

    li {
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      height: 32px;
      span {
        flex: 0 0 36%;
      }
      em {
        flex: 0 0 64%;
        font-style: initial;
        img {
          width: 20px;
          margin: 0 4px;
        }
      }
    }
    p {
      padding: 4px 0;
      line-height: 24px;
      display: flex;
      span {
        flex: 0 0 18%;
      }
      em {
        flex: 0 0 82%;
        font-style: initial;
        i {
          font-size: 16px;
          margin: 0 8px 0 0;
        }
      }
    }
  }
}
.order {
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .desc {
    flex: 1;
    line-height: 32px;
    padding-top: 16px;
  }
  .form {
    flex: 2;
    .icon {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 49px;
      padding-top: 16px;
      i {
        font-size: 16px;
      }
    }
    .btn {
      text-align: right;
      padding-top: 16px;
    }
    .ivu-form-item {
      margin: 0;
    }
  }
}
.main {
  min-width: 1280px;
  max-width: 1328px;
  margin: 0 auto;
  padding: 0 56px;
  position: relative;
}
.colse {
  position: absolute;
  right: 65px;
  top: 10px;
  cursor: pointer;
}
</style>
<template lang="pug">
Modal(v-model="visible", :styles="{top: '0px',width:'100%'}", :closable="false" class="orderModal")
  .main(v-if="data.nickName")
    Icon.colse(type="close" @click.native="visible=false")
    .orderInfo.border-grey-50
      .price
        .icon
          Avatar(:color="data.accountId") {{data.nickName[0].toUpperCase()}}
        .info.Subtitle2
          span.color-common-text {{$lang(data.side==0?"购买":"出售")}} 
          em.color-secondary-dark {{data.lastQuantity}} {{data.tokenName}}
      .userInfo.Body2
        ul
          li
            span.color-grey-500 {{$lang("昵称")}}:
            em {{data.nickName}}
          li
            span.color-grey-500 {{$lang("单价")}}:
            em {{data.price}} {{data.currencyId}}
          li
            span.color-grey-500 {{$lang("30日成单")}}:
            em {{data.recentOrderNum}}
          li
            span.color-grey-500 {{$lang("限额")}}:
            em {{data.minAmount}} - {{data.maxAmount}} {{data.currencyId}}
          li
            span.color-grey-500 {{$lang("30日完成率")}}:
            em {{data.recentExecuteRate}}%
          li
            span.color-grey-500 {{$lang("支付方式")}}:
            em
              Tooltip(:content="common.paymentTypes[_item].paymentName" placement="top" v-for="_item,_index in data.payments" :key="_index")
                img(:src="common.paymentTypes[_item].icon")
        p(v-if="data.remark")
          span.color-grey-500 {{$lang("备注信息")}}:
          em {{data.remark}}
    .order
      .desc.Subtitle2 {{$lang(data.side==1?"买方付款时限为15分钟":"卖方放币时限为15分钟")}}
      .form(v-if="overtime")
        Row
          Col(span="24") 
            .desc.Subtitle2(style="text-align:right") {{$lang("订单确认时限为45秒，本次确认已超时，请刷新重试。")}}
              a(href="") {{$lang("刷新")}}
      .form(v-else)
        Row(v-if="common.userInfo.tradeFlag")
          Col(span="9")
            Input(maxlength="16", :help="formRule.quantity.error", :label="quantityTitle" v-model="quantity" @keyup="checkForm('quantity')", :error="!!formRule.quantity.error")
              strong(slot="after") {{data.tokenName}}
          Col.icon(span="2")
            Icon.color-grey-500(type='transaction')
          Col(span="9")
            Input(maxlength="16", :help="formRule.amount.error", :label="$lang('金额')" v-model="amount" @keyup="checkForm('amount')", :error="!!formRule.amount.error")
              strong(slot="after") {{data.currencyId}}
          Col.btn(span="4")
            Button(@click="!loading&&submit()", :loading="loading" type='primary') {{$lang(data.side==1?"购买":"出售")|toUP}}
        Row(v-else)
          Col(span="6")
            Input(maxlength="16", :help="formRule.quantity.error", :label="quantityTitle" v-model="quantity" @keyup="checkForm('quantity')", :error="!!formRule.quantity.error")
              strong(slot="after") {{data.tokenName}}
          Col(span="2").icon
            Icon.color-grey-500(type='transaction')
          Col(span="6")
            Input(maxlength="16", :help="formRule.amount.error", :label="$lang('金额')" v-model="amount" @keyup="checkForm('amount')", :error="!!formRule.amount.error")
              strong(slot="after") {{data.currencyId}}
          Col(span="5", offset="1")
              Input(:label="$lang('资金密码')" visible type="password" v-model="tradePwd" :help="formRule.tradePwd.error", :error="!!formRule.tradePwd.error" @keyup="formRule.tradePwd.error=''" maxlength="20")
          Col.btn(span="4")
            Button(@click="!loading&&submit()", :loading="loading" type='primary') {{$lang(data.side==1?"购买":"出售")|toUP}}
</template>
<script>
import md5 from "md5";
import Helper from "@/libs/helper";
import { mapState, mapActions } from "vuex";
import core from "mathjs/core";
const math = core.create();
math.import(require("mathjs/lib/function/arithmetic/add"));
math.import(require("mathjs/lib/function/arithmetic/subtract"));
math.import(require("mathjs/lib/function/arithmetic/multiply"));
math.import(require("mathjs/lib/function/arithmetic/divide"));
math.import(require("mathjs/lib/function/string/format"));
math.import(require("mathjs/lib/type/chain"));
math.import(require("mathjs/lib/type/bignumber"));
math.config({
  number: "BigNumber", // Default type of number:
  precision: 20 // Number of significant digits for BigNumbers
});

let fn = null;
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
    },
    free: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      amount: "",
      quantity: "",
      tradePwd: "",
      visible: this.value,
      flag: "",
      overtime: false,
      time: 0,

      formRule: {
        amount: {
          error: "",
          prop: "请在%min%-%max%之间设置金额",
          required: true
        },
        quantity: {
          error: "",
          prop: "请在%min%-%max%之间设置限额",
          required: true
        },
        tradePwd: {
          error: ""
        }
      }
    };
  },
  methods: {
    ...mapActions(["setUserInfo"]),
    checkForm(type) {
      this.flag = type;
      this.formRule.amount.error = "";
      this.formRule.quantity.error = "";

      //数量
      if (type === "quantity") {
        this.quantity = Helper.formatNumber(
          this.quantity,
          this.data.tokenConfig.scale
        );
        if (this.quantity && this.quantity > 0) {
          this.amount = math
            .chain(math.bignumber(this.quantity))
            .multiply(math.bignumber(this.data.price))
            .format({ notation: "fixed" })
            .done()
            .cutFixed(this.data.currencyConfig.amountScale);
        } else {
          this.amount = "";
        }

        // 购买数量不能高出广告剩余数量
        if (Number(this.quantity) > Number(this.data.lastQuantity)) {
          this.formRule[type].error = this.$lang(this.formRule[type].prop)
            .replace("%max%", this.data.lastQuantity)
            .replace("%min%", Number(this.data.tokenConfig.minQuote));
        }
        return;
      }

      // 金额;
      if (type === "amount") {
        this.amount = Helper.formatNumber(
          this.amount,
          this.data.currencyConfig.amountScale
        );
        if (this.amount && this.amount > 0) {
          this.quantity = math
            .chain(math.bignumber(this.amount))
            .divide(math.bignumber(this.data.price))
            .format({ notation: "fixed" })
            .done()
            .cutFixed(this.data.tokenConfig.scale);
        } else {
          this.quantity = "";
        }

        // 购买金额不能超出广告限额
        if (
          Number(this.amount) > Number(this.data.maxAmount) ||
          Number(this.amount) < Number(this.data.minAmount)
        ) {
          this.formRule[type].error = this.$lang(this.formRule[type].prop)
            .replace("%max%", Number(this.data.maxAmount))
            .replace("%min%", Number(this.data.minAmount));
        }
      }
    },
    beforSubmit(type) {
      //订单45秒超时
      if (!this.time) {
        this.overtime = true;
        return;
      }

      // 订单数量校验
      if (type === "quantity") {
        // 卖单先校验对应余额 是否足够 出售
        if (this.data.side == 0 && Number(this.quantity) > Number(this.free)) {
          this.formRule.quantity.error = this.$lang(
            "余额不足，请重新调整交易数量"
          );
          return false;
        }

        // 购买数量不能高出广告剩余数量 切不能低于平台最低限额
        if (
          Number(this.quantity) > Number(this.data.lastQuantity) ||
          Number(this.quantity) < Number(this.data.tokenConfig.minQuote)
        ) {
          this.formRule[type].error = this.$lang(this.formRule[type].prop)
            .replace("%max%", this.data.lastQuantity)
            .replace("%min%", Number(this.data.tokenConfig.minQuote));
          return false;
        }
      }

      if (type == "amount") {
        // 校验是否在订单限制交易金额范围内
        if (
          Number(this.amount) > Number(this.data.maxAmount) ||
          Number(this.amount) < Number(this.data.minAmount)
        ) {
          this.formRule[type].error = this.$lang(this.formRule[type].prop)
            .replace("%max%", Number(this.data.maxAmount))
            .replace("%min%", Number(this.data.minAmount));
          return false;
        }
      }
      return true;
    },
    submit() {
      let isOk = true;

      Object.keys(this.formRule).forEach(el => {
        if (this.formRule[el].required) {
          if (!this.beforSubmit(el)) {
            isOk = false;
          }
        }
      });

      // 密码校验
      if (!this.common.userInfo.tradeFlag && !this.tradePwd) {
        this.formRule.tradePwd.error = this.$lang("请输入资金密码");
        isOk = false;
      }

      if (isOk) {
        this.loading = true;
        this.$axios
          .post("/api/otc/order/create", {
            amount: this.amount,
            quantity: this.quantity,
            flag: this.flag,
            tradePwd: md5(this.tradePwd),
            side: this.data.side == 1 ? 0 : 1,
            tokenId: this.data.tokenId,
            itemId: this.data.id,
            price: this.data.price,
            remark: this.data.remark,
            curPrice: this.data.curPrice,
            currencyId: this.data.currencyId
          })
          .then(result => {
            this.loading = false;
            if (result.code == 0 && result.data.success) {
              this.$router.push({
                name: "orderDetail",
                params: { orderId: result.data.orderId }
              });
            }
          });
      }
    }
  },
  computed: {
    ...mapState(["common"]),
    quantityTitle() {
      let arr = [this.$lang("数量")];
      if (this.data.side == 0) {
        arr.push(this.$lang("可用"));
        arr.push(this.free);
      }
      return arr.join(" ");
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.tradePwd = "";
        this.amount = "";
        this.quantity = "";
        this.time = 45;
        this.overtime = false;
        Object.keys(this.formRule).forEach(el => {
          this.formRule[el].error = "";
        });

        if(this.data.userDefaultAmount){
          this.amount = this.data.userDefaultAmount
          this.checkForm('amount')
        }
      }
    },
    visible(val) {
      if (val === false) {
        this.buttonLoading = false;
      }
      this.$emit("input", this.visible);
    },
    time() {
      clearTimeout(fn);
      if (this.time) {
        fn = setTimeout(() => {
          this.time = this.time - 1;
        }, 1000);
      }
    }
  },
  created() {
    if (this.common.isLogin) {
      this.setUserInfo();
    }
  }
};
</script>