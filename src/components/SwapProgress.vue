<template>
  <div class="loading">
    <div class="message loading" v-if="status === 'loading'">
      <div class="icon">
        <svg
          version="1.1"
          id="L3"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 100 100"
          enable-background="new 0 0 0 0"
          xml:space="preserve"
        >
          <circle
            fill="none"
            stroke="var(--option-color)"
            stroke-width="3"
            cx="50"
            cy="50"
            r="44"
            style="opacity: 0.5"
          ></circle>
          <circle
            fill="var(--color-blue)"
            stroke="var(--option-color)"
            stroke-width="1"
            cx="7"
            cy="55"
            r="6"
          >
            <animateTransform
              attributeName="transform"
              dur="1.5s"
              type="rotate"
              from="0 50 48"
              to="360 50 52"
              repeatCount="indefinite"
            ></animateTransform>
          </circle>
        </svg>
      </div>
      <span class="text">{{ text }}</span>
      <span class="desc">{{
        message || "Confirm this transaction in you wallet"
      }}</span>
    </div>
    <div class="message success" v-if="status === 'success'">
      <div class="icon">
        <svg viewBox="0 0 400 400" class="success">
          <circle
            class="circle"
            fill="none"
            stroke="var(--option-color)"
            stroke-width="12"
            cx="200"
            cy="200"
            r="180"
            stroke-linecap="round"
            transform="rotate(-90,200,200)"
          />
          <polyline
            class="tick"
            fill="none"
            stroke="var(--color-blue)"
            stroke-width="20"
            points="88,214 173,284 304,138"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <a :href="blockExplorerUrl + hash" target="_blank">
        <span>{{ viewOn }}</span>
        <i class="iconfont icon-share" />
      </a>
      <div class="g-clickable button" @click="$emit('close')">
        <span>Close</span>
      </div>
    </div>
    <div class="message rejected" v-if="status === 'rejected'">
      <div class="icon">
        <svg viewBox="0 0 400 400" class="rejected">
          <circle
            class="circle"
            fill="none"
            stroke="#EA4848"
            stroke-width="16"
            cx="200"
            cy="200"
            r="180"
            stroke-linecap="round"
            transform="rotate(-90,200,200)"
          />
          <polyline
            class="tick"
            fill="none"
            stroke="#EA4848"
            stroke-width="16"
            points="125,125 275,275"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            class="tick2"
            fill="none"
            stroke="#EA4848"
            stroke-width="16"
            points="125,275 275,125"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <span class="text">{{ text }}</span>
      <span class="desc">{{ message }}</span>
      <div class="g-clickable button" @click="$emit('close')">
        <span>Close</span>
      </div>
    </div>
  </div>
</template>

<script>
import { VIEW_ON } from "../utils/config";

export default {
  props: {
    chain: {
      type: String,
      default: "",
    },
    swapInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    blockExplorerUrl: {
      type: String,
      default: "",
    },
  },
  computed: {
    viewOn() {
      return VIEW_ON[this.chain];
    },
    status() {
      return (this.swapInfo && this.swapInfo.status) || "";
    },
    hash() {
      return (this.swapInfo && this.swapInfo.hash) || "";
    },
    text() {
      return (this.swapInfo && this.swapInfo.text) || "";
    },
    message() {
      return (this.swapInfo && this.swapInfo.message) || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.g-dialog-title {
  span {
    font-size: 20px;
  }
}

.icon {
  margin: 50px auto 20px;
  svg {
    width: 100px;
  }
}

.message {
  display: flex;
  align-content: center;
  flex-direction: column;

  .text {
    font-size: 16px;
    font-family: "Roboto Bold";
    color: var(--color);
    margin-bottom: 15px;
    text-align: center;
  }

  .name {
    font-size: 14px;
    font-family: "Roboto Medium";
    color: var(--color-des);
    padding-top: 20px;
    text-align: center;
  }

  .desc {
    font-size: 14px;
    font-family: "Roboto Regular";
    line-height: 1.5;
    color: var(--color-content);
    margin-bottom: 10px;
    text-align: center;
    max-height: 105px;
    overflow: auto;
  }

  a {
    text-decoration: none;
    color: var(--color-blue);
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 16px;
      font-family: "Roboto Regular";
      text-decoration: underline;
    }
    i {
      font-size: 20px;
    }
  }

  &.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  &.success,
  &.rejected,
  &.failed {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .button {
      margin-top: 30px;
    }
  }
}

.button {
  height: 50px;
  border-radius: 25px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  background: var(--color-blue);

  span {
    color: var(--button-color);
  }

  span {
    font-size: 15px;
    font-family: "Roboto Bold";
  }
}

.success {
  .circle {
    stroke-dasharray: 1194;
    stroke-dashoffset: 1194;
    animation: circle 1s ease-in-out;
    animation-fill-mode: forwards;
  }

  .tick {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    animation: tick 0.8s ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: 0.95s;
  }
}

.rejected,
.failed {
  .circle {
    stroke-dasharray: 1194;
    stroke-dashoffset: 1194;
    animation: circle 1s ease-in-out;
    animation-fill-mode: forwards;
  }
  .tick {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    animation: tick 0.3s ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: 1.15s;
  }
  .tick2 {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    animation: tick 0.3s ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: 0.95s;
  }
}

@keyframes tick {
  from {
    stroke-dashoffset: 350;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes circle {
  from {
    stroke-dashoffset: 1194;
  }
  to {
    stroke-dashoffset: 2388;
  }
}
</style>
