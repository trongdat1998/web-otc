<style lang="less" scoped>
.order_detail {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 300;
  left: 0;
  top: 0;
  overflow-x: auto;
  &.hidden {
    height: 56px;
    bottom: 0;
    top: auto;
    box-shadow: 0px -1px 1px rgba(36, 43, 50, 0.1);
  }
}
.footer {
  height: 56px;
  min-width: 1150px;
  width: 100%;
  position: absolute;
  z-index: 200;
  left: 0;
  top: 0px;
  .con {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 56px;
  }
  .title {
    display: flex;
    align-items: center;
    padding: 0 0 0 24px;
  }
  .back {
    margin: 0 30px 0 0;
    display: flex;
    align-items: center;
    span {
      margin: 0 8px 0 0;
      cursor: pointer;
    }
  }
  .bg {
    width: 100%;
    height: 100%;
    opacity: 0.1;
  }
}
</style>

<template lang="pug">
// 浮在下方的状态
.order_detail.hidden(v-if="!hide")
  .footer.bg-common-background
    .bg.bg-secondary-light
    .con
      .title 
        .desc.Caption.color-secondary-text {{$lang("请完善个人信息后再进行法币操作")}} 
          router-link.color-primary-main(:to="{name:'settings'}") {{$lang("去设置")}}
      .back 
        span.Button.color-secondary-dark(@click="skip") {{$lang("跳过")}}
</template>
<script>
export default {
  data() {
    return {
      hide: sessionStorage.hide
    };
  },
  methods: {
    skip() {
      sessionStorage.hide = true;
      this.hide = true;
    }
  }
};
</script>