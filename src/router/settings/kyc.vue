<style lang="less" scoped>
.info {
  padding: 8px 0;
  line-height: 32px;
}
</style>
<template lang="pug">
Item(:title="$lang('实名认证')")
  template(v-if="verifyInfo.verifyStatus==2")
    Row.info(:gutter="16")
      Col.color-grey-500(span="6") {{$lang("姓名")}}:
      Col(span="12") {{verifyInfo.firstName}} {{verifyInfo.secondName}}
    Row.info(:gutter="16")
      Col.color-grey-500(span="6") {{$lang("证件类型")}}:
      Col(span="12") {{verifyInfo.cardType}}
    Row.info(:gutter="16")
      Col.color-grey-500(span="6") {{$lang("证件号码")}}:
      Col(span="12") {{verifyInfo.cardNo}}
  Row.info(:gutter="16" v-else-if="verifyInfo.verifyStatus==0")
    Col.color-grey-500(span="21") {{$lang('请您实名认证后进行法币操作')}}
    Col(span="3")
      Button(type="primary" long :href="'/user/kyc'|formatUrl") {{$lang("认证")|toUP}}
  Row.info(:gutter="16" v-else-if="verifyInfo.verifyStatus==1")
    Col.color-grey-500(span="21") {{$lang('请您实名认证后进行法币操作')}}
    Col(span="3")
      Button(type="primary" long disabled) {{$lang("审核中")|toUP}}
  Row.info(:gutter="16" v-else-if="verifyInfo.verifyStatus==3")
    Col.color-grey-500(span="21") {{$lang('审核失败')}}
    Col(span="3")
      Button(type="primary" long :href="'/user/kyc'|formatUrl") {{$lang("认证")|toUP}}
</template>

<script>
import Helper from "@/libs/helper";
import Item from "./Item";
export default {
  props: {
    verifyInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  filters: {
    formatUrl: Helper.formatUrl
  },
  components: {
    Item
  }
};
</script>
