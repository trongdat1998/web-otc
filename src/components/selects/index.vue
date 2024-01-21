<template lang="pug">
.broker-select-wrapper(:class="{'broker-select-disabled':disabled}")
  .broker-select-area(:class="classes")
    Select(:disabled="disabled", :placeholder="placeholder", @on-change="change" v-model="currentValue")
      slot
  .broker-select-help(v-if="help||showHelp||helpSpace")
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
    placeholder: {
      type: String,
      default: ""
    },
    helpSpace: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: ""
    },
    error: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value,
      showHelp: false
    };
  },
  computed: {
    classes() {
      let classSet = new Set();
      if (this.label || this.labelSpace) {
        classSet.add("broker-select-area-label");
      }
      return Array.from(classSet);
    }
  },
  methods: {
    change() {
      this.$emit("on-change", this.currentValue);
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
    this.showHelp = this.$slots.help !== undefined;
  }
};
</script>
