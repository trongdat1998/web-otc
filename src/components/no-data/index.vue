<template lang="pug">
.broker-nodata.color-grey-500
  img(src="@/assets/empty.png")
  p {{$lang('暂无数据')}}
</template>
<script>
export default {
  name: "NoData",
};
</script>
