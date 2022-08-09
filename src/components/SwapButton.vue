<template>
  <div>
    <div
      class="g-clickable button connect"
      v-if="checkAccount"
      @click="connect"
    >
      <span>Connect Wallet</span>
    </div>
    <div class="g-clickable button disabled" v-else-if="invalidToken">
      <span>Invalid token</span>
    </div>
    <div class="g-clickable button disabled" v-else-if="checkAmount">
      <span>Please enter a amount</span>
    </div>
    <div class="g-clickable button disabled" v-else-if="checkBalance">
      <span>Insufficient Balance</span>
    </div>
    <div class="g-clickable button disabled" v-else-if="invalidOutput">
      <span>Insufficient Liquidity</span>
    </div>
    <div
      class="g-clickable button"
      :class="{ disabled: quoteLoading }"
      v-else
      @click="confirm"
    >
      <span>{{ quoteLoading ? "Finding Best Prices" : "Swap" }}</span>
      <div class="loader" v-if="swapLoading"></div>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";

export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    amount: {
      type: [Number, String],
      default: 0,
    },
    account: {
      type: String,
      default: "",
    },
    quoteLoading: {
      type: Boolean,
      default: false,
    },
    swapLoading: {
      type: Boolean,
      default: false,
    },
    token: {
      type: Object,
      default() {
        return {};
      },
    },
    invalidToken: {
      type: Boolean,
      default: false,
    },
    invalidOutput: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    checkAccount() {
      return !this.account;
    },
    checkAmount() {
      return +this.amount === 0;
    },
    checkBalance() {
      return (
        this.token.balance <= 0 ||
        new BigNumber(this.token.balance).comparedTo(this.amount) < 0
      );
    }
  },
  methods: {
    connect() {
      this.$emit("connect");
    },
    confirm() {
      if (this.quoteLoading || this.swapLoading) return;
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.group {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
}
.button {
  height: 52px;
  font-size: 18px;
  color: var(--color-dark);
  transition: all 0.3s ease;
  border-radius: 30px;
  margin-top: 20px;
  background: var(--color-blue);

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 16px;
    font-family: "Roboto Medium";
    color: var(--button-color);
  }

  svg {
    width: 45px;
  }

  &.connect {
    background: var(--color-blue);

    span {
      color: var(--button-color);
    }
  }

  &.disabled {
    cursor: not-allowed;
    background: var(--field);

    span {
      color: var(--color-content);
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
}
</style>
