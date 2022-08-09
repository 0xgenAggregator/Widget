import BigNumber from "bignumber.js";

export const maxAmount = BigNumber(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
).toFixed(0, 1);

export const nativeToken = [
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0x0000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000001010"
];

export const isNativeToken = (address) => {
  return address && nativeToken.indexOf(address.toLowerCase()) >= 0;
};

export const VIEW_ON = {
  eth: "View On Etherscan",
  ropsten: "View On Ropsten",
  bsc: "View On BscScan",
  bsctest: "View On TestBscScan",
  ont: "View On OntExplorer",
  tron: "View On TronScan",
  solana: "View On Solana",
  polygon: "View On Polygon",
  xdai: "View On Gnosis",
  fantom: "View On Fantom",
  heco: "View On Heco",
  avax: "View On Avalanche",
  okex: "View On OKEX",
  arbitrum: "View On Arbitrum",
  optimism: "View On Optimism",
  boba: "View On Boba",
  terra: "View On Terra",
  moonriver: "View On Moonriver",
  aurora: "View On Aurora",
  cronos: "View On Cronos",
  harmony: "View On Harmony",
  osmosis: "View On Osmosis",
  sifchain: "View On Sifchain",
};

export const isProxyChain = (chain) => {
  return !!getProxyContract(chain);
};

export const getProxyContract = (chain) => {
  return {
    eth: '0x6D618Fa3B8daBADC4ac07411e0389F9945c89DcF',
    aurora: "0x112625b193de963fcb12028c716e9e7f3949610a",
    bsc: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    fantom: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    avax: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    polygon: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    okex: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    optimism: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    harmony: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    cronos: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    moonriver: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    arbitrum: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    heco: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    boba: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    xdai: "0x7AeEF1035Ba6794C0478718a2330671Ec8802aF1",
    tron: "TKEYTVD8QzmmswvRv1SDGWc9yPCooLLj4a"
  }[chain];
};
