<template lang="pug">
Dialog(:title="$lang(title)", :cancelText="null", ok-text="确认" v-model="visible")
  div(style="text-align: center")
    .Subtitle1.color-primary-main(v-if="data.status==10") {{text}}
    template(v-else-if="data.status==20")
      .Subtitle1.color-secondary-dark(v-if="appealLastSeconds>0")
        CountDown(v-model="appealLastSeconds", :template='$lang("买家付款%m%:%s%后可查看")')
      .Display2.color-secondary-dark(v-else) {{data.targetConnectInfomation}}
    .Subtitle1.color-primary-main(v-else-if="data.status === 30") {{$lang('申诉中')}}
    .Subtitle1.color-primary-main(v-else-if="data.status === 40") {{$lang('订单已经取消')}}
    .Subtitle1.color-primary-main(v-else-if="data.status === 50") {{$lang("已完成")}}
</template>
<script>
import CountDown from "./count_down.vue";
export default {
  components: {
    CountDown
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: Boolean,
      default: false
    },
    appealLastSeconds: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      visible: this.value
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
    title() {
      return this.data.side == 1 ? "买方联系方式" : "卖方联系方式";
    },
    text() {
      return this.$lang("买家付款%m%:%s%后可查看")
        .replace(/%m%/g, 5)
        .replace(/%s%/g, "00");
    }
  }
};
</script>