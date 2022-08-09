<template>
  <div class="swap">
    <SwapField
      v-model="inAmount"
      type="from"
      :token="from"
      @select="$emit('select', 'from')"
    />
    <div class="switch">
      <div class="g-clickable icon" @click="$emit('switch')">
        <i class="iconfont icon-switch"></i>
      </div>
    </div>
    <SwapField
      v-model="outAmount"
      type="to"
      :token="to"
      :loading="quoteLoading"
      @select="$emit('select', 'to')"
    />
    <SwapLabel name="Price" class="mt20" :value="price" />
    <SwapLabel name="Slippage tolerance" :value="`${tolerance}%`" />
    <SwapButton
      :amount="inAmount"
      :account="account"
      :token="from"
      :quote-loading="quoteLoading"
      :swap-loading="swapLoading"
      :invalid-token="from.address === to.address"
      :invalid-output="+outAmount === 0"
      @confirm="confirm"
      @connect="$emit('connect')"
    />
    <SwapCopyright />
  </div>
</template>

<script>
import SwapCopyright from "../components/SwapCopyright";
import SwapButton from "../components/SwapButton";
import SwapField from "../components/SwapField";
import SwapLabel from "../components/SwapLabel";
import { decimals2Amount } from "../utils/number";
import { formatBalance } from "../utils/format";
import { getProxyContract, isProxyChain, isNativeToken } from "../utils/config";
import { genSdk } from "../init";
const { api } = genSdk;

export default {
  components: {
    SwapButton,
    SwapField,
    SwapLabel,
    SwapCopyright,
  },
  props: {
    chain: {
      type: String,
      default: "bsc",
    },
    account: {
      type: String,
      default: "",
    },
    page: {
      type: String,
      default: ""
    },
    from: {
      type: Object,
      default() {
        return {};
      },
    },
    to: {
      type: Object,
      default() {
        return {};
      },
    },
    tolerance: {
      type: [Number, String],
      default: "3",
    },
    refreshTime: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      isSelectType: "from",
      isShowConfirm: false,
      isShowSetting: false,
      isShowToken: false,
      inAmount: "1",
      outAmount: "0",
      minOutAmount: "0",
      timeout: null,
      swapLoading: false,
      quoteLoading: false,
      dex: "",
    };
  },
  computed: {
    price() {
      if (this.outAmount && this.inAmount && !this.quoteLoading) {
        const amount = formatBalance(this.outAmount / this.inAmount, 8);
        return `${amount} ${this.to.symbol} Per ${this.from.symbol}`;
      }
      return "--";
    },
  },
  watch: {
    inAmount(val) {
      if (+val > 0) {
        this.quote();
      } else {
        this.outAmount = "0";
      }
    },
    "from.symbol"() {
      this.inAmount = "1";
      this.quote();
    },
    "to.symbol"() {
      this.quote();
    },
    chain() {
      this.getGasPrice(true);
    },
    refreshTime() {
      if (this.quoteLoading) return;
      this.quote();
    },
  },
  mounted() {
    this.inAmount = "1";
    this.getGasPrice(true);
  },
  methods: {
    quote() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        console.log('quote loop1', new Date().toString());
        if (this.page === "swap") {
          console.log('quote loop2', new Date().toString());
          this.doQuote();
        }
      }, 200);
    },
    async getGasPrice(withQuote) {
      const { data } = await api.getGasPrice({
        chain: this.chain,
      });
      const { gasPrice } = data;
      this.gasPrice = this.chain === 'solana' ? 1 : gasPrice;
      if (withQuote) {
        this.quote();
      }
    },
    getAccount() {
      return isProxyChain(this.chain)
        ? getProxyContract(this.chain)
        : this.account;
    },
    async doQuote() {
      const amount = +this.inAmount;
      if (amount === 0) {
        this.outAmount = 0;
        return;
      }
      this.quoteLoading = true;
      const { data } = await api.quote({
        chain: this.chain,
        inTokenAddress: this.from.address,
        outTokenAddress: this.to.address,
        amount,
        slippage: this.tolerance,
        gasPrice: this.gasPrice,
        account: this.account,
      });
      const { maxOutAmount, outToken, dexes } = data || {};
      if (!maxOutAmount || !outToken || !dexes) {
        this.quoteLoading = false;
        return;
      }
      const { decimals } = outToken || {};
      const dex = dexes.filter((item) => {
        return item.amount === maxOutAmount;
      });
      this.dex = dex && dex[0] && dex[0].name;
      this.dex = window.localStorage.getItem('gen_default_dex') || this.dex;
      this.outAmount = decimals2Amount(maxOutAmount, decimals);
      this.quoteLoading = false;
    },
    async confirm() {
      this.swapLoading = true;
      await this.getGasPrice(false);
      const max = decimals2Amount(
        this.from.balanceDecimals,
        this.from.decimals
      );
      const amount =
        +this.inAmount > 0 && +this.inAmount === +this.from.balance
          ? max
          : this.inAmount;
      console.log(
        "balance",
        max,
        this.inAmount,
        this.from.balance,
        this.from.balanceDecimals,
        this.from.decimals
      );
      const params = {
        chain: this.chain,
        dex: this.dex,
        inTokenAddress: this.from.address,
        outTokenAddress: this.to.address,
        amount,
        slippage: this.tolerance,
        gasPrice: this.gasPrice,
        account: this.getAccount(),
        disableEstimate: true,
      };
      const { data } = await api.swapQuote(params);
      if (!data || !(data.data || data.swap)) {
        this.swapLoading = false;
        this.$emit("error", data && data.message || "unknow error");
        return;
      }
      data.params = params;
      data.inAmountNum = amount;
      data.outAmountNum = decimals2Amount(data.outAmount, this.to.decimals);
      data.dex = this.dex;
      data.account = this.account;
      // data.to = getProxyContract(this.chain) || data.to;
      this.$emit("confirm", data);
      setTimeout(() => {
        this.swapLoading = false;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.swap {
  .switch {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px auto -15px;

    div {
      cursor: pointer;
      width: 42px;
      height: 42px;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    i {
      font-size: 32px;
      color: var(--color);
      transform: scale(0.8);
    }
  }
}
</style>