export const CACHE_KEY = {
  Account: "gen_account",
  wallet: "gen_wallet",
  Chain: "gen_chain",
  Theme: "gen_theme",
  From: "gen_from",
  To: "gen_to",
  Tolerance: "gen_tolerance",
  Config: "gen_config",
  Custom: "gen_custom",
};

export const getCache = (key, def) => {
  return window.localStorage.getItem(key) || def || "";
};

export const setCache = (key, account) => {
  window.localStorage.setItem(key, account);
};
