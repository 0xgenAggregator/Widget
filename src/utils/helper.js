export function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
}

export function confirmLater(promise) {
  return new Promise((resolve, reject) => {
    promise.on("transactionHash", resolve);
    promise.on("error", reject);
    function onConfirm(confNumber, receipt) {
      promise.off("confirmation", onConfirm);
    }
    promise.on("confirmation", onConfirm);
  });
}


export function debounce(fn, delay) {
  var delay = delay || 200;
  var timer;
  return function () {
      var th = this;
      var args = arguments;
      if (timer) {
          clearTimeout(timer);
      }
      timer = setTimeout(function () {
          timer = null;
          fn.apply(th, args);
      }, delay);
  };
}

export function throttle(fn, interval) {
  var last;
  var timer;
  var interval = interval || 200;
  return function () {
      var th = this;
      var args = arguments;
      var now = +new Date();
      if (last && now - last < interval) {
          clearTimeout(timer);
          timer = setTimeout(function () {
              last = now;
              fn.apply(th, args);
          }, interval);
      } else {
          last = now;
          fn.apply(th, args);
      }
  }
}

export function isApp() {
  var isIosApp = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    navigator.userAgent
  );
  var isAndroidApp = window.android ? 1 : 0;
  return isIosApp || isAndroidApp;
}

export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
