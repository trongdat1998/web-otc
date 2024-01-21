<template lang="pug">
  i.broker-icon(:class="classes" :style="styles" @click="handleClick")
    span(v-if="showSlot")
      slot
</template>
<script>
export default {
  name: "Icon",
  props: {
    type: {
      type: String,
      default: ""
    },
    size: {
      type: [Number, String],
      default: ""
    },
    color: { type: String, default: "" }
  },
  data(){
    return{
      showSlot:false
    }
  },
  computed: {
    classes() {
      let classSet = new Set();
      if (this.type) {
        classSet.add(`broker-icon-${this.type}`);
      }
      return Array.from(classSet);
    },
    styles() {
      let style = {};
      if (this.size) {
        style["font-size"] = `${this.size}px`;
      }
      if (this.color) {
        style.color = this.color;
      }
      return style;
    }
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    }
  },
  mounted() {
    this.showSlot = this.$slots.default !== undefined;
  }
};
</script>
