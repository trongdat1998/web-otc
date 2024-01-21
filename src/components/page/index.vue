<template lang="pug">
.broker-page
  Icon(@click.native="setPage('first')" type="firstPage", :class="currentValue<=1 ? 'color-grey-100 broker-page-disabled':'hover-primary-main'")
  Icon(@click.native="setPage('prev')" type="prevPage", :class="currentValue<=1 ? 'color-grey-100 broker-page-disabled':'hover-primary-main'")
  Icon {{currentValue}}
  Icon(@click.native="setPage('next')" type="nextPage", :class="currentValue>=max ? 'color-grey-100 broker-page-disabled':'hover-primary-main'")
  Icon(@click.native="setPage('last')" type="lastPage", :class="currentValue>=max ?'color-grey-100 broker-page-disabled':'hover-primary-main'" v-if="type!='mini'")
</template>
<script>
import Icon from "../icon/index.vue";
export default {
  name: "Page",
  components: { Icon },
  props: {
    list: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: [String, Number],
      default: 1
    },
    total: {
      type: [String, Number],
      default: 0
    },
    pageSize: {
      type: [String, Number],
      default: 10
    },
    type:{
      type: String,
      default: ""
    }
  },
  data() {
    return {
      currentValue: this.value,
      max: 0
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue() {
      if (this.value != this.currentValue) {
        this.$emit("input", this.currentValue);
        this.$emit("change", this.currentValue);
      }
    },
    total(){
      this.max = Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    setPage(str) {
      if (str == "first") {
        this.currentValue = 1;
      } else if (str == "last") {
        this.currentValue = this.max;
      } else if (str == "prev" && this.currentValue > 1) {
        this.currentValue = ~~this.currentValue - 1;
      } else if (str == "next" && this.currentValue < this.max) {
        this.currentValue = ~~this.currentValue + 1;
      }
    }
  },
  created() {
    this.max = Math.ceil(this.total / this.pageSize);
  }
};
</script>
