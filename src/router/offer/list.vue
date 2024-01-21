<style lang="less" scoped>
.list {
  padding-bottom: 40px;
  margin: 32px 0 0;
  .edit {
      display: flex;
      justify-content: flex-end;
    }
  .title {
    display: flex;
    justify-content: space-between;
    margin: 0 0 15px;
    align-items: center;
    .type {
      span {
        display: inline-block;
        margin: 0 40px 0 0;
        cursor: pointer;
      }
    }
    .select > div {
      margin: 0 0 0 20px;
    }
  }
}
</style>
<template lang="pug">
.list
  .title
    .type
      span(:class="formData.status==0?'Subtitle1 color-primary-main' : 'Body1 color-common-text'" @click="change(0)") {{$lang('进行中广告')}}
      span(:class="formData.status==1?'Subtitle1 color-primary-main' : 'Body1 color-common-text'" @click="change(1)") {{$lang('历史广告')}}
    .select
      Dropmenu(v-model="formData.tokenId" @change="load")
        DropmenuItem(value="") {{$lang('所有币种')}}
        DropmenuItem(v-for="item in common.token", :value="item.tokenId", :key="item.tokenId") {{item.tokenName}}
      Dropmenu(v-model="formData.side" @change="load")
        DropmenuItem(value="") {{$lang('所有类型')}}
        DropmenuItem(value="0") {{$lang('购买')}}
        DropmenuItem(value="1") {{$lang('出售')}}
  Table(:columns="columns" :data="list" :loading="loading")
    template(slot-scope="{ row, index }" slot="time") {{new Date(row.createDate*1).format()}}
    template(slot-scope="{ row, index }" slot="type") 
      span(:class="row.side?'color-error-main':'color-success-main'") {{$lang(row.side?"出售":"购买")}} 
      | {{row.tokenName}}
    template(slot-scope="{ row, index }" slot="amount")
      span.color-secondary-dark {{row.lastQuantity}} / 
      | {{row.quantity}}
    template(slot-scope="{ row, index }" slot="fee") {{row.fee}}{{row.tokenName}}
    template(slot-scope="{ row, index }" slot="limit") {{row.minAmount}} - {{row.maxAmount}}{{row.currencyId}}
    template(slot-scope="{ row, index }" slot="price")  {{row.priceType ?row.premium + '%':row.price + row.currencyId}}
    template(slot-scope="{ row, index }" slot="order")
      span.color-secondary-dark {{row.finishNum}} / 
      | {{row.orderNum}}
    template(slot-scope="{ row, index }" slot="state")
      .edit(v-if="formData.status==0")
        Button(type="primary" loading v-if="index===currentIndex" disabled) {{$lang("下架")|toUP}}
        template( v-else)
          Button(type="primary" text @click="edit(index)") {{$lang("修改")|toUP}}
          Button(type="primary" text @click="next(index)") {{$lang("下架")|toUP}}
      .edit(v-else)
        .color-grey-500(v-if="row.status==20")
          span {{$lang("已下架")}}
          Icon(type="cancelled1" size="16")
        .color-success-main(v-else)
          span {{$lang("已完成")}}
          Icon(type="finished1" size="16")
  Dialog(v-model="dialog" @on-ok="offline"  @on-cancel="cancel")
    .Body2 {{$lang('是否确定下架广告')}}?
  Dialog(v-model="editDialog" @on-ok="goEdit"  @on-cancel="cancel")
    .Body2 {{$lang('是否确定下架并修改当前改广告？')}}
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      total: 0,
      init: false,
      loading:true,
      formData: {
        tokenId: "",
        side: "",
        status: 0,
        page: 1,
        size: 10
      },
      list: [],
      columns: [
        {
          title: this.$lang("时间"),
          slot: "time",
          minWidth: 150
        },
        {
          title: this.$lang("类型"),
          slot: "type",
          minWidth: 120
        },
        {
          title: this.$lang("数量"),
          slot: "amount",
          minWidth: 160
        },
        {
          title: this.$lang("手续费"),
          slot: "fee",
          minWidth: 120
        },
        {
          title: this.$lang("限额"),
          slot: "limit",
          minWidth: 175
        },
        {
          title: this.$lang("单价"),
          slot: "price",
          minWidth: 110
        },
        {
          title: this.$lang("订单"),
          slot: "order",
          minWidth: 100
        },
        {
          slot: "state",
          align: "right",
          minWidth: 150,
          fixed: "right",
          renderHeader: h =>
            h("span", this.$lang(this.formData.status == 0 ? "操作" : "状态"))
        }
      ],
      dialog: false,
      editDialog: false,
      currentIndex: null
    };
  },
  methods: {
    ...mapActions(["getAssetList", "editOffer", "getLastPrice"]),
    change(status) {
      this.formData.status = status;
      this.load();
    },
    load() {
      this.list = [];
      this.loading = true;
      this.$axios
        .post("/api/otc/item/personal_list", this.formData)
        .then(result => {
          if (result.code == 0) {
            if (
              result.data.items.length >= this.formData.size &&
              result.data.hasNext
            ) {
              this.total = this.formData.size * (this.formData.page + 1);
            }
            this.list = result.data.items;
          }
          this.init = true;
          this.loading = false;
        });
    },
    next(index) {
      if (this.currentIndex === null) {
        this.currentIndex = index;
        this.dialog = true;
      }
    },
    edit(index) {
      if (this.currentIndex === null) {
        this.currentIndex = index;
        this.editDialog = true;
      }
    },
    offline() {
      this.$axios
        .post("/api/otc/item/cancel", {
          itemId: this.list[this.currentIndex].id
        })
        .then(result => {
          if (result.code === 0) {
            this.$tips.success(
              this.$lang("已下架") + this.list[this.currentIndex].tokenName
            );
            this.currentIndex = null;
            this.getAssetList(), this.load();
          }
        });
    },
    goEdit() {
      this.offline();
      this.getLastPrice(this.list[this.currentIndex]);
      this.editOffer(this.list[this.currentIndex]);
    },
    cancel() {
      this.currentIndex = null;
    }
  },
  computed: {
    ...mapState(["common"])
  },
  created() {
    if (this.common.isLogin) {
      this.load();
    }
  }
};
</script>