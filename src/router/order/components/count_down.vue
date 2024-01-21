<template lang="pug">
span(v-html="html")
</template>
<script>
import Helper from "@/libs/helper.js";
let fn = null;
export default {
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    template: {
      type: String,
      default: "%m%:%s%"
    }
  },
  data() {
    return {
      time: this.value
    };
  },
  computed: {
    html() {
      return this.template
        .replace(/%m%/g, Helper.fullNumber(Math.floor(this.time / 60)))
        .replace(/%s%/g, Helper.fullNumber(this.time % 60));
    }
  },
  filters: {
    fullNumber: Helper.fullNumber
  },
  watch: {
    time() {
      clearTimeout(fn);
      if (this.time>0) {
        fn = setTimeout(() => {
          this.time = this.time - 1;
        }, 1000);
      } else {
        this.$emit("timeEnd", this.time);
      }
    },
    value() {
      if(this.value!=this.time){
        this.time = this.value;
      }
    }
  },
  mounted() {
    if (parseInt(this.time)) {
      this.time--;
    } else {
      this.$emit("timeEnd", this.time);
    }
  },
  beforeDestroy() {
    clearTimeout(fn);
  }
};
</script>