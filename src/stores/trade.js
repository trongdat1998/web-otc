import axios from "@/libs/axios";
export default {
  state: {
    data: {
      tokenId: sessionStorage.tokenId || window.WEB_CONFIG.defaultTokenId,
      side: sessionStorage.side || 1,
      page: sessionStorage.page || 1,
      currencyId: sessionStorage.currencyId || window.WEB_CONFIG.defaultCurrencyId,
      payment: sessionStorage.payment ? Number(sessionStorage.payment) : "",
      size: 20
    },
    hideloading:false,
    init: false,
    lastPrice: "",
    count: 0,
    items: [],
    itemsInit: false,
    paymentInit: false,
    hasPayment: false,
    asset: [],
    paymentList: []
  },
  mutations: {
    setTradeList(state, result) {
      if (result.code == 0) {
        state.items = result.data.items;
        state.count = result.data.count;
      }
    },
    setItemInit(state) {
      state.itemsInit = true;
      state.loading = false;
    },
    setTradePrice(state, payload) {
      state.lastPrice = payload.lastPrice;
    },
    setPaymentList(state, result) {
      state.init = true;
      if (result.code == 0) {
        state.paymentInit = true;
        state.paymentList = result.data;
      }
      if (result.code == 0 && result.data.length) {
        state.hasPayment = true;
      }
    },
    setAssetList(state, payload) {
      state.asset = payload;
    }
  },
  actions: {
    getLastPrice({ commit }, data) {
      axios
        .post("/api/otc/item/last_price", {
          tokenId: data.tokenId,
          currencyId: data.currencyId,
          side:data.side
        })
        .then(result => {
          if (result.code == 0) {
            commit("setTradePrice", result.data);
          }
        });
    },
    getTradeList({ commit, state }, payload) {
      Object.assign(state.data, payload);
      if (!payload.hideloading){
        state.loading = true
      }
      if (payload) {
        commit("setTradeList", []);
      }
      axios.post("/api/otc/item/list", state.data).then(result => {
        commit("setTradeList", result);
        commit("setItemInit");
      });
      this.dispatch("getLastPrice", state.data);
      Object.keys(state.data).forEach(el => {
        sessionStorage[el] = state.data[el];
      });
    },
    getPaymentList({ commit }) {
      axios.get("/api/v1/otc/payment/list").then(result => {
        commit("setPaymentList", result);
      });
    },
    getAssetList({ commit }) {
      axios.post("/api/asset/get").then(result => {
        if (result.code == 0) {
          commit("setAssetList", result.data);
        }
      });
    }
  }
};
