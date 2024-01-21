<style lang="less" scoped>
.qrcode {
  max-width: 300px;
  max-height: 300px;
}
.detailbox {
  flex: 1;
  height: 100%;
  overflow: auto;
  .icon {
    width: 20px;
    vertical-align: middle;
  }
  .amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    margin: 0 0 8px;
    div {
      &:nth-child(2n) {
        display: flex;
        align-items: center;
        span {
          margin: 0 5px 0 0;
        }
      }
    }
  }
  .price {
    height: 40px;
    margin: 0 0 15px;
  }
  .from {
    list-style: none;
    li {
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      span {
        width: 176px;
      }
      em {
        font-style: normal;
      }
      i {
        margin-top: -3px;
        cursor: pointer;
      }
      // img {
      //   width: 143px;
      // }
    }
  }
  .pay {
    display: flex;
    align-items: center;
    span {
      margin: 0 15px 0 0;
    }
  }
  .action {
    margin: 24px 0 40px;
    p {
      margin: 0 0 14px;
    }
    div {
      display: flex;
      align-items: center;
      i {
        margin: 0 10px 0 0;
      }
    }
  }
  .desc {
    margin: 0 0 45px;
    p {
      margin: 0 0 5px;
      padding-left: 12px;
      text-indent: -12px;
      text-align: justify;
    }
  }
}
.form {
  padding-bottom: 30px;
}
.button-space {
  margin-right: 20px;
}
.paymentList {
  padding-left: 5px;
}
.payment {
  height: 36px;
  &Item {
    display: inline-block;
    padding: 0 5px;
  }
}
.success {
  height: 44px;
  font-size: 16px;
  padding-right: 20px;
  padding-left: 20px;
}
</style>
<template lang="pug">
.detailbox.border-grey-100(v-if="init")
  .amount
    Divider(orientation="left").color-common-text {{$lang(data.side==0?"购买":"出售")}} {{data.quantity}} {{data.tokenName}}
  .price.Display2.color-secondary-dark(v-if="data.price") {{data.amount}} {{ data.currencyId }}
  ul.from.Body2
    li
      span.color-grey-500 {{$lang(data.side==0?"卖方":"买方")}}:
      em {{data.targetNickName}} ({{data.recentOrderNum}}/{{data.recentExecuteRate}}%)
    li
      span.color-grey-500 {{$lang('单价')}}:
      em {{data.price}} {{data.currencyId}} / {{data.tokenName}}
    li
      span.color-grey-500 {{$lang('订单编号')}}: 
      em {{data.id}}
    li
      span.color-grey-500 {{$lang('订单时间')}}: 
      em {{new Date(data.createDate*1).format()}}
    li(v-if="common.userInfo.whiteFlag && data.targetFirstName")
      span.color-grey-500 {{$lang('实名认证')}}: 
      em 
        Icon.color-secondary-dark(type="Icon_Authentication")
        |  {{[data.targetFirstName, data.targetSecondName].join(" ")}}
  .pay(v-if="data.status!==40")
    Divider(orientation="left") {{$lang('支付方式')}}

  RadioGroup.paymentList(v-model="data.paymentId" vertical v-if="data.status==10")
    Radio.payment(:label="_item.id" v-for="_item in data.paymentTermList" , :key="_item.id")
      img.icon(:src="common.paymentTypes[_item.paymentType].icon")
      span.color-grey-500.paymentItem {{common.paymentTypes[_item.paymentType].paymentName}}
      template(v-for="__item,__key in _item" v-if="common.paymentTypes[_item.paymentType].views[__key]")
        Poptip(trigger="hover" v-if="_item[common.paymentTypes[_item.paymentType].isPic] && common.paymentTypes[_item.paymentType].items[__key].type=='image'")
          img.qrcode(:src="__item" slot="content")
          Icon(type="code1" size="20")
        span.paymentItem(v-else) {{__item}}
  ul.from.Body2(v-else)
    li(v-if="data.status!==10") 
      span.color-grey-500 {{common.paymentTypes[data.paymentType].paymentName}}
      em
        img.icon(:src="common.paymentTypes[data.paymentType].icon")
    li(v-for="_item,_key in data.paymentTermResult" v-if="common.paymentTypes[data.paymentType].views[_key]")
      span.color-grey-500 {{common.paymentTypes[data.paymentType].items[_key].label}}:
      em
        Poptip(trigger="hover" v-if="common.paymentTypes[data.paymentType].isPic && common.paymentTypes[data.paymentType].items[_key].type=='image'")
          img.qrcode(:src="_item" slot="content")
          Icon(type="code1" size="20")
        template(v-else-if="_key==='bankName'") {{common.bankMap[_item]||_item}} 
        template(v-else) {{_item}} 

  Divider
  // 买方, 状态管理
  div(v-if="data.side === 0")
    strong.Body2.color-error-main(v-if="data.status<40") {{tip}}
    .action(v-if="data.status === 10")
      p.Subtitle1 
        CountDown.color-secondary-dark(v-model="transferLastSeconds" , :template='$lang("请在%m%:%s%内付款")' @timeEnd="countdown")
      Button.button-space.success(type="primary" @click="payModal = true") {{$lang('我已完成付款')|toUP}}
      Button(@click="tipModal=true" text) {{$lang('取消订单')|toUP}}
    .action(v-else-if="data.status === 20")
      p.Subtitle1 {{$lang('请等待卖方放币')}}
      Button.success.button-space(disabled) {{$lang('等待放币')|toUP}}
      // 申诉按钮有时间限制，状态变化时间过去5分钟后，才可进行申诉
      Button(v-if="~~appealLastSeconds" disabled text) 
        CountDown(v-model="appealLastSeconds")
        | {{$lang('后可提交申诉')|toUP}}
      Button(@click="complaintModal = true" v-else text) {{$lang('提交申诉')|toUP}}
    .action(v-else-if="data.status === 30")
      Button.success(disabled icon="Suspended") {{$lang('申诉中')|toUP}}
      Button(text type="primary" style="margin-left:20px;" @click="appealshow") {{$lang('上传证明')|toUP}}
    .action(v-else-if="data.status === 40")
      p.Subtitle1 {{$lang('订单已经取消')|toUP}}
    .action(v-else-if="data.status === 50")
      a.Subtitle1(:href="link") {{$lang("完成购买，请查看资产")}}
  
  // 卖方, 状态管理
  div(v-else)
    strong.Body2.color-error-main(v-if="data.status==20||data.status==30") {{tip2}}
    .action(v-if="data.status === 10")
      p.Subtitle1
        CountDown.color-secondary-dark(v-model="transferLastSeconds", :template='$lang("买方将在%m%:%s%内付款")')
      Button.success(disabled) {{$lang('等待付款')|toUP}}
    .action(v-else-if="data.status === 20")
      p.Subtitle1 
        | {{$lang('买方已向您付款，请确认后放币')}}
      Button.success.button-space(type="primary"  @click="releaseModal = true") {{$lang('确认放币')|toUP}}
      // 申诉按钮有时间限制，状态变化时间过去5分钟后，才可进行申诉
      Button(v-if="~~appealLastSeconds" disabled text) 
        CountDown(v-model="appealLastSeconds")
        | {{$lang('后可提交申诉')|toUP}}
      Button(@click="complaintModal = true" text v-else) {{$lang('提交申诉')|toUP}}
    .action(v-else-if="data.status === 30")
      Button.success(type="primary"  @click="releaseModal = true") {{$lang('确认放币')|toUP}}
      Button(text type="primary" style="margin-left:20px;" @click="appealshow") {{$lang('上传证明')|toUP}}
    .action(v-else-if="data.status === 40")
      p.Subtitle1 {{$lang('订单已经取消')}}
    .action(v-else-if="data.status === 50")
      p.Subtitle1 {{$lang("已完成")}}

  .desc.Caption.color-grey-500
    template(v-if="data.side==0")
      p 1. {{$lang('为防止出现付款拦截、银行卡被冻结等问题，造成付款延迟或失败，请勿在在付款过程中备注类型BTC、USDT、ETH等信息。')}}
      p 2. {{$lang('请勿使用您实名认证以外的银行卡/支付宝等进行付款，否则卖家可拒绝成交并提交投诉。')}}
      p 3. {{$lang('为了避免您产生资产损失，请付款成功后，点击我已完成付款，否则有效时间到期后订单自动取消。')}}
      p 4. {{$lang("为了保障资金安全，部分帐户OTC买入额度锁定24小时，24小时内不支持提币等额资金。")}}
    template(v-else)
      p 1. {{$lang('买家确定付款后，请及时查收款项，确认收到款项后再放行数字资产，避免造成资产损失。')}}
      p 2. {{$lang('买方有效期内取消订单，系统自动取消本次交易。')}}
      p 3. {{$lang('买方下单后一直未付款，有效期过后，订单将自动进入人工客服审核。')}}
   
   

  // 弹窗 支付
  ConfirmPay(v-model="payModal", :data="data")
  // 弹窗 放币
  ConfirmRelease(v-model="releaseModal", :data="data")
  // 弹窗 申诉
  ConfirmComplaint(v-model='complaintModal', :data="data")
  // 弹窗 撤单
  Dialog(v-model="tipModal",  @on-ok="cancel", :loading="true")
    .Body2 {{$lang('是否要取消订单？')}}
</template>
<script>
import CountDown from "./count_down.vue";
import ConfirmPay from "./confirm_pay.vue";
import ConfirmRelease from "./confirm_release.vue";
import ConfirmComplaint from "./confirm_complaint.vue";
import { mapState, mapActions } from "vuex";
import ClipboardJS from "clipboard";
import Helper from "@/libs/helper";
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    init: {
      type: Boolean,
      default: false
    },
    transferLastSeconds: {
      type: [String, Number],
      default: 0
    },
    appealLastSeconds: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      tipModal: false,
      payModal: false,
      releaseModal: false,
      complaintModal: false,
      link: Helper.formatUrl("/finance/"),
      ClipboardJS: null
    };
  },
  computed: {
    ...mapState(["common"]),
    tip() {
      return this.$lang(
        this.common.userInfo.whiteFlag
          ? "otc.order.detail.businessPaymentTip"
          : "otc.order.detail.userPaymentTip"
      )
        .replace(/{\$sellerRealName}/g, this.data.sellerRealName)
        .replace(/{\$buyerRealName}/g, this.data.buyerRealName);
    },
    tip2() {
      return this.$lang(
        "请务必确认 %buyerRealName% 已向您付款，谨防诈骗。"
      ).replace(/%buyerRealName%/g, this.data.buyerRealName);
    }
  },
  methods: {
    ...mapActions(["appealshow"]),
    countdown() {
      this.data.status = 40;
    },
    cancel() {
      this.$axios
        .post("/api/otc/order/cancel", { orderId: this.data.id })
        .then(() => {
          location.reload();
        });
    }
  },
  components: {
    CountDown,
    ConfirmPay,
    ConfirmRelease,
    ConfirmComplaint
  },
  created() {
    this.ClipboardJS = new ClipboardJS(".copy");
    this.ClipboardJS.on("success", e => {
      this.$tips.success([e.action, e.text].join(":"));
    });
  },
  beforeDestroy() {
    this.ClipboardJS.destroy();
  }
};
</script>