<style lang="less" scoped>
.info {
  padding: 8px 0;
}
.caption {
  line-height: 32px;
}
</style>
<template lang="pug">
Item(:title="$lang('安全')" v-if="common.baseInfo.defaultAccountId")
  template(v-if="common.baseInfo.bindTradePwd")
    Row.info(:gutter="16")
      Col.color-grey-500.caption(span="6") {{$lang('资金密码')}}:
      Col(span="12") ********
      Col(span="3")
        i.broker-space
      Col(span="3")
        Button(type="primary" text long :href="'/user/fundpassword'|formatUrl") {{$lang('修改')|toUP}}
  form(v-else)
    input(type="text" style="display: none;" autocomplete="username")
    Row.info(:gutter="16")
      Col.color-grey-500.caption(span="6") {{$lang('资金密码')}}:
      Col(span="12")
        Input(v-model="formItem.trade_pwd" type="password" visible :help="msgPwd", :error="msgPwd?true:false" :placeholder="$lang('密码仅限6-20位字符')" @blur="checkPassword")
      Col(span="3")
        i.broker-space
      Col(span="3")
        Button(type="primary" long @click="savePassword") {{$lang('保存')|toUP}}
    Row.info(:gutter="16")
      Col.color-grey-500.caption(span="6") {{$lang('确认密码')}}:
      Col(span="12")
        Input(v-model="formItem.trade_pwd2" type="password" visible, :help="msgPwd2", :error="msgPwd2?true:false" , :placeholder="$lang('两次输入的密码请保持一致')" @blur="checkPassword2")
    Row.info(:gutter="16")
      template(v-if="common.baseInfo.registerType == 1")
        Col.color-grey-500.caption(span="6") {{$lang('手机')}}:
        Col(span="12")
          Input(:value="common.baseInfo.mobile" readonly)
      template(v-else)
        Col.color-grey-500.caption(span="6") {{$lang('邮箱')}}:
        Col(span="12")
          Input(:value="common.baseInfo.email" readonly)
    Row.info(:gutter="16")
      Col.color-grey-500.caption(span="6") {{$lang('验证码')}}:
      Col(span="12")
        Input(v-model="formItem.verify_code", :placeholder="$lang('请输入验证码')" @blur="checkCode", :help="msgCode", :error="msgCode?true:false")
          Button(type="default" text slot="after" v-if="time" key="after") {{time}}s
          Button(type="primary" text @click="sendCode" slot="after" v-else key="before") {{$lang('获取验证码')|toUP}}
</template>

<script>
import Item from "./Item";
import md5 from "md5";
import { mapState } from "vuex";
import Helper from "@/libs/helper";
export default {
  data() {
    return {
      time: 0,
      formItem: {
        trade_pwd: "",
        trade_pwd2: "",
        order_id: "",
        verify_code: ""
      },
      msgPwd2: "",
      msgPwd: "",
      msgCode: ""
    };
  },
  watch: {
    time() {
      if (this.time) {
        setTimeout(() => {
          this.time--;
        }, 1000);
      }
    }
  },
  filters: {
    formatUrl:Helper.formatUrl
  },
  computed: {
    ...mapState(["common"])
  },
  methods: {
    checkPassword() {
      this.msgPwd = "";
      if (this.formItem.trade_pwd === "") {
        this.msgPwd = this.$lang("资金密码不能为空");
      } else if (!/^.{6,20}$/.test(this.formItem.trade_pwd)) {
        this.msgPwd = this.$lang("密码仅限6-20位字符");
      }
      if (this.formItem.trade_pwd2 !== "") {
        this.checkPassword2();
      }
      return this.msgPwd ? false : true;
    },
    checkPassword2() {
      this.msgPwd2 = "";
      if (this.formItem.trade_pwd2 === "") {
        this.msgPwd2 = this.$lang("请输入确认密码");
      } else if (this.formItem.trade_pwd != this.formItem.trade_pwd2) {
        this.msgPwd2 = this.$lang("两次输入的密码请保持一致");
      }
      return this.msgPwd2 ? false : true;
    },
    checkCode() {
      this.msgCode = "";
      if (this.formItem.verify_code === "") {
        this.msgCode = this.$lang("请输入验证码");
      } else if (!/^\d{6}$/.test(this.formItem.verify_code)) {
        this.msgCode = this.$lang("请输入6位数字验证码");
      }
      return this.msgCode ? false : true;
    },
    // 保存密码
    savePassword() {
      let canNext = true;
      ["checkCode", "checkPassword", "checkPassword2"].forEach(el => {
        if (!this[el]()) {
          canNext = false;
        }
      });
      canNext &&
        this.$axios
          .post("/api/user/trade_pwd/set", {
            order_id: this.formItem.order_id,
            verify_code: this.formItem.verify_code,
            trade_pwd: md5(this.formItem.trade_pwd),
            trade_pwd2: md5(this.formItem.trade_pwd2)
          })
          .then(result => {
            if (result.code == 0) {
              location.reload();
            }
          });
    },
    sendCode() {
      let url = this.common.baseInfo.registerType == 1 ? "/api/user/send_sms_verify_code" : "/api/user/send_email_verify_code";
      this.$axios.post(url, { type: 15 }).then(result => {
        if (result.code === 0) {
          this.formItem.order_id = result.data.orderId;
          this.time = 60;
        }
      });
    }
  },
  components: {
    Item
  }
};
</script>
