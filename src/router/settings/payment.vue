<style lang="less" scoped>
.info {
  padding: 8px 0;
  line-height: 32px;
}
.qrcode {
  max-width: 300px;
  max-height: 300px;
}
.input {
  display: block;
}
.poptip {
  width: 100%;
  > :nth-child(1) {
    width: 100%;
  }
}
.switch {
  text-align: right;
}
strong.tip {
  line-height: 1.8;
  text-align: justify;
  display: block;
}
</style>
<template lang="pug">
Item(:title="$lang('收款方式')")
  Row.info(:gutter="16" v-if="common.baseInfo.userType!=1" key="un")
    Col.color-grey-500(span="21") {{$lang("法币交易业务暂不对机构账户开放")}}
  template(v-else-if="trade.paymentList.length")
    Row(:gutter="16" key="tip")
      Col.color-grey-500(span="24")
        strong.tip.Caption.color-error-main {{$lang("OTC属于场外交易，法币不经过平台，平台不会自动扣款，需要您手动自行付款给对方，对方才能收到款项。绑定收款方式只为核对信息之用，不是扣款依据。")}}
    Row.info(:gutter="16" v-for="(item,index) in trade.paymentList", :key="index")
      //Col(span="24") {{common.paymentTypes[item.paymentType]}}
      Col.color-grey-500(span="6") {{common.paymentTypes[item.paymentType].paymentName}}:
      Col(span="12")
        Poptip(trigger="hover" v-if="item[common.paymentTypes[item.paymentType].isPic]")
          img.qrcode(:src="item[common.paymentTypes[item.paymentType].isPic]" slot="content")
          Icon(type="code1")
        template(v-for="_item,key in item" v-if="common.paymentTypes[item.paymentType].views[key] && key!=common.paymentTypes[item.paymentType].isPic")
          template(v-if="key==='bankName'") {{common.bankMap[item.bankName]||item.bankName}} 
          template(v-else) {{_item}} 
      Col.switch(span="3" )
        iSwitch(v-model="item.visible" :true-value="0" :false-value="1" @on-change="setStatus(item)" size="small")
      Col(span="3")
        Button(type="primary" @click="showModal(item)" text long) {{$lang("修改")|toUP}}
    Row.info(:gutter="16")
      Col.color-grey-500(span="21")
        i.broker-space
      Col(span="3")
        Button(type="primary" text long @click="showModal()") {{$lang("添加")|toUP}}
  template(v-else)
    Row.info(:gutter="16")
      Col.color-grey-500(span="21") {{$lang("请务必使用您本人的实名账户，至少激活一种支付方式")}}
      Col(span="3")
        Button(type="primary" long @click="showModal()") {{$lang("添加")|toUP}}
  
  Dialog(v-model="kycTip", ok-text="实名认证", cancel-text="暂不需要", :desc="$lang('为了您的账户安全，请您实名认证后进行法币操作')" @on-ok="goKyc")

  Dialog(v-model="tradePwdTip", title="", ok-text="我知道了", :desc="$lang('为了您的帐户安全，请在设置资金密码后执行操作。')")

  Dialog(v-model='modalAdd', :title="$lang(payInfo.id ? '修改收款方式' : '添加收款方式')")
    form
      Input(:value="common.paymentTypes[payInfo.paymentType].paymentName" readonly, disabled :label="$lang('收款类型')" v-if="payInfo.id", helpSpace)
      Selects(v-model="payInfo.paymentType" v-else,  helpSpace) 
        Option(v-for="item in common.payments", :value="item.paymentType", :key="item.paymentType") {{item.paymentName}}
      template(v-for="item in common.payments" v-if="payInfo.paymentType==item.paymentType")
        div(v-for="_item,index in item.items" :key="item.paymentType+ _item.name")
          Input.input(@input="verifyItem(_item)" @blur="verifyItem(_item)", v-model="payInfo[_item.name]", :label="_item.label", :placeholder="_item.placeholder",  helpSpace  :help="help[_item.name]"  :error="!!help[_item.name]" )
            template(v-if="_item.type=='image'")
              Poptip(slot="before" trigger="hover" v-show="payInfo[_item.name]")
                img.qrcode(:src="payInfo[_item.name]" slot="content")
                Icon(type="code1")
              div(slot="after")
                Upload(name="upload_image_file", :action="imgagePostUrl", :before-upload="beforeUpload" :on-success="uploadSuccess", :show-upload-list="false" accept="image/gif,image/jpeg,image/jpg,image/png" v-show="!uploading" @on-error="uploadError" @click.native="imgKey = _item.name")
                  Icon(type="upload")
                Icon.ivu-load-loop(slot="after" type="loading" v-show="uploading")
      Input.input(:label="$lang('资金密码')" :placeholder="$lang('资金密码')" v-model="payInfo.tradePwd" type="password" visible @blur="verifyTradePwd", @input="help.tradePwd=''" :help="help.tradePwd", helpSpace,  :error="!!help.tradePwd" )
    template(slot="footer")
      Button(type="primary" text @click="modalAdd=false") {{$lang('取消')|toUP}}
      template(v-for="item in common.payments" v-if="payInfo.paymentType==item.paymentType")
        Button(type="primary" text @click="submit(item)" :loading="loading") {{$lang('确定')|toUP}}
    Button(slot="custom" type="error" text v-if="payInfo.id" @click="removePayment", :loading="removeLoading") {{$lang('删除收款方式')}}
</template>


<script>
import md5 from "md5";
import Item from "./Item";
import { mapState, mapActions } from "vuex";
import Helper from "@/libs/helper";
export default {
  props: {
    verifyInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      payments: [],
      kycTip: false,
      tradePwdTip: false,
      modalAdd: false,
      uploading: false,
      loading: false,
      removeLoading: false,
      imgKey: "",
      payInfo: {
        id: "",
        paymentType: "",
        tradePwd: ""
      },
      help: {
        tradePwd: ""
      }
    };
  },
  computed: {
    ...mapState(["common", "trade"]),
    imgagePostUrl() {
      return `/api/user/upload_image?c_token=${Helper.cookie("c_token")}`;
    }
  },
  methods: {
    ...mapActions(["getPaymentList"]),
    goKyc() {
      location.href = Helper.formatUrl("/user/kyc");
    },
    beforeUpload() {
      this.uploading = true;
    },
    uploadError() {
      this.uploading = false;
    },
    uploadSuccess(res) {
      this.uploading = false;
      this.payInfo[this.imgKey] = res.url;
      this.$tips.success(this.$lang("上传成功!"));
    },

    setStatus(item) {
      this.$axios.post("/api/otc/payment/switch", item).then(() => {
        this.getPaymentList();
      });
    },

    removePayment() {
      if (this.verifyTradePwd()) {
        this.removeLoading = true;
        this.$axios
          .post("/api/otc/payment/delete", {
            id: this.payInfo.id,
            tradePwd: md5(this.payInfo.tradePwd)
          })
          .then(result => {
            if (result.code == 0) {
              this.getPaymentList();
              this.modalAdd = false;
            }
            this.removeLoading = false;
          });
      }
    },

    verifyItem(item) {
      if (item.required) {
        if (!this.payInfo[item.name].trim()) {
          this.help[item.name] = item.placeholder;
          return false;
        } else {
          this.help[item.name] = "";
        }
      }
      return true;
    },

    verifyTradePwd() {
      this.help.tradePwd = "";
      if (this.payInfo.tradePwd === "") {
        this.help.tradePwd = this.$lang("请输入资金密码");
      } else if (!/^.{6,20}$/.test(this.payInfo.tradePwd)) {
        this.help.tradePwd = this.$lang("密码仅限6-20位字符");
      }
      return this.help.tradePwd ? false : true;
    },

    // 展示支付方式弹框
    showModal(item) {
      Object.keys(this.help).forEach(el => {
        this.help[el] = "";
      });

      if (
        this.common.baseInfo.bindTradePwd &&
        this.verifyInfo.verifyStatus == 2
      ) {
        this.modalAdd = true;
        if (item) {
          Object.assign(this.payInfo, item);
          this.payInfo.tradePwd = "";
          this.payInfo.bankName =
            this.common.bankMap[item.bankName] || item.bankName;
        } else {
          Object.assign(this.payInfo, {
            paymentType: this.common.payments[0].paymentType,
            bankName: "",
            accountNo: "",
            qrcode: "",
            realName: "",
            tradePwd: "",
            id: ""
          });
        }
      } else if (this.verifyInfo.verifyStatus != 2) {
        this.kycTip = true;
      } else {
        this.tradePwdTip = true;
      }
    },

    submit(item) {
      let canNext = this.verifyTradePwd();

      item.items.forEach(_item => {
        this.verifyItem(_item)
        if (_item.required && canNext) {
          canNext = this.verifyItem(_item);
        }
      });

      if (canNext) {
        this.loading = true;
        let payInfo = Object.assign({}, this.payInfo);
        if(!payInfo.id){
          delete payInfo.id
        }
        payInfo.tradePwd = md5(this.payInfo.tradePwd);
        this.$axios
          .post(
            this.payInfo.id
              ? "/api/v1/otc/payment/new_update"
              : "/api/v1/otc/payment/new_create",
            payInfo
          )
          .then(result => {
            this.loading = false;
            if (result.code == 0) {
              this.$tips.success(this.$lang("修改成功!"));
              this.modalAdd = false;
              this.getPaymentList();
            }
          });
      }
    }
  },
  created() {
    this.getPaymentList();
    let payInfo = {};
    let help = {};

    this.common.payments.forEach(item => {
      item.items.forEach(_item => {
        payInfo[_item.name] = "";
        help[_item.name] = "";
      });
    });

    this.$set(this, "payInfo", Object.assign({}, this.payInfo, payInfo));

    this.$set(this, "help", Object.assign({}, this.help, help));
  },
  components: {
    Item
  }
};
</script>
