<template lang="pug">
div(id="main")
  router-view
</template>
<script>
  import { mapState, mapActions } from 'vuex';
  export default {
    data() {
      return {};
    },
    computed: {
      ...mapState(['common']),
    },
    methods: {
      ...mapActions(['setUserInfo', 'setPayments']),
      addZdassets(url) {
        if (document.querySelector('#ze-snippet')) return;
        var script = document.createElement('script');
        script.id = 'ze-snippet';
        script.async = true;
        script.src = url;
        script.onload = function () {
          var langObj = {
            'en-us': 'en',
            'zh-cn': 'zh-CN',
            'zh-hk': 'zh-TW',
            'th-th': 'th',
            'ko-kr': 'ko',
            'ja-jp': 'ja',
            'ru-ru': 'ru',
            'de-de': 'de',
            'es-es': 'et',
            'fr-fr': 'fr',
            'vi-vn': 'vi',
            'tr-tr': 'tr',
          };
          window.zE(function () {
            window.zE.setLocale(langObj[window.WEB_CONFIG.LANG]);
          });
        };
        document.querySelector('body').appendChild(script);
      },

      getPayments() {
        this.$axios
          .post('/api/v1/otc/payment/broker_config_list')
          .then((result) => {
            if (result.code == 0) {
              this.setPayments(result.data);
            }
          });
      },
    },
    created() {
      this.getPayments();
      this.$store.commit('setSymbol', window.WEB_CONFIG);
      this.$axios
        .get('/s_api/basic/index_config?preview=false')
        .then((result) => {
          if (result.code == 0) {
            this.$store.commit('setConfig', result.data);
            document.setTitle(result.data.title);
            document.setDesc(result.data.description);
            document.setKeywords(result.data.keywords);
            if (result.data.zendesk && /\.js/.test(result.data.zendesk)) {
              this.addZdassets(result.data.zendesk);
            }
          }
        });
      if (this.common.isLogin) {
        this.setUserInfo();
      } else {
        localStorage.removeItem('baseInfo');
      }
    },
  };
</script>
