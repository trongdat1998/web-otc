import App from "@/app.vue";
import components from "@/components";
import tips from "@/components/tips";
import router from "@/router";
import Vue from "vue";
import VueI18n from "vue-i18n";
import store from "@/stores";
import axios from "@/libs/axios";
import Helper from "@/libs/helper";
import theme from "@/libs/theme";
import less from "less"
import "view-design/src/styles/index.less";
import "@/libs/common.less";

import ViewUI from 'view-design';
Vue.use(ViewUI);
Vue.prototype.$axios = axios;
Vue.prototype.$tips = tips;
Vue.use(VueI18n);


Object.keys(components).forEach(key => {
  Vue.component(key, components[key]);
});

Vue.filter("toUP", value => value.toLocaleUpperCase());

document.setTitle = function (title) {
  document.title = title;
};

document.setKeywords = function (keywords) {
  document.querySelector("meta[name=keywords]").content = keywords;
};
document.setDesc = function (desc) {
  document.querySelector("meta[name=description]").content = desc;
};

Object.defineProperty(Vue.prototype, "$lang", {
  value(name) {
    let t = this.$t(`['${name}']`);
    return t
  }
});



async function getLocale(lang) {

  if (!window.WEB_CONFIG && !window.WEB_CONFIG.functions || !window.WEB_CONFIG.functions.otc) {
    return location.href = Helper.formatUrl("/")
  }

  let defaultTheme = {
    primary: {
      main: "#3375E0",
      light: "#4299FF",
      dark: "#1F5DC1",
      contrastText: "#fff"
    },
    secondary: {
      main: "#FFC000",
      light: "#FFF04E",
      dark: "#F69400",
      contrastText: "#000"
    },
    error: {
      main: "#ED3756",
      light: "#FF695E",
      dark: "#99000D",
      contrastText: "#fff"
    },
    success: {
      main: "#05AD83",
      light: "#6df18e",
      dark: "#34a04f",
      contrastText: "#fff"
    },
    common: {
      contrastText: "#242b32",
      surface: "#fff",
      background: "#fff",
    },
    grey: {
      800: "#50555b",
      500: "#919598",
      200: "#d3d5d6",
      100: "#e9eaeb",
      50: "#f4f4f5"
    },
    black: {
      800: "#0A1825"
    }


  }

  if (window.WEB_CONFIG.colorTheme && window.WEB_CONFIG.colorTheme.length) {
    defaultTheme = Object.assign(defaultTheme, window.WEB_CONFIG.colorTheme[0].content)
  }

  let globalVars = {}

  Object.keys(defaultTheme).forEach(el => {
    if (typeof defaultTheme[el] === "object") {
      Object.keys(defaultTheme[el]).forEach(_el => [
        globalVars[[el, _el].join('-')] = defaultTheme[el][_el]
      ])
    }
  })

  less.render(theme, {
    globalVars: globalVars
  }, function (e, css) {
    if (e) {
      css = {
        css: e.message
      }
    }
    const style = document.createElement("style");
    style.innerHTML = css.css
    style.title = "theme"
    window.document.querySelector("head").appendChild(style)
  });


  let count = 0
  let jsLoadUrls = []

  const init = () => {
    if (count == jsLoadUrls.length) {

      let messages = {}

      if (window.WEB_LOCALES) {
        Object.assign(messages, window.WEB_LOCALES)
      }

      if (window.WEB_LOCALES_USER) {
        Object.assign(messages, window.WEB_LOCALES_USER)
      }

      let i18n = new VueI18n({
        silentTranslationWarn: true,
        locale: lang, // 语言标识
        messages: {
          [lang]: messages
        }
      });

      window.___VUE__VM___ = new Vue({
        el: "#app",
        router,
        i18n,
        store,
        render: h => h(App)
      });
    }
  }




  window.WEB_CONFIG.supportLanguages.forEach(el => {
    if (el.lang == lang) {
      jsLoadUrls = el.jsLoadUrls || []
    }
  })

  jsLoadUrls.forEach(el => {
    ! function (el) {
      let script = document.createElement("script");
      script.onload = function () {
        count++;
        init()
      };
      script.src = el;
      window.document
        .querySelector("head")
        .appendChild(script);
    }(el)
  })

  init()

}

getLocale(window.WEB_CONFIG.LANG)