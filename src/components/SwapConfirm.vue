<template>
  <div class="confirm">
    <div class="field-group">
      <div class="field" ref="inAmount">
        <div class="field__name"><span>You Pay</span></div>
        <div class="field__value">
          <span ref="inAmountValue">{{ swapRes.inAmountNum }}</span
          ><span class="symbol" ref="inAmountSymbol">{{ from.symbol }}</span>
        </div>
      </div>
      <div class="field" ref="outAmount">
        <div class="field__name"><span>You Receive</span></div>
        <div class="field__value">
          <span ref="outAmountValue">{{ swapRes.outAmountNum }}</span
          ><span class="symbol" ref="outAmountSymbol">{{ to.symbol }}</span>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="info__head">
        <span>We got you the best price from {{ swapRes.dex }}</span>
      </div>
      <div class="info__list">
        <div class="item">
          <span>Slippage</span>
          <span>{{ tolerance }}%</span>
        </div>
        <div class="item">
          <div class="help">
            <span>Fee</span>
            <ComToolTip text="Gas fee and trading fee are included" />
          </div>
          <span>{{ estimatedGasValueUsd || "-" }}</span>
        </div>
      </div>
      <div class="info__foot">
        <span>This will enable {{ from.symbol }} for swapping</span>
        <ComToolTip :text="help" left="-120" width="260" align="right" />
      </div>
    </div>
    <div class="button-group" v-if="checkApprove">
      <div
        class="g-clickable button"
        v-if="unLockType === '' || unLockLoading"
        ref="unlock"
        @click="unlock('0')"
      >
        <span ref="unlockValue">Unlock {{ amount }} {{ from.symbol }}</span>
        <div class="loader" v-if="unLockLoading"></div>
      </div>
      <div
        class="g-clickable button"
        v-if="unLockType === '' || infiniteUnLockLoading"
        @click="unlock('1')"
      >
        <span>Infinite Unlock</span>
        <div class="loader" v-if="infiniteUnLockLoading"></div>
      </div>
    </div>
    <div class="g-clickable button" v-else @click="$emit('confirm')">
      <span>Confirm Swap</span>
    </div>
  </div>
</template>

<script>
import ComToolTip from "./common/ComToolTip";
import SwapCopyright from "../components/SwapCopyright";
import BigNumber from "bignumber.js";
import { formatNumber, toFixed } from "../utils/format";
import { sendApproveTo, getGas, genSdk } from "../init";
import { isNativeToken, isProxyChain } from "../utils/config";
import { decimals2Amount } from "../utils/number";
const { api } = genSdk;

export default {
  components: {
    ComToolTip,
    SwapCopyright,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    chain: {
      type: String,
      default: "",
    },
    account: {
      type: String,
      default: "",
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
    swapRes: {
      type: Object,
      default() {
        return {};
      },
    },
    tolerance: {
      type: [Number, String],
      default: 3,
    },
    nativeToken: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      unLockType: "",
      unLockLoading: false,
      infiniteUnLockLoading: false,
      clacEstimatedGas: 0,
    };
  },
  filters: {
    formatNumber,
  },
  computed: {
    amount() {
      return this.swapRes.inAmountNum || "0";
    },
    address() {
      return this.from.address;
    },
    allowance() {
      return this.from.allowance || "0";
    },
    checkApprove() {
      const allowance = this.allowance;
      if (isNativeToken(this.address) || +allowance < 0) return false;
      const amount = this.amount;
      return allowance === 0 || new BigNumber(allowance).comparedTo(amount) < 0;
    },
    estimatedGasValueUsd() {
      const { estimatedGas, gasPrice, outAmountNum } = this.swapRes;
      const gas = this.clacEstimatedGas || estimatedGas;
      let value = new BigNumber(0);
      if (gas && gasPrice) {
        const { symbol, decimals, price } = this.nativeToken;
        if (symbol && decimals && price > 0) {
          const amount = decimals2Amount(gas * gasPrice, decimals);
          value = value.plus(new BigNumber(price).multipliedBy(amount));
        }
        if (outAmountNum && this.to.price) {
          value = value.plus(
            new BigNumber(this.to.price)
              .multipliedBy(outAmountNum)
              .multipliedBy(0.01)
          );
        }
        return `~ $ ${value.toFormat(6)}`;
      }
    },
    help() {
      return `This is required and gives 0xGen. \nPermission to swap your ${this.from.symbol}`;
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.getGas();
        // this.setApprove();
        this.$nextTick(() => {
          this.reRender();
        });
      }
    },
  },
  methods: {
    setApprove() {
      if ([
        "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
        "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",
        "TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt"
      ].indexOf(this.from.address)) {
        this.unLockType =  "1";
      } else {
        this.unLockType = "";
      }
    },
    async getGas() {
      try {
        const { estimatedGas } = this.swapRes;
        console.log("getGas1", estimatedGas);
        if (!estimatedGas) {
          console.log("getGas2", estimatedGas);
          const result = await getGas(this.swapRes);
          console.log("getGas3", result);
          this.clacEstimatedGas = result;
        }
      } catch (e) {
        console.log("getGas error", e);
      }
    },
    async unlock(type) {
      this.unLockType = type;
      if (type === "0") {
        this.unLockLoading = true;
      } else {
        this.infiniteUnLockLoading = true;
      }
      const result = await sendApproveTo(
        this.chain,
        this.from.address,
        this.swapRes.to,
        type,
        this.amount,
        this.from.decimals,
        this.swapRes.gasPrice
      );
      result.successCallback = () => {
        this.approveToEnd(this.amount);
      };
      result.errorCallback = () => {
        this.approveToEnd();
      };
    },
    async approveToEnd(amount) {
      if (amount) {
        const data = await this.swapQuote();
        this.$emit("approve", amount, data);
        this.getGas();
        this.$nextTick(() => {
          this.reRender();
        });
        setTimeout(() => {
          this.unLockType = "";
          this.unLockLoading = false;
          this.infiniteUnLockLoading = false;
        }, 1000);
      } else {
        this.unLockType = "";
        this.unLockLoading = false;
        this.infiniteUnLockLoading = false;
      }
    },
    async swapQuote() {
      const { params, dex } = this.swapRes;
      const { amount } = params || {};
      params.disableEstimate = false;
      const { data } = await api.swapQuote(params);
      if (!data || !(data.data || data.swap)) {
        this.$emit("error", data.message);
        return;
      }
      data.params = params;
      data.inAmountNum = amount;
      data.outAmountNum = decimals2Amount(data.outAmount, this.to.decimals);
      data.dex = dex;
      return data;
    },
    reRender() {
      const list = [
        {
          boxWidth:
            this.getWidth("inAmount") - this.getWidth("inAmountSymbol") - 40,
          txtWidth: this.getOffsetWidth("inAmountValue"),
          ref: "inAmountValue",
        },
        {
          boxWidth:
            this.getWidth("outAmount") - this.getWidth("outAmountSymbol") - 40,
          txtWidth: this.getOffsetWidth("outAmountValue"),
          ref: "outAmountValue",
        },
      ];
      if (this.checkApprove) {
        list.push({
          boxWidth: this.getWidth("unlock") - 20,
          txtWidth: this.getOffsetWidth("unlockValue"),
          ref: "unlockValue",
        });
      }
      list.forEach((item) => {
        const { boxWidth, txtWidth, ref } = item;
        const scale = boxWidth / txtWidth;
        this.$refs[ref].style.zoom = scale < 1 ? scale : 1;
      });
    },
    getWidth(ref) {
      return this.$refs[ref].getBoundingClientRect().width;
    },
    getOffsetWidth(ref) {
      return this.$refs[ref].offsetWidth;
    },
  },
};
</script>

<style lang="scss" scoped>
.field-group {
  display: flex;
  align-items: flex-start;
}
.field {
  flex: 1;
  height: 89px;
  background: var(--input);
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 0 15px;
  max-width: 50%;
  box-sizing: border-box;

  &:last-child {
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  display: flex;
  justify-content: center;
  flex-direction: column;

  &__name {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;

    span {
      font-size: 13px;
      font-family: "Roboto Regular";
      color: var(--color-content);
      line-height: 21px;
    }
  }

  &__value {
    display: flex;
    align-items: baseline;
    span {
      font-size: 18px;
      font-family: "Roboto Medium";
      color: var(--color);
      line-height: 1;
    }
    .symbol {
      font-size: 13px;
      font-family: "Roboto Regular";
      margin-left: 5px;
      color: var(--color-content);
    }
  }
}
.info {
  margin: 20px 0 70px;
  border-radius: 12px;
  border: 1px solid var(--border-color);

  &__head {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid var(--border-color);
    padding-left: 16px;

    span {
      font-size: 13px;
      font-family: "Roboto Regular";
      color: var(--color-content);
    }
  }

  &__list {
    border-bottom: 1px solid var(--border-color);
    .item {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;

      .help {
        display: flex;
        align-items: center;
      }

      span {
        font-size: 13px;
        font-family: "Roboto Regular";
        color: var(--color-content);

        &:last-child {
          font-family: "Roboto Medium";
          color: var(--color);
        }
      }
    }
  }

  &__foot {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 16px;

    span {
      font-size: 13px;
      font-family: "Roboto Regular";
      color: var(--color-content);
    }
  }
}
.button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .button {
    &:first-child {
      margin-right: 10px;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.button {
  flex: 1;
  height: 52px;
  font-size: 18px;
  background: var(--color-blue);
  transition: all 0.3s ease;
  border-radius: 30px;
  margin-top: 10px;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 16px;
    font-family: "Roboto Medium";
    color: var(--button-color);
  }
}
.loader {
  width: 16px;
  height: 16px;
  border: 1.5px solid #fff;
  border-bottom-color: var(--color-blue);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 0.8s linear infinite;
  margin-left: 5px;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
