import { ERC20, Aggregator } from "./utils/abi";
import { maxAmount, getProxyContract, isProxyChain, isNativeToken } from "./utils/config";
import { amount2Decimals } from "./utils/number";
import { GenSdk } from "@gen-io/gen-sdk";
export const genSdk = new GenSdk({
  apiUrl: process.env.VUE_APP_API_URL,
});
const { swapSdk, api, web3 } = genSdk;
import { getPlatformFeeAccounts, Jupiter, RouteInfo } from "@jup-ag/core";
import { PublicKey } from "@solana/web3.js";

export const INPUT_MINT_ADDRESS = "So11111111111111111111111111111111111111112"; // SOL
export const OUTPUT_MINT_ADDRESS =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC

export const init = async () => {
  const { chain, wallet, account } = store.state;
  if (!chain || !wallet || !account) return;

  const { connect } = getWallet(wallet);
  await tryConnect(chain, wallet, connect);
};

export const tryConnect = async (chain, walletName) => {
  try {
    const params = {
      chain,
      walletName: walletName.replace(/\s+/gi, ""),
    };
    console.log("tryConnect params", params);
    const result = await swapSdk.connectWallet(params);
    console.log("tryConnect result", result);
    return result;
  } catch (e) {
    console.log("tryConnect error", e);
    return null;
  }
};

export const sendApproveTo = async (
  chain,
  tokenAddress,
  contractAddress,
  type,
  amount,
  decimals,
  gasPrice
) => {
  try {
    const proxyContract = getProxyContract(chain) || contractAddress;
    amount = type === "1" ? maxAmount : amount2Decimals(amount, +decimals);
    const params = {
      chain,
      tokenAddress,
      contractAddress: proxyContract,
      amount,
      gasPrice,
      tokenAbi: ERC20,
    };
    console.log("sendApproveTo params", params);
    const result = await swapSdk.approve(params);
    console.log("sendApproveTo result", result);
    return result;
  } catch (e) {
    console.log("sendApproveTo error", e);
    return null;
  }
};

export const getAllowance = async (chain, account, token, approveContract) => {
  try {
    const { address, decimals } = token;
    const proxyContract = getProxyContract(chain) || approveContract;
    const params = {
      account,
      chain,
      tokenAddress: address,
      approveContract: proxyContract,
      decimals,
    };
    console.log("getAllowance params", params);
    const result = await swapSdk.getAllowance(params);
    console.log("getAllowance result", result);
    return result;
  } catch (e) {
    console.log("getAllowance error", e);
    return null;
  }
};

export const getBalance = async (chain, account, token) => {
  try {
    const { address, decimals } = token;
    const params = {
      account,
      chain,
      tokenAddressOrSymbol: address,
      decimals,
    };
    console.log("getBalance params", params);
    const result = await swapSdk.getBalance(params);
    console.log("getBalance result", result);
    return result;
  } catch (e) {
    console.log("getBalance error", e);
    return null;
  }
};

export const getTokenByAddress = async (chain, address) => {
  try {
    const params = {
      chain,
      address,
      wallet: swapSdk && swapSdk.wallet && swapSdk.wallet.sdk,
    };
    console.log("getTokenByAddress params", params);
    const result = await api.getTokenByAddress(params);
    console.log("getTokenByAddress result", result);
    return result;
  } catch (e) {
    console.log("getTokenByAddress error", e);
    return null;
  }
};

export const isTokenAddress = (address) => {
  try {
    console.log("isTokenAddress params", address);
    const result = web3.utils.isAddress(address);
    console.log("isTokenAddress result", result);
    return result;
  } catch (e) {
    console.log("isTokenAddress error", e);
    return false;
  }
};

export const getGas = async (swapData) => {
  try {
    const { params = {} } = swapData || {};
    const { chain } = params || {};
    let result = "";
    if (isProxyChain(chain)) {
      result = await swapSdk.getGasLocal(swapData);
    } else {
      result = await swapSdk.getGas(swapData);
    }
    return result;
  } catch (e) {
    console.log("getGas error", e);
    return 0;
  }
};

export const swap = async (swapData) => {
  try {
    const { params = {} } = swapData || {};
    const { chain } = params || {};
    let hash = "";
    if (isProxyChain(chain)) {
      hash = await swapSdk.fastSwapLocal(swapData);
    } else if (chain === "solana") {
      hash = await swapSdk.fastSwap(swapData);
      // hash = await jupiterDex(swapData);
    } else {
      hash = await swapSdk.fastSwap(swapData);
    }
    // const myWallet = swapSdk.wallet.sdk;
    // const contract = new myWallet.eth.Contract(Aggregator, getProxyContract('okex'));
    // const { to, inAmount, outAmount, inToken, outToken, account } = swapData;
    // const invitee = account;
    // // const path = [inToken.address, "0x8f8526dbfd6e38e3d8307702ca8469bae6c56c15", "0x0000000000000000000000000000000000000000"];
    // const path = outToken.wrapAddress ? [inToken.address, outToken.wrapAddress, outToken.address] : [inToken.address, outToken.address];
    // const amounts = [inAmount, outAmount];
    // const swapAddr = to;
    // const swapExtraData = swapData.data;
    // const { transactionHash } = await contract.methods
    //   .swap(invitee, path, amounts, swapAddr, swapExtraData)
    //   .send({
    //     from: account,
    //     value: isNativeToken(inToken.address) ? inAmount : 0,
    //   });
    // hash = transactionHash;
    // console.log("swap result", hash);
    return {
      status: "success",
      hash,
    };
  } catch (e) {
    console.log("swap error", e);
    return {
      status: "rejected",
      message: typeof e === "string" ? e : e.message,
    };
  }
};

export const getRouteInfo = async (routes) => {
  const { routesInfos } = routes;
  for (var i = 0; i < routesInfos.length; i++) {
    const { getDepositAndFee } = routesInfos[i];
    // const success = marketInfos.every((item) => {
    //   return item.notEnoughLiquidity === false && item.amm && item.amm.label != 'Raydium';
    // });
    try {
      const result = await getDepositAndFee();
      if (result) {
        return routesInfos[i];
      }
    } catch(e) {
      console.log('getRouteInfo', e);
    }
  }
};

// index.ts
export const jupiterDex = async (swapData) => {
  const wallet = swapSdk.wallet.sdk;
  const connection = swapSdk.wallet.connection;
  const { inToken, outToken, inAmount, params } = swapData;
  const { slippage = 1 } = params || {};
  console.log("inToken, outToken, inAmount", inToken, outToken, inAmount);
  console.log("ready-----------------");
  const feeBps = 50;
  const feeAccount = new PublicKey(
    "BGpoE1MUhfqyAX9kfrMERjaUqMT4XwF1j5jq5HAGD82V"
  );
  // The platform fee account owner
  // const platformFeeAndAccounts = {
  //   feeBps,
  //   feeAccounts: await getPlatformFeeAccounts(connection, feeAccount),
  // };
  // console.log("platformFeeAndAccounts", platformFeeAndAccounts);
  // Setup Solana RPC connection
  const jupiter = await Jupiter.load({
    connection,
    cluster: "mainnet-beta",
    user: wallet.publicKey, // or public key
    // platformFeeAndAccounts
  });
  console.log("jupiter-----------------");
  console.log(jupiter);
  const routes = await jupiter.computeRoutes({
    inputMint: new PublicKey(inToken.address),
    outputMint: new PublicKey(outToken.address),
    inputAmount: inAmount,
    slippage,
    forceFetch: true,
    // onlyDirectRoutes: true
    // feeBps
  });
  console.log("routes-----------------");
  console.log(routes);
  const routeInfo = await getRouteInfo(routes);
  // Prepare execute exchange
  const { execute } = await jupiter.exchange({
    routeInfo,
    // feeAccount,
    userPublicKey: wallet.publicKey,
    // wrapUnwrapSOL: true
  });
  // Execute swap
  const swapResult = await execute({
    wallet: {
      sendTransaction: null,
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    },
  });
  console.log("swap-----------------");
  console.log(swapResult);
  if (swapResult.error) {
    throw new Error(swapResult.error);
  } else {
    return swapResult.txid;
  }
};
