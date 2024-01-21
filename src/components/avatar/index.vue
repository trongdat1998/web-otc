<template lang="pug">
span.broker-avatar.color-primary-text(:style="style")
  slot
</template>
<script>
export default {
  name: "Avatar",
  props: {
    color: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      background: [
        "#54E19E",
        "#66A3FF",
        "#38a1e6",
        "#E2C97F",
        "#7887C5",
        "#68B38F",
        "#8B58DF",
        "#66D0D7",
        "#BEC65D",
        "#F4934D"
      ]
    };
  },
  computed: {
    style() {
      if (this.color) {
        return { backgroundColor: this.background[this.color % 10] };
      } else {
        return {};
      }
    }
  }
};
</script>
