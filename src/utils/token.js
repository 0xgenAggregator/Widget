export const tokenList = [
  {
    code: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    icon: "icon-bnb.svg",
    decimals: "18",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    code: "binance-usd",
    name: "Binance-Peg BUSD Token",
    symbol: "BUSD",
    icon: "icon-busd.svg",
    decimals: "18",
    address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  }
].map((item) => {
  item.icon = `https://s3.0xgen.io/token/${item.icon}`;
  return {
    balance: 0,
    approve: 0,
    ...item
  };
});

export const getTokenBySymbol = (symbol) => {
  const list = tokenList.filter((item) => {
    return symbol === item.symbol;
  });
  return list && list[0];
};
