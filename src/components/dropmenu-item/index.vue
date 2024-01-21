<template lang="pug">
DropdownItem(@click.native="change")
  span(:class="{'color-primary-main':value===selectedValue}")
    slot
</template>
<script>
export default {
  name: "DropmenuItem",
  props: {
    value: {
      type: [String, Number],
      default: ""
    }
  },
  methods:{
    change(){
      this.$parent.$parent.$parent.$parent.currentValue = this.value
    }
  },
  computed: {
    selectedValue() {
      return this.$parent.$parent.$parent.$parent.currentValue;
    }
  }
};
</script>
