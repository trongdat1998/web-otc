<template lang="pug">
.broker-header
  .broker-header-content.bg-black-800.Shadow1
    .broker-header-left
      .broker-header-logo
        a(:href="'/'|formatUrl" v-if="common.logo")
          img(:src="common.logo")
      .broker-header-menu.Body1
        template(v-for="item in links")
          Dropdown(v-if="item.children&&item.children.length")
            a.color-common-surface(:href="item.link" :target="item.blank?'_blank':''" rel="noopener noreferrer nofollow") {{item.text}}
              span.tag.color-common-text(v-if="item.color&&item.tag" :style="{background:item.color}") {{item.tag}}
                em(:style="{borderLeftColor:item.color}")
              Icon(type="arrowDown" size="24")
            DropdownMenu.Shadow3(slot="list")
              a.color-common-text.hoverbg-grey-50(v-for="_item in item.children" :href="_item.link" :target="_item.blank?'_blank':''" rel="noopener noreferrer nofollow") {{_item.text}}
          a.color-common-surface(:href="item.link", :target="item.blank?'_blank':''" rel="noopener noreferrer nofollow" v-else) {{item.text}} 
            span.tag.color-common-text(v-if="item.color&&item.tag" :style="{background:item.color}") {{item.tag}}
              em(:style="{borderLeftColor:item.color}")
    
    .broker-header-right.Body1
      .broker-header-sub.broker-header-nologin(v-if="!common.username"  key="nologin")
        a.color-common-surface(:href="'/login'|formatLoginUrl") {{$lang('登录')}}
        a.color-common-surface(:href="'/register'|formatLoginUrl") {{$lang('注册')}}
      .broker-header-sub(v-else key="islogin")
        Dropdown(placement="bottom-end")
          a.color-common-surface(:href="'/finance/'|formatUrl") {{$lang('资产')}}
            Icon(type="arrowDown" size="24")
          DropdownMenu.Shadow3(slot="list")
            a.color-common-text.hoverbg-grey-50(:href="'/finance/'|formatUrl" v-if="common.functions.exchange") {{$lang("钱包资产")}}
            a.color-common-text.hoverbg-grey-50(:href="'/margin/finance'|formatUrl" v-if="common.functions.margin") {{$lang("杠杆资产")}}
            a.color-common-text.hoverbg-grey-50(:href="'/contract/finance'|formatUrl" v-if="common.functions.futures") {{$lang("永续合约资产")}}
            a.color-common-text.hoverbg-grey-50(:href="'/bonus/finance'|formatUrl"  v-if="common.functions.bonus") {{$lang("币多多资产")}}
            a.color-common-text.hoverbg-grey-50(:href="'/finance/child'|formatUrl") {{$lang("子账户资产")}}
            a.color-common-text.hoverbg-grey-50(:href="'/finance/activtiy'|formatUrl" v-if="common.baseInfo.leader") {{$lang("活动账户")}}
        Dropdown(placement="bottom-end")
          a.color-common-surface(:href="'/order'|formatUrl") {{$lang('订单')}}
            Icon(type="arrowDown" size="24")
          DropdownMenu.Shadow3(slot="list")
            a.color-common-text.hoverbg-grey-50(:href="'/order'|formatUrl" v-if="common.functions.exchange") {{$lang("币币订单")}}
            a.color-common-text.hoverbg-grey-50(:href="'/otc/order'" v-if="common.functions.otc") {{$lang("法币订单")}}
            a.color-common-text.hoverbg-grey-50(:href="'/margin/order'" v-if="common.functions.margin") {{$lang("杠杆订单")}}
            a.color-common-text.hoverbg-grey-50(:href="'/option/order/current_entrust'|formatUrl" v-if="common.functions.option") {{$lang("期权订单")}}
            a.color-common-text.hoverbg-grey-50(:href="'/contract/order/position'|formatUrl" v-if="common.functions.futures") {{$lang("永续合约订单")}}
        Dropdown
          a.color-common-surface(href="")
            Icon(type="user" size="22")
          DropdownMenu.Shadow3(slot="list")
            .broker-header-sub-user.border-grey-100
              img(src="../../assets/face.png")
              strong {{common.username}}
            a.color-common-text.hoverbg-grey-50(:href="'/user'|formatUrl") {{$lang("用户中心")}}
            a.color-common-text.hoverbg-grey-50(:href="'/user/grade'|formatUrl" v-if="common.functions.userLevel") {{$lang("我的等级")}}
            a.color-common-text.hoverbg-grey-50(:href="'/captain/index'|formatUrl" v-if="common.baseInfo.leader") {{$lang("霍比特队长")}}
            a.color-common-text.hoverbg-grey-50(:href="'/user/invite'|formatUrl" v-else) {{$lang("我的邀请")}}
            a.color-common-text.hoverbg-grey-50(:href="'/broker'|formatUrl" v-if="common.baseInfo.isAgent") {{$lang("经纪人管理")}}
            a.color-common-text.hoverbg-grey-50(@click="logout") {{$lang("退出")}}
      .broker-header-note.Body2(v-if="common.indexConfig.announcements.length")
        Dropdown(placement="bottom-end")
          a.color-common-surface(href="" @click="read")
            Badge(:dot="dot" :count="dot?1:0")
              Icon(type="announcement" size="24")
          DropdownMenu.Shadow3(slot="list")
            .broker-header-note-title.Subtitle2.border-grey-100 {{$lang("公告中心")}}
            a.color-common-text.hoverbg-grey-50(v-for="item in common.indexConfig.announcements" :href="item.directUrl" target="_blank" rel="noopener noreferrer nofollow") {{item.title}}
              p.color-grey-200 {{new Date(item.publishTime*1).format('yyyy-MM-dd')}}
            a.broker-header-note-more.color-common-text(rel="noopener noreferrer nofollow" :href="common.indexConfig.announcementMoreUrl" v-if="common.indexConfig.announcementMoreUrl") {{$lang('查看更多')}} >
      .broker-header-download(v-if="common.indexConfig.shareConfig&&common.indexConfig.shareConfig.openUrlImgBase64")
        Poptip(placement="bottom" trigger="hover" word-wrap)
          a.Body1.color-common-surface(:href="common.indexConfig.shareConfig.openUrl" target="_blank" rel="noopener noreferrer nofollow")
            Icon(type="download" size="15")
          div(slot="content")
            .broker-header-download-text.Subtitle2 {{$lang("官方APP下载")}}
            img(:src="'data:image/png;base64,'+common.indexConfig.shareConfig.openUrlImgBase64")
      .broker-header-select(v-if="common.supportLanguages.length>1")
        Dropdown(placement="bottom-end")
          a.color-common-surface(v-for="item in common.supportLanguages" v-if="item.lang==locale") {{item.text}}
            Icon(type="arrowDown" size="24")
          DropdownMenu.Shadow3(slot="list")
            a.color-common-text.hoverbg-grey-50(@click="setLocale(item.lang)" v-for="(item,key) in common.supportLanguages" :key="key") {{item.text}}
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Icon from '../icon/index.vue'
import Helper from '@/libs/helper'
const link = {
  otc: '/',
  exchange: Helper.formatUrl('/exchange'),
  option: Helper.formatUrl('/option/quote'),
  explore: Helper.formatUrl('/explore/busdt'),
  guild: Helper.formatUrl('/guild'),
  bonus: Helper.formatUrl('/bonus/'),
  futures: Helper.formatUrl('/contract/quote'),
  margin: Helper.formatUrl('/cross-margin'),
}

export default {
  name: 'Header',
  components: { Icon },
  data() {
    return {
      locale: window.WEB_CONFIG.LANG,
      announcementsPublishTime: localStorage.announcementsPublishTime || '',
    }
  },
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    formatUrl: Helper.formatUrl,
    formatLoginUrl: Helper.formatLoginUrl,
  },
  computed: {
    links() {
      let arr = []
      this.common.indexConfig.headConfigList.forEach((el) => {
        if (el.system && link[el.link]) {
          el.link = link[el.link]
        } else {
          if (/^\//.test(el.link)) {
            el.link = Helper.formatUrl(el.link)
          }
        }

        if (el.children && el.children.length) {
          el.children.forEach((_el) => {
            if (/^\//.test(_el.link)) {
              _el.link = Helper.formatUrl(_el.link)
            }
          })
        }
        arr.push(el)
      })
      return arr
    },
    dot() {
      let c = this.common.indexConfig.announcements
      return !!(c.length && this.announcementsPublishTime != c[0].publishTime)
    },
    ...mapState(['common']),
  },
  methods: {
    ...mapActions(['setCookie']),
    setLocale(lang) {
      this.setCookie({ name: 'locale', value: lang, expires: 3000 })
      let query = this.$route.query.lang
      if (query) {
        window.location.href = window.location.href.replace(
          'lang=' + query,
          'lang=' + lang
        )
      } else {
        window.location.reload()
      }
    },
    logout() {
      this.$axios.get('/api/user/authorize_cancel').then((result) => {
        if (result.code == 0) {
          location.href = '/'
        }
      })
    },
    read() {
      let c = this.common.indexConfig.announcements
      if (c.length) {
        this.announcementsPublishTime = c[0].publishTime
        localStorage.announcementsPublishTime = c[0].publishTime
      }
    },
  },
  created() {
    if (this.common.isLogin) {
      this.$store.dispatch('setBaseInfo')
    }
  },
}
</script>
