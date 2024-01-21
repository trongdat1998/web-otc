import axios from "@/libs/axios";
export default {
  state: {
    formData: {
      tokenId: window.WEB_CONFIG.defaultTokenId, //| string| 必填 | token |  |
      currencyId: window.WEB_CONFIG.defaultCurrencyId, //| string | 必填 | 法币 |  |
      side: 1, //| int | 必填 | 订单方向，参数：0=买 1=卖 |  |
      priceType: 0, //| int | 必填 | 定价类型 0-固定价格；1-浮动价格 |  |
      price: "", //| string | 非必填 | 交易价格 |  |
      quantity: "", //| string | 必填 | 交易数量 |  |
      premium: "", //| string | 非必填 | 溢价比例 |  |
      minAmount: "", //| string | 必填 | 最小交易额 |  |
      maxAmount: "", //| string | 必填 | 最大交易额 |  |
      remark: "", //| string | 非必填 | 交易备注|  |
      tradePwd: "" //| string | 非必填 | 资金密码（首次交易时需要） |  |
    },
    // 深度
    depth: {
      asks: [
        {
          price: "123", //价格
          quantity: "1234", //数量
          size: 2 //单量
        },
        {
          price: "12", //价格
          quantity: "12345", //数量
          size: 3 //单量
        },
        {
          price: "1", //价格
          quantity: "125", //数量
          size: 8 //单量
        }
      ],
      bids: [
        {
          price: "123", //价格
          quantity: "1234", //数量
          size: 1 //单量
        },
        {
          price: "12", //价格
          quantity: "12345", //数量
          size: 4 //单量
        },
        {
          price: "1", //价格
          quantity: "125", //数量
          size: 9 //单量
        }
      ]
    }
  },
  mutations: {
    setDepth(state, payload) {
      state.depth = payload.data;
    }
  },
  actions: {
    // 读取深度数据
    async getDepth({ commit }, payload) {
      const result = await axios.post("/api/otc/item/depth", { ...payload });
      if (result.code === 0) {
        commit("setDepth", {
          data: result.data
        });
      }
    },
    editOffer({ state }, payload) {
      Object.assign(state.formData, payload);
    }
  }
};
