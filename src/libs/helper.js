if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}

Date.prototype.format = function(format) {
  format = format || 'yyyy/MM/dd hh:mm:ss';
  let o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return format;
};

Number.prototype.cutFixed = function(n) {
  return this.toString().cutFixed(n);
};
String.prototype.cutFixed = function(n) {
  let t = this.split('.');
  let s = '000000000000000000000000000000';
  if (n) {
    if (/\./.test(this)) {
      return [t[0], (t[1] + s).substr(0, n)].join('.');
    } else {
      return [this, s.substr(0, n)].join('.');
    }
  } else {
    return this;
  }
};

let formatUrl = value => location.origin.replace('//otc.', '//www.') + value;

import Cookie from 'js-cookie';

export default {
  formatUrl,
  cookie(name, value, option = {}) {
    if (value) {
      Cookie.set(name, value, option);
    } else if (value === null) {
      Cookie.remove(name, option);
    } else {
      return Cookie.get(name);
    }
  },
  fullNumber(n) {
    return n < 10 ? `0${n}` : n;
  },
  formatLoginUrl(value) {
    return formatUrl(value) + `?redirect=${encodeURIComponent(location.href)}`;
  },
  goLogin(path) {
    console.log(path);
    localStorage.removeItem('baseInfo');
    // location.href = this.formatLoginUrl(path || "/login");
  },
  formatNumber(n, l) {
    n = n
      .replace(/[^\d.]/g, '')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    let arr = n.split('.');

    if (!l) {
      return arr[0];
    }

    if (!arr[1]) {
      return n;
    }
    let _arr = arr[1].split('');
    if (_arr.length > l) {
      _arr.length = l;
    }
    return [arr[0], _arr.join('')].join('.');
  }
};
