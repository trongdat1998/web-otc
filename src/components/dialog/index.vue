<template lang="pug">
Modal.Shadow16(:class="classes" v-model="visible", :closable="false" :mask-closable="false", :transitionNames="[]"  :width="width")
  .broker-dialog-title.Subtitle1(v-if="title") {{title}}
  .broker-dialog-desc.color-grey-800.Body2(v-if="desc") {{desc}}
  .broker-dialog-content(v-if="showSlot")
    slot
  .broker-dialog-foot(slot="footer")
    .broker-dialog-custom
      slot(name="custom")
    slot(name="footer")
      Button(type="primary" text @click="cancel" v-if="cancelText") {{$lang(cancelText)|toUP}}
      Button(type="primary" text @click="ok" v-if="okText", :loading="buttonLoading") {{$lang(okText)|toUP}}
</template>
<script>
import Button from "../button/index.vue";
export default {
  name: "Dialog",
  components: { Button },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    okText: {
      type: [String, Boolean],
      default: "确定"
    },
    cancelText: {
      type: [String, Boolean],
      default: "取消"
    },
    title: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      showSlot: true,
      buttonLoading: false,
      visible: this.value
    };
  },
  computed: {
    classes() {
      let classSet = new Set();
      classSet.add("broker-dialog");
      return Array.from(classSet);
    }
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit("on-cancel");
    },
    ok() {
      !this.buttonLoading && this.$emit("on-ok");
      if (this.loading) {
        this.buttonLoading = true;
      } else {
        this.visible = false;
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      if (val === false) {
        this.buttonLoading = false;
      }
      this.$emit("input", this.visible);
    },
    loading(val) {
      if (!val) {
        this.buttonLoading = false;
      }
    }
  },
  mounted() {
    this.showSlot = this.$slots.default !== undefined;
  }
};
</script>
