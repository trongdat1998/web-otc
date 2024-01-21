<style lang="less" scoped>
.info {
  padding: 8px 0;
}
.caption {
  line-height: 32px;
}
</style>
<template lang="pug">
Item(:title="$lang('个人信息')" v-if="common.userInfo.accountId")
  template(v-if="nickName")
    Row.info(:gutter="16")
      Col.caption.color-grey-500(span="6") {{$lang('头像')}}:
      Col(span="12")
        Avatar(:color="common.userInfo.accountId") {{nickName[0]|toUP}}
      Col(span="3") 
        i.broker-space
      Col(span="3")
        Button(text long disabled) {{$lang('修改')|toUP}}
    Row.info(:gutter="16")
      Col.caption.color-grey-500(span="6") {{$lang('昵称')}}:
      Col.caption(span="12") {{nickName}}
      Col(span="3") 
        i.broker-space
      Col(span="3")
        Button(text long disabled) {{$lang('修改')|toUP}}
  template(v-else)
    Row.info(:gutter="16")
      Col.caption.color-grey-500(span="6") {{$lang('昵称')}}:
      Col(span="12")
        Input(:placeholder="$lang('请输入昵称')" v-model="inputNickname", :error="error", :help="$lang(msg)" @blur="checkNickname")
      Col(span="3") 
        i.broker-space
      Col(span="3")
        Button(type="primary" long @click="submit") {{$lang('确定')|toUP}}
</template>

<script>
import Item from "./Item";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      error: false,
      init: false,
      inputNickname: "",
      msg: "昵称作为法币交易中用户名称展示，设置成功后不可修改"
    };
  },
  computed: {
    ...mapState(["common"]),
    nickName() {
      return this.common.userInfo.nickName;
    }
  },
  methods: {
    ...mapActions(["setUserInfo"]),
    removeEmoji(content) {
      return content.replace(
        /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
        ""
      );
    },
    checkNickname() {
      let inputNickname = this.removeEmoji(this.inputNickname.trim());
      this.error = false;
      if (!inputNickname) {
        this.msg = "请输入昵称";
        this.error = true;
      } else if (inputNickname.length < 2 || inputNickname.length > 16) {
        this.msg = "昵称限制2-16字符";
        this.error = true;
      }
      this.inputNickname = inputNickname;
      return !this.error;
    },
    submit() {
      this.checkNickname() &&
        this.$axios
          .post("/api/otc/user/set_nick_name", {
            nickName: this.inputNickname
          })
          .then(() => this.setUserInfo());
    }
  },
  created() {
    if (this.common.isLogin) {
      this.setUserInfo();
    }
  },
  components: {
    Item
  }
};
</script>
