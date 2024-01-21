<template lang="pug">
.broker-input-wrapper(:class="{'color-grey-200':disabled}")
  .broker-input-area(:class="classes")
    .broker-input-before(v-if="before")
      slot(name="before")
    label(:class="labelClass" v-if="label") {{label}}
    input.Body2.broker-input.holder-grey-200(@focus="handleFocus" @blur="handleBlur" @keyup.enter="handleEnter" v-model="currentValue", :type="inputType", :placeholder="placeholder", :disabled="disabled", :readonly="readonly" @keyup="handlekeyup" @input="handleInput" :maxlength="maxlength" :autocomplete="type.toLocaleLowerCase()=='password'?'new-password':''")
    .broker-input-after(v-if="after||(type.toLocaleLowerCase()=='password'&&visible)")
      slot(name="after")
        Icon(:type="visibleIcon" v-if="type.toLocaleLowerCase()=='password'&&visible" @click.native="changeVisible")
    .bg-primary-main(:class="borderClass")
  .broker-input-help(v-if="help||showHelp||helpSpace")
    slot(name="help")
      .Caption(:class="error?'color-error-main' : 'color-grey-500'" v-if="help||helpSpace") {{help}} 
        i.broker-input-space
</template>
<script>
import Icon from "../icon/index.vue";
export default {
  name: "Input",
  components: { Icon },
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String,
      default: ""
    },
    help: {
      type: String,
      default: ""
    },
    visible: {
      type: [Boolean, String],
      default: false
    },
    labelSpace: {
      type: Boolean,
      default: false
    },
    helpSpace: {
      type: Boolean,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [Number, String],
      default: ""
    }
  },
  data() {
    return {
      currentValue: this.value,
      focus: false,
      inputType: this.type.toLocaleLowerCase(),
      visibleIcon: "hidden",
      before: false,
      after: false,
      showHelp: false
    };
  },
  computed: {
    classes() {
      let classSet = new Set();
      if (this.noBorder) {
        classSet.add("broker-input-area-noBorder");
      }
      if (this.disabled) {
        classSet.add("color-grey-500");
      }
      if (this.label || this.labelSpace) {
        classSet.add("broker-input-area-label");
      }
      if (this.error) {
        classSet.add("border-error-main");
      }else{
        classSet.add("border-grey-200");
      }
      if(this.readonly){
        classSet.add("color-grey-500");
      }
      return Array.from(classSet);
    },
    labelClass() {
      let classSet = new Set();
      classSet.add("broker-input-label");
      classSet.add("color-grey-500");
      classSet.add("Body2");
      if (this.focus || this.currentValue || this.placeholder || this.before) {
        classSet.add("broker-input-label-focus");
      }
      return Array.from(classSet);
    },
    borderClass() {
      let classSet = new Set();
      classSet.add("broker-input-border");
      if (this.focus) {
        classSet.add("broker-input-border-focus");
      }
      return Array.from(classSet);
    }
  },
  methods: {
    handleEnter(event) {
      this.$emit("enter", event);
    },
    handleFocus(event) {
      if (!this.disabled && !this.readonly) {
        this.focus = true;
      }
      this.$emit("focus", event);
    },
    handleBlur(event) {
      this.focus = false;
      this.$emit("blur", event);
    },
    handlekeyup(event) {
      this.$emit("keyup", event);
    },
    handleInput(event) {
      let value = event.target.value;
      this.$emit("input", value);
      if (this.currentValue != value) {
        this.currentValue = value;
      }
      this.$emit("keyup", event);
      this.$emit("on-change", value);
    },
    changeVisible() {
      if (this.inputType == "password") {
        this.inputType = "text";
        this.visibleIcon = "unhidden";
      } else {
        this.inputType = "password";
        this.visibleIcon = "hidden";
      }
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    if (this.type !== "textarea") {
      this.before = this.$slots.before !== undefined;
      this.after = this.$slots.after !== undefined;
    } else {
      this.before = false;
      this.after = false;
    }
    this.showHelp = this.$slots.help !== undefined;
    if (this.visible == "open") {
      this.changeVisible();
    }
  }
};
</script>
