<style lang="less" scoped>
.item {
  .col {
    padding: 17px 0;
  }
  .line {
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
  .Subtitle1{
    line-height: 32px;
    padding: 8px 0;
  }
}
</style>
<template lang="pug">
Row.item
  Col.col(span="8")
    p.Subtitle1 {{title}}
  Col.col.line.border-grey-100(span="16")
    slot
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
