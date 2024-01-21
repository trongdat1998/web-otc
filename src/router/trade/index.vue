<style lang="less" scoped>
@import './index';
</style>
<style lang="less">
.orderModal {
  .ivu-modal-content {
    border-radius: 0;
  }
  .ivu-modal-footer {
    display: none;
  }
}
</style>
<template lang="pug">
div
  Nav
  .select
    .type
      ButtonGroup
        Button(:type="trade.data.side==1?'primary':'default'", @click="getTradeList({side:'1'})") {{$lang('我要购买')|toUP}}
        Button(:type="trade.data.side==0?'primary':'default'", @click="getTradeList({side:'0'})") {{$lang('我要出售')|toUP}}
      i.broker-space
      | {{common.config.token[trade.data.tokenId].tokenName}} {{$lang('指数')}}： 
      strong.color-success-main {{trade.lastPrice}} {{trade.data.currencyId}}
    .price
      Dropmenu(v-model="trade.data.currencyId" @change="changeCurrency" style="margin-right:25px;" v-if="Object.keys(common.currency).length>1")
        DropmenuItem(v-for="item in common.currency", :value="item.currencyId", :key="item.currencyId") {{item.name}}
      Dropmenu(v-model="trade.data.payment" @change="changePayments") 
        DropmenuItem(value="") {{$lang("全部支付方式")}}
        DropmenuItem(v-for="item in common.payments", :value="item.paymentType", :key="item.paymentType")
          img.icon(:src="item.icon")
          | {{item.paymentName}}
  .tips.bg-grey-50.color-grey-500(v-if="tips[trade.data.tokenId]&&common.isShare") {{$lang("为了保障资金安全，部分帐户OTC买入额度锁定24小时，24小时内不支持提币等额资金。")}}
  .list
    .table
      .loading(v-show="trade.loading")
        Icon.ivu-load-loop.color-grey-500(type="loading")
      .theader.border-grey-100.Caption.color-grey-500
        .w {{$lang("昵称")}}（{{$lang("30日成单")}} | {{$lang("30日完成率")}})
        .w {{$lang("支付方式")}}
        .w {{$lang("剩余数量")}}
        .w {{$lang("限额")}}
        .w {{$lang("单价")}}
        .w {{$lang("操作")}}
      .tbody(v-if="trade.items.length")
        .item.border-grey-100(v-for="(item,index) in trade.items")
          .w.Body2
            .icon.bg-common-background
              Avatar(:color="item.accountId") {{item.nickName[0].toUpperCase()}}
            .name
              span.Button {{item.nickName}}
              p ({{item.recentOrderNum}} / {{item.recentExecuteRate}}%)
          .w.Body2
            Tooltip(:content="common.paymentTypes[_item].paymentName" placement="top" v-for="_item,_index in item.payments" :key="index+''+_index")
              img(:src="common.paymentTypes[_item].icon")
          .w.Body2 {{item.lastQuantity}} {{item.tokenName}}
          .w.Body2 {{item.minAmount}} - {{item.maxAmount}} {{item.currencyId}}
          .w.Subtitle1.color-secondary-dark {{item.price}} {{item.currencyId}}
          .w.edit
            Button(type="primary" @click="action(index)", :loading="index===currentIndex") {{$lang(item.side==0?"出售":"购买")|toUP}} {{item.tokenName}}
      NoData(v-else-if="trade.itemsInit")
      .page
        div
        .action(v-if="trade.count>trade.data.size")
          Page(:total="trade.count" @change="changePage" v-model="trade.data.page")
  CreateOrder(v-model='orderModal', :data="data", :free="free")
  Dialog(v-model="paymentModal", ok-text="去设置", cancel-text="暂不需要", :desc="$lang('请完善个人信息后再进行法币操作')" @on-ok="$router.push({name:'settings'})")
  
  footerTip(v-if="!trade.hasPayment&&trade.init")

  Dialog(v-model="bindMobileModal", ok-text="去绑定", cancel-text="暂不需要", :desc="$lang('请完善绑定手机后继续操作')" @on-ok="setMobile")
</template>
<script>
let fn = null;
import CreateOrder from './create_order.vue';
import footerTip from './index_hidden.vue';
import { mapState, mapActions } from 'vuex';
import Helper from '@/libs/helper';
export default {
  data() {
    return {
      data: {},
      orderModal: false,
      paymentModal: false,
      bindMobileModal: false,
      currentIndex: '',
      item_id: '',
      tips: {
        ETH: true,
        BTC: true,
        USDT: true
      }
    };
  },
  computed: {
    ...mapState(['trade', 'common']),
    free() {
      let str = 0;
      this.trade.asset.forEach(el => {
        if (el.tokenId == this.trade.data.tokenId) {
          str = el.free;
        }
      });
      return str.cutFixed(8);
    }
  },

  methods: {
    ...mapActions(['getTradeList', 'getPaymentList', 'getAssetList']),
    changeCurrency() {
      this.getList({ currencyId: this.trade.data.currencyId, page: 1 });
    },
    changePayments() {
      this.getList({ payment: this.trade.data.payment, page: 1 });
    },
    changePage(val) {
      window.scrollTo(0, 0);
      this.getList({ page: val });
    },
    action(index, amount) {
      if (!this.common.isLogin) {
        Helper.goLogin();
      }
      // 取消绑定手机的要求
      // else if (!this.common.baseInfo.mobile) {
      //   this.bindMobileModal = true;
      // }
      else if (this.trade.hasPayment) {
        this.getInfo(index, amount);
      } else {
        this.paymentModal = true;
      }
    },
    getList(json) {
      clearTimeout(fn);
      this.getTradeList(Object.assign({ hideloading: true }, json));
      fn = setTimeout(this.getList, this.common.time.slow);
    },
    getInfo(index, amount) {
      let _item = Object.assign({}, this.trade.items[index]);
      this.currentIndex = index;
      this.item_id = _item.id;
      this.$axios
        .post('/api/otc/item/info/simple', {
          item_id: this.item_id
        })
        .then(result => {
          if (result.code == 0 && result.data.id == this.item_id) {
            this.orderModal = true;
            if (amount) {
              result.data.userDefaultAmount = amount;
            }
            this.data = Object.assign(_item, result.data);
          }
          this.currentIndex = '';
        });
    },
    setMobile() {
      location.href = Helper.formatUrl('/user/bind/mobile');
    }
  },

  created() {
    let amount = ~~this.$route.query.amount;
    let side = this.$route.query.side;
    let json = {
      page: 1,
      tokenId: this.$route.params.tokenId || this.common.token[0].tokenId
    };

    if (side) {
      json.side = side;
    }

    this.getList(json);

    if (this.common.isLogin) {
      this.getPaymentList();
      this.getAssetList();
    }
    if (amount && side == 1) {
      let hasOne = false;
      this.$axios.post('/api/otc/item/list', this.trade.data).then(result => {
        if (result.code == 0) {
          result.data.items.forEach((el, index) => {
            if (el.maxAmount > amount && el.minAmount < amount && !hasOne) {
              hasOne = true;
              this.action(index, `${amount}`);
            }
          });
          if (!hasOne) {
            this.$tips.info('未匹配的到相关广告');
          }
        }
      });
    }
  },
  beforeDestroy() {
    clearTimeout(fn);
  },
  components: {
    CreateOrder,
    footerTip
  }
};
</script>
