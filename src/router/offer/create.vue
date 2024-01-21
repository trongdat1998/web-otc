<style lang="less" scoped>
.pic {
  border-radius: 4px;
}
.choose {
  height: 72px;
  display: flex;
  padding: 23px 24px 0;
  justify-content: space-between;
  align-items: flex-start;
  .select {
    display: flex;
    align-items: center;
    height: 32px;
    .space {
      padding: 0 16px;
    }
  }
  .price {
    text-align: right;
    span {
      display: block;
    }
  }
}
.create {
  padding: 15px 30px;
  .follow {
    margin: 0 0 8px;
    .followcheck {
      height: 32px;
      .ivu-checkbox {
        margin: 0 10px 0 0;
      }
    }
  }
  .form {
    .submit {
      text-align: right;
    }
  }
}
</style>
<template lang="pug">
.pic.Shadow1
  .choose
    div.select
      Dropmenu(v-model="offer.formData.side" @on-visible-change="lastPrice")
        DropmenuItem(:value="0") {{$lang("我想购买")}}
        DropmenuItem(:value="1") {{$lang("我想出售")}}
      .space.Caption.color-grey-500 / 
      Dropmenu(v-model="offer.formData.tokenId" @change="lastPrice")
        DropmenuItem(v-for="item in common.token", :value="item.tokenId", :key="item.tokenId") {{item.tokenName}}
    .price.Caption {{$lang('可用')}} {{common.tokenMap[offer.formData.tokenId]}}
      span {{free}}
      span {{$lang("手续费率比例")}}: {{feeRate*100}}%
  .create
    .follow
      .followcheck
        Checkbox(v-model="offer.formData.priceType", :true-value="1", :false-value="0") {{$lang('浮动价格')}} 
          template(v-if="offer.formData.priceType&&offer.formData.premium") ≈ {{(trade.lastPrice*offer.formData.premium/100).cutFixed(common.config.currency[common.userInfo.currency].scale)}}{{common.userInfo.currency}}
          template （{{$lang("最新成交价")}}：{{trade.lastPrice}}{{common.userInfo.currency}} ）
      Row(:gutter="32")
        Col(span="6" v-if="offer.formData.priceType==1")
          Input(:help="formRule.premium.error||formRule.premium.default", :label="$lang('溢价比例')" @keyup="checkForm('premium')" v-model="offer.formData.premium", :error="!!formRule.premium.error" maxlength="6")
            strong.color-grey-500(slot="after") %
        Col(span="6" v-else)
          Input(:help="formRule.price.error||formRule.price.default", :label="$lang('固定单价')" v-model="offer.formData.price" @keyup="checkForm('price')", :error="!!formRule.price.error" maxlength="16")
            strong.color-grey-500(slot="after") {{common.userInfo.currency}}
        Col(span="6")
          Input(:help="formRule.quantity.error||formRule.quantity.default", :label="$lang('数量')" v-model="offer.formData.quantity" @keyup="checkForm('quantity')", :error="!!formRule.quantity.error" maxlength="16")
            strong.color-grey-500(slot="after") {{common.tokenMap[offer.formData.tokenId]}}
        Col(span="6")
          Input(:help="formRule.minAmount.error||formRule.minAmount.default", :label="$lang('限额')" v-model="offer.formData.minAmount" @keyup="checkForm('minAmount')", :error="!!formRule.minAmount.error" maxlength="16")
            strong.color-grey-500(slot="after") {{common.userInfo.currency}}
            strong(slot="before") {{$lang('最低额')}}
        Col(span="6")
          Input(:help="formRule.maxAmount.error||formRule.maxAmount.default", v-model="offer.formData.maxAmount" @keyup="checkForm('maxAmount')", :error="!!formRule.maxAmount.error" maxlength="16" labelSpace)
            strong.color-grey-500(slot="after") {{common.userInfo.currency}}
            strong(slot="before") {{$lang('最高额')}}
      form
        Row(:gutter="32" style="margin-top:10px")
          template(v-if="common.userInfo.tradeFlag")
            Col(span="12")
              Input(:placeholder="$lang('交易备注（选填）')" v-model="offer.formData.remark"  maxlength="80")
          template(v-else)
            Col(span="6" key="1")
              Input(:placeholder="$lang('交易备注（选填）')" v-model="offer.formData.remark" maxlength="80")
            Col(span="6" key="2")
              Input(:placeholder="$lang('资金密码')" v-model="offer.formData.tradePwd" visible type="password" maxlength="20")
          Col(span="6" key="3")
            Input(readonly :value="fee")
              strong(slot="before") {{$lang('手续费')}}
              strong.color-grey-500(slot="after") {{common.tokenMap[offer.formData.tokenId]}}
          Col(span="6" key="4")
            Button(type="primary", :loading="loading" long @click="!loading &&submit()") {{$lang('发布广告')|toUP}}（{{$lang(offer.formData.side?"出售":"购买")|toUP}}）
  Dialog(v-model="paymentModal", ok-text="去设置", cancel-text="暂不需要", :desc="$lang('请完善个人信息后再进行法币操作')" @on-ok="$router.push({name:'settings'})")
  Dialog(v-model="bindMobileModal", ok-text="去绑定", cancel-text="暂不需要", :desc="$lang('请完善绑定手机后继续操作')" @on-ok="setMobile")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Helper from '@/libs/helper'
import md5 from 'md5'
let fn = null
export default {
  data() {
    return {
      paymentModal: false,
      bindMobileModal: false,
      depthPrice: '',
      loading: false,
      formRule: {
        premium: {
          error: '',
          default: this.$lang('该条广告依据于市场最新价格指数'),
          prop: this.$lang('请在%min%%-%max%%之间设置溢价'),
          required: false,
        },
        price: {
          error: '',
          default: this.$lang('设置广告单价'),
          prop: this.$lang('请在%min%-%max%之间设置单价'),
          required: true,
        },
        minAmount: {
          error: '',
          default: this.$lang('最小单笔限额'),
          prop: this.$lang('请在%min%-%max%之间设置限额'),
          required: true,
        },
        maxAmount: {
          error: '',
          default: this.$lang('最大单笔限额'),
          prop: this.$lang('请在%min%-%max%之间设置限额'),
          required: true,
        },
        quantity: {
          error: '',
          default: this.$lang('设置可交易的数量'),
          prop: this.$lang('请在%min%-%max%之间设置限额'),
          required: true,
        },
      },
    }
  },
  computed: {
    ...mapState(['trade', 'common', 'offer']),
    free() {
      let str = 0
      this.trade.asset.forEach((el) => {
        if (el.tokenId == this.offer.formData.tokenId) {
          str = el.free
        }
      })
      return str.cutFixed(8)
    },
    feeRate() {
      let str = 0
      if (this.common.tradeFeeRate[this.offer.formData.tokenId]) {
        if (this.offer.formData.side) {
          str = this.common.tradeFeeRate[this.offer.formData.tokenId]
            .makerSellTradeFee
        } else {
          str = this.common.tradeFeeRate[this.offer.formData.tokenId]
            .makerBuyTradeFee
        }
      }
      return str
    },
    fee() {
      let str = 0
      if (this.offer.formData.quantity) {
        str = this.feeRate * this.offer.formData.quantity
      }
      return str.cutFixed(8)
    },
  },
  methods: {
    ...mapActions([
      'getPaymentList',
      'getAssetList',
      'setUserInfo',
      'getLastPrice',
    ]),
    setMobile() {
      location.href = Helper.formatUrl('/user/bind/mobile')
    },
    submit() {
      let isOk = true
      this.formRule.premium.required = !!this.offer.formData.priceType
      this.formRule.price.required = !this.offer.formData.priceType
      if (!this.trade.hasPayment) {
        return (this.paymentModal = true)
      }
      // if (!this.common.baseInfo.mobile) {
      //   return (this.bindMobileModal = true);
      // }
      if (
        Number(this.offer.formData.maxAmount) <
        Number(this.offer.formData.minAmount)
      ) {
        return (this.formRule.maxAmount.error = this.$lang(
          '最大单笔限额不能低于最小单笔限额'
        ))
      }

      if (!this.common.userInfo.tradeFlag && !this.offer.formData.tradePwd) {
        isOk = false
        this.$tips.error(this.$lang('请输入资金密码'))
      }

      Object.keys(this.formRule).forEach((el) => {
        if (this.formRule[el].required) {
          if (!this.beforSubmit(el)) {
            isOk = false
          }
        }
      })

      if (isOk) {
        this.loading = true
        let formData = Object.assign({}, this.offer.formData)
        formData.tradePwd = md5(this.offer.formData.tradePwd)
        formData.currencyId = this.common.userInfo.currency

        this.$axios.post('/api/otc/item/create', formData).then((result) => {
          this.loading = false
          if (result.code == 0 && result.data.success) {
            location.reload()
          }
        })
      }
    },
    checkForm(type) {
      this.formRule[type].error = ''
      if (type == 'premium') {
        this.offer.formData[type] = Helper.formatNumber(
          this.offer.formData[type],
          2
        )
      } else if (type == 'quantity') {
        this.offer.formData[type] = Helper.formatNumber(
          this.offer.formData[type],
          this.common.config.token[this.offer.formData.tokenId].scale
        )
      } else if (type == 'price') {
        this.offer.formData[type] = Helper.formatNumber(
          this.offer.formData[type],
          this.common.config.currency[this.common.userInfo.currency].scale
        )
      } else {
        this.offer.formData[type] = Helper.formatNumber(
          this.offer.formData[type],
          0
        )
      }
    },
    beforSubmit(type) {
      let token = this.common.config.token[this.offer.formData.tokenId]
      let currency = this.common.config.currency[this.offer.formData.currencyId]

      let config = {
        minQuote: 0,
        maxQuote: 0,
      }

      if (type === 'quantity') {
        config.minQuote = token.minQuote
        config.maxQuote = token.maxQuote
      } else if (type === 'premium') {
        config.minQuote = token.downRange
        config.maxQuote = token.upRange
      } else if (type === 'price') {
        config = {
          maxQuote: currency.maxQuote, //(this.trade.lastPrice * 2).cutFixed(2),
          minQuote:
            1 /
              Math.pow(
                10,
                this.common.config.currency[this.common.userInfo.currency].scale
              ) || 0,
        }
      } else {
        config.minQuote = currency.minQuote
        config.maxQuote = currency.maxQuote
      }

      if (
        type === 'quantity' &&
        this.offer.formData.side == 1 &&
        Number(this.offer.formData[type]) > Number(this.free)
      ) {
        this.formRule[type].error = this.$lang('余额不足，请重新调整交易数量')
        return false
      }

      if (
        Number(this.offer.formData[type]) > Number(config.maxQuote) ||
        Number(this.offer.formData[type]) < Number(config.minQuote)
      ) {
        this.formRule[type].error = this.formRule[type].prop
          .replace('%max%', Number(config.maxQuote))
          .replace('%min%', Number(config.minQuote))
        return false
      }
      return true
    },
    lastPrice() {
      clearTimeout(fn)
      this.getLastPrice({
        side: this.offer.formData.side,
        tokenId: this.offer.formData.tokenId,
        currencyId:
          this.common.userInfo.currency || window.WEB_CONFIG.defaultCurrencyId,
      })
      fn = setTimeout(this.lastPrice, this.common.time.fast)
    },
  },
  beforeDestroy() {
    clearTimeout(fn)
  },
  created() {
    if (this.common.isLogin) {
      this.lastPrice()
      this.getPaymentList()
      this.getAssetList()
      this.setUserInfo()
    } else {
      Helper.goLogin()
    }
  },
}
</script>
