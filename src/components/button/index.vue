<template lang="pug">
  router-link.broker-btn.Button(:class="classes", :disabled="disabled" @click.native="handleClickLink" v-if="to", :to="to")
    span.broker-btn-bg(v-if="!disabled" :class="{[`hoverbg-${type}-dark`]:ghost||text}")
    span.broker-btn-load(v-if="loading")
      Icon(class="ivu-load-loop" type="loading" :size="iconSize")
    Icon(:type="icon" v-if="icon && !loading", :size="iconSize")
    span.broker-btn-text(v-if="showSlot" ref="slot")
      slot
  a.broker-btn.Button(:class="classes", @click="handleClickLink" v-else-if="href", :href="href")
    span.broker-btn-bg(v-if="!disabled" :class="{[`hoverbg-${type}-dark`]:ghost||text}")
    span.broker-btn-load(v-if="loading")
      Icon(class="ivu-load-loop" type="loading" :size="iconSize")
    Icon(:type="icon" v-if="icon && !loading", :size="iconSize")
    span.broker-btn-text(v-if="showSlot" ref="slot")
      slot
  button.broker-btn.Button(:type="htmlType", :class="classes", :disabled="disabled" @click="handleClickLink" v-else)
    span.broker-btn-bg(v-if="!disabled" :class="{[`hoverbg-${type}-dark`]:ghost||text}")
    span.broker-btn-load(v-if="loading")
      Icon(class="ivu-load-loop" type="loading" :size="iconSize")
    Icon(:type="icon" v-if="icon && !loading", :size="iconSize")
    span.broker-btn-text(v-if="showSlot" ref="slot")
      slot
</template>
<script>
import Icon from "../icon/index.vue";
export default {
  name: "Button",
  components: { Icon },
  props: {
    type: {
      validator(value) {
        return ["default", "primary", "secondary", "error"].indexOf(value) > -1;
      },
      default: "default"
    },
    circle: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return ["small", "large", "default"].indexOf(value) > -1;
      },
      default: "default"
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    htmlType: {
      default: "button",
      validator(value) {
        return ["button", "submit", "reset"].indexOf(value) > -1;
      }
    },
    icon: {
      type: String,
      default: ""
    },
    iconSize: {
      type: [String, Number],
      default: 20
    },
    href: {
      type: String,
      default: ""
    },
    to: {
      type: String,
      default: ""
    },
    long: {
      type: Boolean,
      default: false
    },
    ghost: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSlot: true,
      //按钮组
      group:false,
      //第一个
      isFirst:false
    };
  },
  computed: {
    classes() {
      let classSet = new Set();

      if (this.disabled) {
        classSet.add("color-grey-200");
        classSet.add("border-grey-50");
        if(!this.text&&!this.ghost){
          classSet.add("bg-grey-50");
        }
      } else {
        classSet.add(`broker-btn-${this.type}`);
        if (this.ghost || this.text) {
          if (this.type === "default") {
            classSet.add(`color-${this.type}-text`);
            classSet.add(`after-${this.type}-text`);
            classSet.add(`border-${this.type}-text`);
          } else {
            classSet.add(`color-${this.type}-main`);
            classSet.add(`after-${this.type}-main`);
            classSet.add(`border-${this.type}-main`);
          }
        } else {
          classSet.add(`after-${this.type}-text`);
          classSet.add(`color-${this.type}-text`);
          if (this.type === "default") {
            classSet.add(`border-grey-50`);
            classSet.add(`bg-grey-50`);
            classSet.add(`hoverbg-${this.type}-main`);
          } else {
            classSet.add(`bg-${this.type}-main`);
            classSet.add(`border-${this.type}-main`);
            classSet.add(`hoverbg-${this.type}-dark`);
          }
        }
      }

      if(!this.isFirst &&this.group&&(!this.ghost||this.text)){
        if(this.type=='default'||this.disabled){
          classSet.add(`borderleft-default-main`)
        }else{
          classSet.add(`borderleft-${this.type}-dark`)
        }
      }

      if (this.text) {
        classSet.add(`broker-btn-text`);
      }

      if (this.circle) {
        classSet.add(`broker-btn-circle`);
      }

      if (!this.showSlot && (!!this.icon || this.loading)) {
        classSet.add(`broker-btn-icon-only`);
      }

      if (this.loading) {
        classSet.add(`broker-btn-loading`);
      }

      if (this.long) {
        classSet.add(`broker-btn-long`);
      }

      if (this.size) {
        classSet.add(`broker-btn-size-${this.size}`);
      }
      return Array.from(classSet);
    }
  },
  methods: {
    handleClickLink(event) {
      if (!this.disabled&&!this.loading) {
        this.$emit("click", event);
      }
    }
  },
  mounted() {
    this.showSlot = this.$slots.default !== undefined;
    if(this.$parent.$options.name==="ButtonGroup"){
      this.group = true
      if(this.$parent.$slots &&this.$parent.$slots.default[0] &&this._uid==this.$parent.$slots.default[0].componentInstance._uid){
        this.isFirst = true
      }
    }
  }
};
</script>
