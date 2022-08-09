<template>
  <div class="gen-widget" :class="{ normal: normal }">
    <SwapSidebar />
    <div class="gen-widget__content">
      <div class="widget">
        <SwapToast :message="message" :status="status" :timestamp="timestamp" />
        <div
          class="widget-list"
          :style="{
            transform: `translateX(${-1 * (page === 'swap' ? 0 : 1) * 420}px)`,
          }"
        >
          <SwapModule class="swap">
            <SwapChain
              slot="module__head"
              :chain="chain"
              :theme="theme"
              :chain-list="chainList"
              @changeChain="changeChain"
              @changeTheme="changeTheme"
              @refresh="refresh"
              @setting="setPage('setting')"
            />
            <SwapCore
              :from="from"
              :to="to"
              :account="account"
              :chain="chain"
              :tolerance="tolerance"
              :refresh-time="refreshTime"
              :page="page"
              @select="showSelectToken"
              @connect="connectWallet"
              @switch="switchToken"
              @confirm="confirm"
              @error="showToast"
            />
          </SwapModule>
          <SwapModule
            title="Setting"
            class="setting"
            @back="setPage('swap')"
            v-show="page === 'setting'"
          >
            <SwapSetting
              :tolerance="tolerance"
              @changeTolerance="changeTolerance"
              @error="showToast"
            />
          </SwapModule>
          <SwapModule
            title="Select a token"
            class="token"
            @back="setPage('swap')"
            v-if="page === 'token'"
          >
            <SwapToken
              :token-list="tokenList"
              :chain="chain"
              @select="hideSelectToken"
              @remove="removeToken"
            />
          </SwapModule>
          <SwapModule
            title="Confirm"
            class="confirm"
            @back="setPage('swap')"
            v-show="page === 'confirm'"
          >
            <SwapConfirm
              :show="page === 'confirm'"
              :from="from"
              :to="to"
              :chain="chain"
              :account="account"
              :swap-res="swapRes"
              :tolerance="tolerance"
              :native-token="nativeToken"
              @confirm="confirmSwap"
              @approve="approve"
            />
          </SwapModule>
          <SwapModule
            :title="swapInfo.title"
            class="progress"
            @back="setPage('swap')"
            v-show="page === 'progress'"
          >
            <SwapProgress
              :chain="chain"
              :swapInfo="swapInfo"
              :blockExplorerUrl="blockExplorerUrl"
              @close="setPage('swap')"
            />
          </SwapModule>
          <SwapModule
            title="Connect"
            class="connect"
            @back="setPage('swap')"
            v-show="page === 'connect'"
          >
            <SwapConnect :chain="chain" @connect="connect" />
          </SwapModule>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SwapCore from "./components/SwapCore";
import SwapToken from "./components/SwapToken";
import SwapModule from "./components/SwapModule";
import SwapSetting from "./components/SwapSetting";
import SwapProgress from "./components/SwapProgress";
import SwapConnect from "./components/SwapConnect";
import SwapConfirm from "./components/SwapConfirm";
import SwapChain from "./components/SwapChain";
import SwapToast from "./components/SwapToast";
import SwapSidebar from "./components/SwapSidebar";
import { getTokenBySymbol } from "./utils/token";
import { tryConnect, getBalance, getAllowance, swap, genSdk } from "./init";
import { CACHE_KEY, getCache, setCache } from "@/utils/cache";
import { isApp, getQueryString, debounce } from "@/utils/helper";
const { api } = genSdk;

export default {
  components: {
    SwapCore,
    SwapChain,
    SwapToken,
    SwapToast,
    SwapModule,
    SwapConnect,
    SwapSetting,
    SwapConfirm,
    SwapProgress,
    SwapSidebar,
  },
  data() {
    const chain = getCache(CACHE_KEY.Chain, "bsc");
    const theme = getCache(CACHE_KEY.Theme, "dark");
    const fromSymbol = getCache(CACHE_KEY.From, "OOE");
    const toSymbol = getCache(CACHE_KEY.To, "BUSD");
    const from = getTokenBySymbol(fromSymbol);
    const to = getTokenBySymbol(toSymbol);
    const tolerance = getCache(CACHE_KEY.Tolerance, "3");
    return {
      page: "swap",
      customer: "test",
      isSelectType: "from",
      theme,
      chain,
      chainId: 56,
      chainList: [],
      tokenList: [],
      account: "",
      nativeToken: {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
        name: "BNB",
        symbol: "bnb",
        price: 0,
      },
      from,
      to,
      tolerance,
      blockExplorerUrl: "",
      timeout: null,
      swapRes: {},
      swapInfo: {
        title: "Waiting for confirmation",
      },
      message: "Waiting for confirmation",
      status: "error",
      timestamp: 0,
      refreshTime: 0,
      normal: window.self === window.top,
      interval: null
    };
  },
  mounted() {
    this.setTheme();
    this.load();
    const domain = getQueryString("domain");
    if (domain) {
      document.domain = unescape(domain);
    }
  },
  methods: {
    setPage(page) {
      console.log("setPage", page);
      this.page = page;
    },
    connectWallet() {
      if (isApp()) {
        this.tryConnect();
      } else {
        this.setPage("connect");
      }
    },
    async load() {
      await this.loadConfig();
      this.loop();
    },
    async loop() {
      setTimeout(() => {
        this.loop();
      }, 15000);
    },
    async loadConfig() {
      let config = getCache(CACHE_KEY.Config);
      if (config) {
        config = JSON.parse(config);
        this.asyncConfig();
      } else {
        config = await this.asyncConfig();
      }
      this.chainList = config;
      const chain = config.filter((item) => {
        return item.chain === this.chain;
      });
      if (chain && chain[0]) {
        this.changeChain(chain[0], true);
      }
    },
    async asyncConfig() {
      const { data } = await api.config({ code: this.customer });
      setCache(CACHE_KEY.Config, JSON.stringify(data));
      return data;
    },
    async tryConnect() {
      const account = getCache(CACHE_KEY.Account);
      if (isApp()) {
        const sdk = await tryConnect(this.chain, "MetaMask");
        this.connect(sdk);
      } else if (account) {
        const wallet = getCache(CACHE_KEY.Wallet);
        console.log("tryConnect", this.chain);
        const sdk = await tryConnect(this.chain, wallet);
        this.connect(sdk);
      }
    },
    getTokenBySymbol(tokenList, symbol) {
      let list = tokenList.filter((item) => {
        return symbol === item.symbol;
      });
      if (!list || !list.lenth) {
        let temp = getCache(`${CACHE_KEY.Custom}_${this.chain}`);
        temp = (temp && JSON.parse(temp)) || [];
        list = temp.filter((item) => {
          return symbol === item.symbol;
        });
      }
      return list && list[0];
    },
    async changeChain(chain, autoConnect) {
      const {
        code,
        chainId,
        from,
        to,
        tokenList,
        ids,
        name,
        symbol,
        decimals,
        address,
        blockExplorerUrl,
      } = chain;
      if (this.chain != code) {
        this.chain = code;
        this.from = this.cloneToken(from);
        this.to = this.cloneToken(to);
      } else {
        const fromSymbol = getCache(CACHE_KEY.From + "_" + this.chain);
        const toSymbol = getCache(CACHE_KEY.To + "_" + this.chain);
        const _from = this.getTokenBySymbol(tokenList, fromSymbol);
        const _to = this.getTokenBySymbol(tokenList, toSymbol);
        this.from = this.cloneToken(_from || from);
        this.to = this.cloneToken(_to || to);
      }
      this.chainId = chainId;
      this.tokenList = tokenList
        .map((item) => {
          item._symbol = item.symbol.toLowerCase();
          return item;
        })
        .sort((a, b) => {
          return a._symbol > b._symbol ? 1 : -1;
        });
      this.blockExplorerUrl = blockExplorerUrl;
      const { data } = await api.getTokenPrice(ids);
      const price = (data[ids] && data[ids].usd) || 0;
      this.nativeToken = {
        address,
        decimals,
        ids,
        price,
        name,
        symbol,
      };
      setCache(CACHE_KEY.Chain, this.chain);
      if (autoConnect) {
        this.tryConnect();
      } else {
        this.account = "";
      }
    },
    connect(data) {
      if (!data) return;
      const { wallet, chain } = data;
      const { key, chainId } = chain || {};
      this.connectEvent(wallet);
      this.chain = key;
      this.chainId = chainId;
      const { name, address } = wallet || {};
      this.account = address;
      setCache(CACHE_KEY.Account, address);
      setCache(CACHE_KEY.Wallet, name);
      this.setPage("swap");
    },
    async connectEvent(wallet) {
      const { sdk } = wallet;
      const { currentProvider, utils } = sdk;
      if (currentProvider && currentProvider.on) {
        currentProvider.on("disconnect", (args, payload) => {
          console.log("disconnect", args);
          this.account = "";
          this.resetToken(this.from);
          this.resetToken(this.to);
        });

        currentProvider.on("accountsChanged", (args, payload) => {
          console.log("accountsChanged", args);
          this.account = "";
          this.resetToken(this.from);
          this.resetToken(this.to);
        });

        currentProvider.on("chainChanged", (args, payload) => {
          if (!this.chainList) return;
          const chainId = utils.hexToNumber(args);
          const list = this.chainList.filter((item) => {
            return +item.chainId === chainId;
          });
          const { chain } = (list && list[0]) || {};
          if (!chain) {
            this.account = "";
            return;
          }
          if (chain === this.chain) return;
          this.changeChain(list[0], true);
        });
      }
      await this.getBalanceOf();
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.getBalanceOf();
      }, 5 * 1000);
    },
    resetToken(token) {
      this.$set(token, "balance", 0);
      this.$set(token, "balanceDecimals", 0);
      this.$set(token, "allowance", 0);
    },
    async hideSelectToken(token) {
      const { symbol } = token || {};
      if (this.isSelectType === "from") {
        setCache(CACHE_KEY.From + "_" + this.chain, symbol);
        this.from = this.cloneToken(token);
      } else {
        setCache(CACHE_KEY.To + "_" + this.chain, symbol);
        this.to = this.cloneToken(token);
      }
      this.setPage("swap");
    },
    showSelectToken(type) {
      this.isSelectType = type;
      this.setPage("token");
    },
    removeToken(address) {
      const list = this.chainList.filter((item) => {
        return item.code === this.chain;
      });
      const { from, to } = list[0];
      if (this.from.address === address) {
        setCache(CACHE_KEY.From + "_" + this.chain, from.symbol);
        this.from = this.cloneToken(from);
      }
      if (this.to.address === address) {
        setCache(CACHE_KEY.To + "_" + this.chain, to.symbol);
        this.to = this.cloneToken(to);
      }
    },
    switchToken() {
      const _from = this.cloneToken(this.to);
      const _to = this.cloneToken(this.from);
      Object.assign(this.from, _from);
      Object.assign(this.to, _to);
      setCache(CACHE_KEY.From, _from.symbol);
      setCache(CACHE_KEY.To, _to.symbol);
    },
    cloneToken(token) {
      const {
        code,
        name,
        symbol,
        icon,
        decimals,
        address,
        price = 0,
        balance = 0,
        balanceDecimals = 0,
        allowance = 0,
      } = token;
      return {
        code,
        name,
        symbol,
        icon,
        price,
        decimals,
        address,
        balance,
        balanceDecimals,
        allowance,
      };
    },
    async getBalanceOf() {
      console.log('getBalanceOf', new Date().toLocaleString(), this.account, this.page);
      if (!this.account || this.page !== 'swap') return;
      await this.getBalance(this.from);
      await this.getBalance(this.to);
    },
    async getBalance(token) {
      if (this.page !== "swap") return;
      const { short, long } = await getBalance(this.chain, this.account, token);
      if (token.code === this.to.code) {
        const { data } = await api.getTokenPrice(token.code);
        const price = (data[token.code] && data[token.code].usd) || 0;
        this.$set(token, "price", price);
      }
      this.$set(token, "balance", short);
      this.$set(token, "balanceDecimals", long);
    },
    async getAllowance(token, contract) {
      const allowance = await getAllowance(
        this.chain,
        this.account,
        token,
        contract
      );
      this.$set(token, "allowance", allowance);
    },
    async approve(amount, res) {
      this.$set(this.from, "allowance", amount);
      if (res) {
        this.swapRes = Object.assign({}, res);
      }
    },
    async confirm(res) {
      this.swapRes = Object.assign({}, res);
      this.setPage("confirm");
      await this.getAllowance(this.from, res.to || "1");
    },
    async confirmSwap() {
      this.swapInfo = {
        chain: this.chain,
        title: "Waiting for confirmation",
        status: "loading",
        text: "Please, sign transaction in your wallet",
      };
      this.setPage("progress");
      const res = await swap(this.swapRes, this.account);
      res.chain = this.chain;
      if (res.status === "success") {
        res.title = "Transaction Submitte";
      } else {
        res.title = "Transaction Fail";
      }
      this.swapInfo = res;
    },
    refresh() {
      this.refreshTime = new Date().getTime();
    },
    changeTolerance(tolerance) {
      this.tolerance = tolerance;
      setCache(CACHE_KEY.Tolerance, tolerance);
    },
    changeTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this.setTheme();
    },
    setTheme() {
      if (this.theme === "light") {
        document.body.classList.remove("g-dark");
      } else {
        document.body.classList.add("g-dark");
      }
      setCache(CACHE_KEY.Theme, this.theme || "dark");
    },
    showToast(message, status) {
      this.message = message;
      this.status = status || "error";
      this.timestamp = new Date().getTime();
    },
  },
};
</script>

<style lang="scss" scoped>
.gen-widget {
  width: 100%;
  display: flex;

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.widget {
  width: 420px;
  border-radius: 30px;
  background-color: var(--card);
  overflow: hidden;
  position: relative;
  .widget-list {
    display: flex;
    transition: all 0.45s ease;
  }

  .widget-item {
    width: 420px;
    padding: 30px;
    box-sizing: border-box;
  }
}
</style>
