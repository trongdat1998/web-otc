<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  margin: 0 0 15px;
  align-items: center;
  .type {
    span {
      display: inline-block;
      margin: 0 40px 0 0;
    }
  }
  .select > div {
    margin: 0 0 0 20px;
  }
}
.table {
  width: 100%;
  .theader,
  .item {
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
  .theader {
    padding-top: 20px;
    i {
      font-size: 16px;
      cursor: pointer;
    }
  }
  .page {
    margin: 30px 0 0;
    min-height: 45px;
    text-align: right;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .edit {
    display: flex;
    justify-content: flex-end;
  }
  .icon {
    width: 80px;
    padding: 0 0 0 8px;
    height: 64px;
    display: flex;
    position: absolute;
    z-index: 3;
    left: 0;
    top: -4px;
  }
  .name {
    display: flex;
    span {
      max-width: 140px;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  td {
    width:14.5%;
    &:nth-child(30n + 1) {
      width:13.5%;
    }
    &:nth-child(30n + 2) {
      width:5.5%;
    }
    &:nth-child(30n + 6) {
      width:13.5%;
    }
    &:nth-child(30n + 8) {
      width:9.5%;
      text-align: right;
    }
  }
}
.list {
  padding-bottom: 40px;
}
</style>
<template lang="pug">
.list
  .title
    .type
      span.Subtitle1.color-common-text {{$lang("历史订单")}}
    .select
      Dropmenu(v-model="formData.side" @change="change")
        DropmenuItem(value="") {{$lang("全部交易类型")}}
        DropmenuItem(value="0") {{$lang("购买")}}
        DropmenuItem(value="1") {{$lang("出售")}}
  table.table
    tr.theader.border-grey-100.Caption.color-grey-500
      td {{$lang("订单号")}}
      td {{$lang("类型")}}
      td {{$lang("数量")}}
      td {{$lang("单价")}}
      td {{$lang("总价")}}
      td {{$lang("交易对象")}}
      td {{$lang("时间")}}
      td {{$lang("状态")}}
    .tbody(v-if="list.length")
      tr.item.border-grey-100(v-for="item in list" :key="item.id")
        td
          router-link(:to="{name:'orderDetail',params:{orderId:item.id}}")
            span.Body2.color-primary-main {{item.id}}
            Icon.color-common-text(type="unfoldPage" size="16")
        td.Body2(:class="item.side==0?'color-success-main':'color-error-main'") {{$lang(item.side==0?"购买":"出售")}}
        td.Body2 {{item.quantity}} {{item.tokenName}}
        td.Body2 {{item.price}} {{item.currencyId}} / {{item.tokenName}}
        td.Body2 {{item.amount}} {{item.currencyId}}
        td.Body2 {{item.targetNickName}}
        td.Body2 {{new Date(item.createDate*1).format()}}
        //（10待支付，20已支付待确认，30申诉中，40撤销，50完全成交）
        td.Body2.color-grey-500(v-if="item.status==40")
          span {{$lang("已取消")}}
          Icon(type="cancelled1" size="16")
        td.Body2.color-success-main(v-else)
          span {{$lang("已完成")}}
          Icon(type="finished1" size="16")
    NoData(v-else-if="init")
    .page
      div
      Page(v-if="total>formData.size" :total="total", :pageSize="formData.size" v-model="formData.page" type="mini" @change="load")
</template>
<script>
let fn = null;
import { mapState } from "vuex";
export default {
  data() {
    return {
      list: [],
      total: 0,
      init: false,
      formData: {
        page: 1,
        size: 20,
        side: ""
      }
    };
  },
  methods: {
    change() {
      this.formData.page = 1;
      this.load();
    },
    load(status) {
      clearTimeout(fn);
      // 自动刷新时不清空列表
      if (status) {
        this.list = [];
      }
      this.total = this.formData.size * this.formData.page;
      this.$axios.post("/api/otc/order/list", this.formData).then(result => {
        if (result.code == 0) {
          if (result.data.items.length >= this.formData.size && result.data.hasNext) {
            this.total = this.formData.size * (this.formData.page + 1);
          }
          this.list = result.data.items;
        }
        this.init = true;
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