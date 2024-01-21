<style lang="less" scoped>
.appeal_modal {
  .button {
    width: 100%;
    overflow: hidden;
  }
  .user_input {
    textarea {
      width: 100%;
      height: 140px;
      resize: none;
      padding: 4px 5px;
      &:focus {
        outline: none;
      }
    }
  }
  .list {
    width: 100%;
    height: 200px;
    overflow-y: scroll;
    margin-bottom: 10px;
    border-width: 1px;
    border-style: solid;
    img {
      width: 200px;
    }
    dl {
      padding: 5px;
    }
    dd {
      padding: 8px;
    }
  }
  .imgs {
    padding-top: 10px;
    img {
      width: 50px;
      height: 50px;
      display: block;
    }
  }
  .img {
    position: relative;
    .close {
      position: absolute;
      border-radius: 10px;
      left: 45px;
      top: -5px;
    }
  }
  .upload {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
<template lang="pug">
Dialog(:title="title", :loading="true" @on-ok="submit" v-model="visible")
  .appeal_modal
    .button
      ButtonGroup(size="small")
        Button(@click="current=1", :text="current==1? false:true ") {{$lang("上传")}}
        Button(@click="getMessage", :text="current==2? false:true") {{$lang("查看")}}
    .list.border-grey-100(v-show="current==2")
      template(v-if="list.length")
        dl(v-for="item in list")
          dt.color-secondary-dark {{ new Date(item.createDate*1).format("yyyy-MM-dd hh:mm:ss") }}
          dd(v-if="item.msgType==102")
            img(:src="item.message")
          dd(v-else) {{ item.message }}
      NoData(v-else-if="init" style="padding:70px")
    
    div(v-show="current==1")
      .user_input
        textarea.Body2.border-grey-100(:placeholder="$lang('问题描述')" v-model="message")
      Row.imgs
        Col.img(:key="item" span="6" v-for="(item,index) in imgs")
          Icon.bg-grey-200.close(type="close" size="14" @click="remove(index)")
          img.Shadow1(:src="item")
        Col(span="4" v-if="imgs.length<4")
          .upload
            Upload(name="upload_image_file", :action="action", :format="['jpg','jpeg','png']", :on-success="uploadSuccess", :show-upload-list="false" v-show="!loading", accept="image/gif,image/jpeg,image/jpg,image/png", :before-upload="handleBeforeUpload")
              Icon(type="addPicture" size="30")
            Icon.ivu-load-loop(size="30" type="loading" v-show="loading")
</template>
<script>
import { mapState, mapActions } from "vuex";
import Helper from "@/libs/helper";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      init: false,
      visible: this.value,
      current: 1,
      loading: false,
      message: "",
      imgs: [],
      list: []
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible() {
      this.$emit("input", this.visible);
    }
  },
  computed: {
    ...mapState(["common"]),
    title() {
      return this.$lang("上传证明");
    },
    action() {
      return `/api/user/upload_image?c_token=${Helper.cookie("c_token")}`;
    }
  },
  methods: {
    ...mapActions(["appealshow"]),
    remove(index) {
      this.imgs = this.imgs.filter((el, _index) => {
        return index != _index;
      });
    },
    handleBeforeUpload() {
      this.loading = true;
    },
    uploadSuccess(res) {
      this.imgs.push(res.url);
      this.loading = false;
    },

    getMessage() {
      if (this.current != 2) {
        this.current = 2;
        this.$axios
          .post("/api/otc/message/appeal/list", {
            orderId: this.$route.params.orderId
          })
          .then(result => {
            this.init = true;
            this.list = result.data;
          });
      }
    },

    sendImage(message) {
      return this.$axios.post("/api/otc/message/send", {
        orderId: this.$route.params.orderId,
        message,
        msgType: 102
      });
    },
    sendMessage() {
      return this.$axios.post("/api/otc/message/send", {
        orderId: this.$route.params.orderId,
        message: this.message,
        msgType: 101
      });
    },
    submit() {
      let all = [];

      if (this.message) {
        all.push(this.sendMessage());
      }

      if (this.imgs.length) {
        this.imgs.forEach(el => {
          all.push(this.sendImage(el));
        });
      }

      if (all.length) {
        this.$axios.all(all).then(
          this.$axios.spread((acct) => {
            if (acct.code == 0) {
              this.message = "";
              this.imgs.length = 0;
              this.appealshow();
            }
          })
        );
      } else {
        this.appealshow();
      }
    }
  }
};
</script>