/* eslint-disable no-bitwise */
import { getFixed, getTimes, isGte, isLte, isNumber } from "./number";

// formatAmount
export const formatUsdt = (val) => getFixed(val, 8);

export const formatPrice = (val) => {
  if (isLte(val, 1) && isGte(val, -1)) {
    // -1 -> 1
    return getFixed(val, 6);
  }
  return getFixed(val, 4);
};

export const formatBalance = (val) => {
  if (!isNumber(val)) {
    return "--";
  }
  return getFixed(val, 6);
};

export const formatLongStr = (val, start = 6, end = 6, mid = "...") => {
  if (val.length > start + end) {
    return `${val.substr(0, start)}${mid}${val.substr(val.length - end, end)}`;
  }
  return val;
};

export const formatPercent = (val) => `${getTimes(val, 100)}%`;

export const formatDateLabel = (date, fmt) => {
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));

  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
  return fmt;
};

export const formatDate = (time, Delimiter) => {
  Delimiter = Delimiter || "-";
  const now = new Date(time * 1000);
  const year = `${now.getFullYear()}`;
  let month = `${now.getMonth() + 1}`;
  let date = `${now.getDate()}`;
  let hour = `${now.getHours()}`;
  let minute = `${now.getMinutes()}`;
  let second = `${now.getSeconds()}`;
  month = month.length < 2 ? `0${month}` : month;
  date = date.length < 2 ? `0${date}` : date;
  hour = hour.length < 2 ? `0${hour}` : hour;
  minute = minute.length < 2 ? `0${minute}` : minute;
  second = second.length < 2 ? `0${second}` : second;

  return `${year + Delimiter + month + Delimiter + date} ${hour}:${minute}:${second}`;
};

export function formatNumber(number, dec = 2, dsep, tsep) {
  if (number === 0) return 0;

  if (isNaN(+number) || number == null) return "";

  number = parseFloat(number);

  number = number.toFixed(~~dec);

  tsep = typeof tsep === "string" ? tsep : ",";

  const parts = number.split(".");
  const fnums = parts[0];
  const decimals = parts[1] ? (dsep || ".") + parts[1] : "";

  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, `$1${tsep}`) + decimals;
}

export function formatAccount(account) {
  return account && account.length > 10
    ? account.substring(0, 6) + "****" + account.substring(account.length - 4)
    : account;
}

export function formatHash(hash) {
  if (!hash) return "--";
  return hash.substring(0, 12) + "****" + hash.substring(hash.length - 12);
}

export default {
  install(Vue) {
    Vue.filter("formatNumber", formatNumber);
    Vue.filter("formatUsdt", formatUsdt);
    Vue.filter("formatPrice", formatPrice);
    Vue.filter("formatBalance", formatBalance);
    Vue.filter("formatLongStr", formatLongStr);
    Vue.filter("formatPercent", formatPercent);
    Vue.filter("formatDate", formatDate);
    Vue.filter("formatAccount", formatAccount);
    Vue.filter("formatHash", formatHash);
  },
};
