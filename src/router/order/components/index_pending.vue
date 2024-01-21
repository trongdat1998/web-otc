<style lang="less" scoped>
.qrcode {
  max-width: 300px;
  max-height: 300px;
}
.wrapper {
  padding-bottom: 32px;
}
.item {
  padding: 8px 0;
  margin-bottom: 16px;
  display: flex;
}
.w {
  width: 44%;
  &:nth-child(30n + 2) {
    padding-left: 16px;
    width: 30%;
  }
  &:nth-child(30n + 1) {
    padding-left: 16px;
    width: 5%;
  }
  &:nth-child(30n + 4) {
    width: 21%;
    text-align: right;
    padding-right: 24px;
  }
  .icon{
    width: 20px;
    vertical-align: middle;
  }
}
.text {
  display: flex;
  padding: 2px 0;
  dt {
    width: 33.33%;
  }
  dd {
    width: 66.66%;
  }
}
.title {
  height: 32px;
  padding-bottom: 8px;
  a {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  img{
    margin:-3px 0 0 6px;
  }
}
.select {
  display: flex;
  align-items: center;
  .Subtitle1 {
    padding-right: 10px;
  }
}
.time {
  padding-top: 16px;
  padding-bottom: 8px;
  line-height: 24px;
}
.payment {
  height: 25px;
  &Item {
    display: inline-block;
    padding: 0 5px;
  }
}
</style>
<template lang="pug">
.wrapper
  ConfirmPay(v-model="payModal", :data="data")
  ConfirmRelease(v-model="releaseModal", :data="data")
  .Shadow1.bg-grey-50.item(v-for="item in list")
    .w
      Icon(type="alarm")
    .w
      .Subtitle1.title
        span(:class="item.side==0?'color-success-main':'color-error-main'") {{$lang(item.side==0?"购买":"出售")}}
        |  {{item.quantity}} {{item.tokenName}} 
      dl.text.Body2
        dt.color-grey-500  {{$lang(item.side==0?"卖方":"买方")}}:
        dd {{item.targetNickName}} ({{item.recentOrderNum}}/{{item.recentExecuteRate}}%)
      dl.text.Body2
        dt.color-grey-500 {{$lang('单价')}}:
        dd {{item.price}} {{item.currencyId}} / {{item.tokenName}}
      dl.text.Body2
        dt.color-grey-500 {{$lang('总价')}}:
        dd {{item.amount}} {{item.currencyId}}
    .w
      .select.title
        .Subtitle1 {{$lang('支付方式')}}
          template(v-if="item.status!==10") - {{common.paymentTypes[item.paymentType].paymentName}}
            img.icon(:src="common.paymentTypes[item.paymentType].icon")

      RadioGroup(v-model="item.paymentId" vertical @on-change="changPayment(item)" v-if="item.status==10")
        Radio.payment(:label="_item.id" v-for="_item in item.paymentTermList" , :key="_item.id")
          img.icon(:src="common.paymentTypes[_item.paymentType].icon")
          span.color-grey-500.paymentItem {{common.paymentTypes[_item.paymentType].paymentName}}
          template(v-for="__item,__key in _item" v-if="common.paymentTypes[_item.paymentType].views[__key]")
            Poptip(trigger="hover" v-if="_item[common.paymentTypes[_item.paymentType].isPic] && common.paymentTypes[_item.paymentType].items[__key].type=='image'")
              img.qrcode(:src="__item" slot="content")
              Icon(type="code1" size="20")
            span.paymentItem(v-else) {{__item}}
      template(v-else)
        dl.text.Body2(v-for="_item,_key in item.paymentTermResult" v-if="common.paymentTypes[item.paymentType].views[_key]")
          dt.color-grey-500 {{common.paymentTypes[item.paymentType].items[_key].label}}:
          dd
            Poptip(trigger="hover" v-if="common.paymentTypes[item.paymentType].isPic && common.paymentTypes[item.paymentType].items[_key].type=='image'")
              img.qrcode(:src="_item" slot="content")
              Icon(type="code1" size="20")
            template(v-else-if="_key==='bankName'") {{common.bankMap[_item]||_item}} 
            template(v-else) {{_item}} 
    .w
      .title
        router-link.color-common-text(:to="{name:'orderDetail',params:{orderId:item.id}}")
          span.Body1 {{$lang('进入详情')}}
          Icon(type="unfoldPage")
      template(v-if="item.side==0")
        template(v-if="item.status==10")
          p.time
            CountDown(v-model="item.transferLastSeconds", :template='$lang("请在%m%:%s%内付款")')
          Button(type="primary" @click="pay(item)") {{$lang('我已完成付款')|toUP}}
        template(v-if="item.status==20")
          p.time {{$lang('请等待卖方放币')}}
          Button(disabled) {{$lang('等待放币')|toUP}}
      template(v-else)
        template(v-if="item.status==10")
          p.time
            CountDown(v-model="item.transferLastSeconds", :template='$lang("买方将在%m%:%s%内付款")')
          Button(disabled) {{$lang('等待付款')|toUP}}
        template(v-if="item.status==20")
          p.time {{$lang('买方已向您付款，请确认后放币')|toUP}}
          Button(type="primary" v-if="item.status==20" @click="release(item)") {{$lang('确认放币')|toUP}}
      template(v-if="item.status==30")
        p.time
          i.broker-space
        Button(type="secondary" text icon="Suspended") {{$lang('申诉中')|toUP}}
</template>
<script>
let fn = null;
import ConfirmPay from "./confirm_pay.vue";
import ConfirmRelease from "./confirm_release.vue";
import CountDown from "./count_down.vue";
import { mapState } from "vuex";
export default {
  components: { ConfirmPay, ConfirmRelease, CountDown },
  data() {
    return {
      payModal: false,
      releaseModal: false,
      data: {},
      list: [],
      payments: {}
    };
  },
  methods: {
    changPayment(item) {
      this.payments[item.id] = item.paymentId;
    },
    pay(item) {
      this.payModal = true;
      this.data = item;
    },
    release(item) {
      this.releaseModal = true;
      this.data = item;
    },
    load() {
      clearTimeout(fn);
      this.$axios
        .post("/api/otc/order/pending/list", this.formData)
        .then(result => {
          if (result.code == 0) {
            this.list = result.data.map(el => {
              if (el.status == 10) {
                el.paymentId = el.paymentTermList[0].id;
                if (typeof this.payments[el.id] !== "undefined") {
                  el.paymentId = this.payments[el.id];
                }
              }
              return el;
            });
          }
        });
      fn = setTimeout(this.load, this.common.time.slow);
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