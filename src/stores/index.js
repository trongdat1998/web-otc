import Vue from "vue";
import Vuex from "vuex";
import axios from "@/libs/axios";
import Helper from "@/libs/helper";
import trade from "./trade";
import offer from "./offer";
Vue.use(Vuex);
let accountId = Helper.cookie("account_id");
const common = {
  state: {
    //聊天上传证明弹层
    appealModal: false,
    supportLanguages: [],
    isLogin: accountId,
    username: "",
    logo: "",
    config: {},
    color: ["#54E19E", "#66A3FF", "#F4777E", "#E2C97F", "#7887C5", "#68B38F", "#8B58DF", "#66D0D7", "#BEC65D", "#F4934D"],
    indexConfig: {
      orgId: "",
      logo: "",
      favicon: "",
      copyright: "",
      zendesk: "",
      shares: [],
      title: "",
      footConfigList: [],
      headConfigList: [],
      announcements: [],
      userAgreement: "",
      privacyAgreement: "",
      legalDescription: "",
      helpCenter: ""
    },
    baseInfo: {
      leader: 0,
      isAgent: 0,
      accounts: [],
      bindGA: false,
      defaultAccountId: "",
      email: "",
      favorites: [],
      mobile: "",
      registerDate: "",
      registerType: "",
      userId: "",
      userType: "",
      verifyStatus: "",
      whiteConfig: {
        canTrade: false,
        canWithdraw: false
      }
    },
    userInfo: {
      accountId: "",
      bindTradePwd: false,
      executeRate: 0,
      nickName: "",
      orderNum: 0,
      realName: "",
      recentOrderNum: 0,
      recentRate: 0,
      tradeFlag: 0,
      verifyFlag: false,
      whiteFlag: false
    },
    time: {
      slow: 5000,
      fast: 2000
    },
    isShare: 0,
    currency: [],
    payments: [],
    paymentTypes: {},
    spotSymbol: [],
    bank: [],
    tradeFeeRate: {},
    bankMap: {},
    tokenMap: {},
    functions: {},
    order_status: ["全部", 10, 20, 30, 40, 50]
  },
  mutations: {
    setCookie(state, payload) {
      Helper.cookie(payload.name, payload.value, {
        expires: payload.expires ? payload.expires : '',
        path: "/",
        domain: location.hostname.replace(/^otc/, "")
      });
    },
    setBaseInfo(state, payload) {
      state.baseInfo = payload;
      if (payload.registerType == 1) {
        state.username = payload.mobile || payload.email;
      } else {
        state.username = payload.email || payload.mobile;
      }
    },
    setUserInfo(state, payload) {
      offer.state.formData.currencyId = payload.currency
      state.userInfo = payload;
    },
    setConfig(state, payload) {
      state.logo = payload.logo || "";
      state.favicon = payload.favicon || "";
      Object.assign(state.indexConfig, payload);
      let link = document.createElement("link");
      link.rel = "icon";
      link.href = payload.favicon || "";
      document.getElementsByTagName("head")[0].appendChild(link);
    },
    setSymbol(state, payload) {
      let config = {
        currency: {},
        token: {}
      };
      state.token = payload.token;
      state.currency = payload.currency;
      state.spotSymbol = payload.spotSymbol;
      state.supportLanguages = payload.supportLanguages
      state.functions = payload.functions
      state.isShare = payload.isShare

      if (payload.token && payload.token.length) {
        offer.state.formData.tokenId = payload.token[0].tokenId

        payload.token.forEach(el => {
          state.tokenMap[el.tokenId] = el.tokenName
        })

      }
      // 生成支付方式地图
      payload.bank.forEach(el => {
        state.bankMap[el.bankId] = el.name;
      });

      Object.assign(state.tradeFeeRate, payload.tradeFeeRate);

      payload.token.forEach(el => {
        config.token[el.tokenId] = Object.assign({
            minQuote: "0.01",
            maxQuote: "10000000",
            scale: "2"
          },
          el
        );
      });

      payload.currency.forEach(el => {
        config.currency[el.currencyId] = Object.assign({
            minQuote: "0.01",
            maxQuote: "10000000",
            scale: "2"
          },
          el
        );
      });
      state.config = config;
    },
    setPayments(state, payload) {
      payload.forEach(el => {
        let json = JSON.parse(el);

        let views = {}

        let isPic = ""

        let items = {}

        json.items.forEach(_el => {
          if (_el.view) {
            views[_el.name] = true;
          }
          if (_el.type == 'image') {
            isPic = _el.name
          }
          items[_el.name] = _el
        })

        state.paymentTypes[json.paymentType] = {
          paymentName: json.paymentName,
          isPic: isPic,
          views: views,
          icon: json.icon,
          items: items
        }

        state.payments.push(json)
      })
    }
  },
  actions: {
    setPayments({
      commit
    }, payload) {
      commit("setPayments", payload)
    },
    setCookie({
      commit
    }, payload) {
      commit("setCookie", payload)
    },
    setBaseInfo({
      commit
    }) {
      if (window.sessionStorage && sessionStorage[accountId]) {
        commit("setBaseInfo", JSON.parse(sessionStorage[accountId]));
      }
      axios.get("/api/user/get_base_info").then(result => {
        if (result.code == 0) {
          commit("setBaseInfo", result.data);
          sessionStorage[accountId] = JSON.stringify(result.data);
        }
      });
    },
    setUserInfo({
      commit
    }) {
      axios.get("/api/otc/user/info").then(result => {
        commit("setUserInfo", result.data);
      });
    },
    appealshow({
      state
    }) {
      state.appealModal = !state.appealModal;
    },

  }
};

export default new Vuex.Store({
  modules: {
    common,
    trade,
    offer
  }
});