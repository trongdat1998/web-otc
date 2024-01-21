<template lang="pug">
  Dialog(v-model='visible', :title="$lang('提交申诉')", :loading="true" @on-ok="appeal")
    .order_detail_modal
      div(style="padding-bottom: 30px;")
        Select(v-model="complaintType")
          Option(value='') {{$lang("请选择申诉原因")}}
          Option(:value='0') {{$lang("买方没有打款")}}
          Option(:value='1') {{$lang("卖方没有放币")}}
          Option(:value='2') {{$lang("对方言语侮辱")}}
          Option(:value='3') {{$lang("对方没有回复信息")}}
          Option(:value='4') {{$lang("其他")}}
      Input(type='textarea', :placeholder="$lang('请输入申诉理由')", rows="4" v-model="complaintReason")
</template>
<script>
export default {
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
    }
  },
  data() {
    return {
      complaintType: "",
      complaintReason: "",
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
  methods: {
    appeal() {
      this.$axios
        .post("/api/otc/order/appeal", {
          orderId: this.data.id,
          appealType: this.complaintType,
          appealContent: this.complaintReason
        })
        .then(() => {
          location.reload();
        });
    }
  }
};
</script>