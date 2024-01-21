<style lang="less" scoped>
.talk {
  position: absolute;
  width: 33.33333%;
  height: calc(100% - 80px);
  right: 0;
  min-height: 600px;
  .messages {
    margin: 60px 0 60px;
    height: calc(100% - 120px);
    overflow: auto;
  }
  .chat {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 56px;
    z-index: 2;
    border-left-width: 0;
    border-right-width: 0;
    border-bottom-width: 0;
    border-top-width: 1px;
    border-top-style: solid;
    display: flex;
    align-items: center;
    padding: 0 20px 0 20px;
    justify-content: space-between;
    input {
      width: 272px;
      height: 24px;
      border: 0;
    }
  }
  .add_more {
    padding: 16px 0 0;
    height: 56px;
    width: 100%;
    z-index: 2;
    text-align: center;
  }
  .caption {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    padding: 16px 24px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
  }
  .item {
    display: flex;
    div {
      &:nth-child(3n + 1),
      &:nth-child(3n) {
        width: 56px;
        text-align: center;
      }
      &:nth-child(3n + 2) {
        flex: 1;
        p {
          padding: 8px 12px;
          border-radius: 2px;
          &.msg_sys {
            text-align: center;
            strong {
              font-weight: 400;
            }
          }
          img {
            max-width: 100%;
          }
        }
        p.bg-grey-50{
          margin: 0 0 14px;
        }
        span {
          text-align: center;
          display: block;
          margin: 0 0 24px;
        }
      }
    }
  }
}
</style>

<template lang="pug">
.talk.Shadow1
  dl.caption.border-grey-100.bg-common-background
    dt.Body2
      strong {{data.targetNickName}} 
      | ({{data.recentOrderNum}} / {{data.recentExecuteRate}}%)
    dd
      a(v-if="data.status<30" @click="targetConnect") {{ $lang("查看对方联系方式") }} 
        Icon(type="dianhua" @click="targetConnect" size="20")

  .messages(ref="messages")
    .item(v-for="item in message_list")
      div
        Badge(v-if="item.msgType !== 0 && item.accountId === data.targetAccountId")
          Avatar(:color="item.accountId") {{data.targetNickName[0]|toUP}}
      div
        template(v-if="item.msgCode")
          p.Body2.msg_sys
            strong(v-html="format(item.message)")
            a(v-if="status(item.msgCode)" @click="appealshow") {{$lang("上传证明")}}
        template(v-else-if="item.msgType==2")
          p.bg-grey-50
            img(:src="item.message")
        template(v-else)
          p.Body2.bg-grey-50 {{ item.message }}
        span.Caption.color-grey-500 {{ new Date(item.createDate*1).format("yyyy-MM-dd hh:mm:ss") }}
      div
        Badge(v-if="item.msgType !== 0 && item.accountId === data.accountId")
          Avatar(:color="item.accountId") {{data.nickName[0]|toUP}}
  .chat.border-grey-100.bg-common-background(v-if="!(data.status==50||data.status==40)")
    Input(:placeholder="$lang('按下回车发送消息')" noBorder v-model="message",  @enter="sendMessage")
      template(slot="after")
        Icon(type="comment" @click="sendMessage" v-show="message")
        Upload(name="upload_image_file", :action="action", :format="['jpg','jpeg','png']", :on-success="uploadSuccess", :show-upload-list="false" v-show="!message && !loading", :before-upload="handleBeforeUpload" v-if="data.status<40" accept="image/gif,image/jpeg,image/jpg,image/png")
          Icon(type="addPicture")
        Icon.ivu-load-loop(type="loading" v-show="loading")
  ConfirmConnect(v-model="connectModal", :data="data", :appealLastSeconds="appealLastSeconds")
  ConfirmAppeal(v-model="common.appealModal")
</template>

<script>
let fn = null;
import { mapState, mapActions } from "vuex";
import CountDown from "./count_down.vue";
import ConfirmConnect from "./confirm_connect.vue";
import ConfirmAppeal from "./confirm_appeal.vue";
import Helper from "@/libs/helper";
export default {
  components: {
    CountDown,
    ConfirmConnect,
    ConfirmAppeal
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    appealLastSeconds: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      // 消息列表
      message_list: [],
      message: "",
      length: 0,
      loading: false,
      connectModal: false
    };
  },
  created() {
    this.getNewMessage();
  },
  beforeDestroy() {
    clearTimeout(fn);
  },
  computed: {
    ...mapState(["common"]),
    action() {
      return `/api/user/upload_image?c_token=${Helper.cookie("c_token")}`;
    }
  },
  methods: {
    ...mapActions(["appealshow"]),
    status(code) {
      return (
        code == 1031 ||
        code == 1030 ||
        code == 2030 ||
        code == 2031 ||
        code == 3030 ||
        code == 3031
      );
    },
    targetConnect() {
      this.connectModal = true;
    },
    handleBeforeUpload() {
      this.loading = true;
    },
    uploadSuccess(res) {
      this.sendImage(res.url);
      this.loading = false;
    },
    format(msg) {
      return msg.replace(/%amount%/g, this.data.quantity + this.data.tokenName);
    },
    // 获取最新的消息
    getNewMessage() {
      clearTimeout(fn);
      this.$axios
        .post("/api/otc/message/list", {
          orderId: this.$route.params.orderId,
          size: 20
        })
        .then(result => {
          if (result.code === 0) {
            this.message_list = result.data.reverse();
            // 有新消息再做推送
            if (this.message_list.length != this.length) {
              this.length = this.message_list.length;
              setTimeout(() => {
                this.$refs.messages.scrollTo(0, 10000);
              }, 100);
            }
          }
        });
      fn = setTimeout(() => {
        if (this.data.status < 40) {
          this.getNewMessage();
        }
      }, this.common.time.fast);
    },
    sendMessage() {
      if (this.message) {
        this.$axios
          .post("/api/otc/message/send", {
            orderId: this.$route.params.orderId,
            message: this.message
          })
          .then(() => {
            this.getNewMessage();
          });
        this.message = "";
      }
    },
    sendImage(url) {
      this.$axios
        .post("/api/otc/message/send", {
          orderId: this.$route.params.orderId,
          message: url,
          msgType: 2
        })
        .then(() => {
          this.getNewMessage();
        });
    }
  }
};
</script>