import axios from "axios";
import Helper from "@/libs/helper";
// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    let cost = new Date().getTime() - response.config.timestamp;
    if (!/\/analyze/.test(response.config.url)) {
      let obj = {
        type: "api_call",
        cost: cost,
        request_url: response.config.url,
        http_code: response.status
      };
      if (response.data && response.data.msg) {
        obj.error_code = response.data.code;
        obj.error_message = response.data.msg;
      }
      window.trackPageError(obj);
    }

    let json = {
      code: 0,
      msg: "ok",
      data: {}
    };
    if (response.status == 200) {
      json.data = response.data;
    } else {
      response.data &&
        response.data.msg &&
        window.___VUE__VM___.$tips.error(response.data.msg);
      json.code = response.status;
      Object.assign(json, response.data);
      if (response.data && response.data.code === 30000) {
        Helper.goLogin();
      }
    }
    return json;
  },
  function(error) {
    return error;
  }
);
axios.defaults.transformRequest = [
  function(data) {
    var ret = [];
    for (var it in data) {
      ret.push(encodeURIComponent(it) + "=" + encodeURIComponent(data[it]));
    }
    return ret.join("&");
  }
];
axios.interceptors.request.use(config => {
  let c_token = Helper.cookie("c_token");
  if (c_token) {
    config.url = [config.url, ["c_token", c_token].join("=")].join(
      config.url.indexOf("?") > -1 ? "&" : "?"
    );
  }
  config.timestamp = new Date().getTime();
  return config;
});

axios.defaults.validateStatus = function(status) {
  return status >= 200 && status < 1000;
};
axios.defaults.responseType = "json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.headers["Accept-Language"] = window.WEB_CONFIG
  ? window.WEB_CONFIG.LANG
  : "en-us";
export default axios;
