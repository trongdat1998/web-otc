<template lang="pug">
Dropdown.broker-dropMenu(placement="bottom-end" trigger="click")
  .Body2.color-grey-500.broker-dropMenu-title.Shadow1
    | {{title}}
    Icon(type="arrowDown" size="16")
  DropdownMenu.Shadow3(slot="list")
    slot
</template>
<script>
export default {
  name: "DropMenu",
  props: {
    value: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      currentValue: this.value,
      title: ""
    };
  },
  methods: {
    change() {
      if (this.$slots.default) {
        this.$slots.default.forEach(el => {
          if (
            el.componentOptions.tag == "DropmenuItem" &&
            el.componentOptions.propsData.value === this.currentValue
          ) {
            this.title = el.elm.innerText;
          }
        });
      }
    }
  },
  watch: {
    value(val) {
      if (this.value !== this.currentValue) {
        this.currentValue = val;
      }
    },
    currentValue() {
      if (this.value !== this.currentValue) {
        this.$emit("input", this.currentValue);
        this.$emit("change", this.currentValue);
        this.change()
      }
    }
  },
  updated(){
    this.change()
  },
  mounted() {
    this.change()
  }
};
</script>
