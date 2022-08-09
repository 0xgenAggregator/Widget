<template>
  <div class="token">
    <div class="token-search">
      <input
        type="text"
        v-model="search"
        placeholder="Search name or paste address"
        @input="input"
      />
    </div>
    <div class="token-list g-scrollbar" v-if="filterList.length > 0">
      <div
        class="token-list__item"
        v-for="(item, i) in filterList"
        :key="i"
        @click="selectToken(item)"
      >
        <img :src="item.icon" class="icon" />
        <div class="info">
          <span class="symbol">{{ item.symbol }}</span>
          <span class="name">{{ item.name }}</span>
        </div>
        <div class="last" v-if="item.isCustom" @click.stop="stop">
          <span class="g-clickable remove" @click.stop="removeToken(item)"
            >Remove</span
          >
        </div>
      </div>
    </div>
    <div class="token-loading" v-else-if="loading">
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
      <div class="label">
        <span>finding token online</span>
      </div>
    </div>
    <div class="token-custom" v-else-if="token">
      <div class="token-custom__tip">
        <p>
          Anyone can create token on Blockchain with any name, including
          creating fake versions of existing tokens. Please DYOS first to avoid
          scum.
        </p>
      </div>
      <div class="token-custom__token">
        <div class="list">
          <div class="item">
            <span class="name">Symbol</span>
            <span class="value">{{ token.symbol }}</span>
          </div>
          <div class="item">
            <span class="name">Name</span>
            <span class="value">{{ token.name }}</span>
          </div>
          <div class="item">
            <span class="name">Decimals</span>
            <span class="value">{{ token.decimals }}</span>
          </div>
        </div>
        <div class="icon">
          <img :src="token.icon" />
        </div>
      </div>
      <div class="token-custom__foot">
        <div class="understand">
          <div
            class="g-clickable checkbox"
            :class="{ checked: checked }"
            @click="checked = !checked"
          ></div>
          <span>I understand</span>
        </div>
        <div
          class="g-clickable button"
          :class="{ disable: !checked }"
          @click="addToken"
        >
          <span>Add Token</span>
        </div>
      </div>
    </div>
    <div class="token-empty" v-else>
      <svg data-v-06af285c="" viewBox="0 0 1194 1024" version="1.1">
        <path
          data-v-06af285c=""
          d="M333.141333 699.733333c-13.653333 0-19.114667-4.778667-25.258666-12.288-5.461333-7.509333-4.778667-20.48-4.778667-29.354666V83.285333c0-14.336 4.778667-28.672 14.336-39.594666 0.682667-0.682667 1.365333-2.048 2.048-2.730667 11.605333-11.605333 27.306667-13.653333 28.672-13.653333h324.266667v97.621333c0 4.096 0 32.768 16.384 51.2l0.682666 0.682667c12.288 13.653333 29.354667 14.336 47.104 15.701333l99.669334-1.365333v113.322666l27.989333 27.306667 6.144 6.144V175.445333c0-10.922667-4.778667-21.845333-12.970667-28.672L692.906667 0H347.477333c-4.096 0-25.258667 1.365333-49.152 25.258667-19.797333 19.797333-21.162667 47.786667-21.845333 50.517333v580.949333c0 6.144 0.682667 34.133333 13.653333 51.882667 8.192 10.922667 19.797333 18.432 33.450667 21.845333 10.24 2.730667 19.114667 2.730667 23.210667 2.730667H621.226667c-17.066667-5.461333-73.045333-33.450667-73.045334-33.450667H333.141333zM699.733333 54.613333l122.88 109.226667h-79.872c-12.288 0-24.576-4.096-34.133333-11.605333l-2.730667-2.730667c-4.096-4.778667-6.144-17.066667-6.144-23.893333V54.613333z m268.288 676.522667c12.288 12.970667 12.970667 33.450667 0 46.421333-6.144 6.144-14.336 9.557333-23.210666 9.557334s-17.066667-3.413333-23.210667-9.557334l-100.352-101.034666c-36.864 27.306667-80.554667 41.642667-126.293333 41.642666-117.418667 0-212.992-96.256-212.992-215.04s95.573333-215.04 212.992-215.04S907.946667 384.341333 907.946667 503.125333c0 47.786667-15.701333 91.477333-41.642667 126.976l101.717333 101.034667zM600.746667 518.826667c11.605333 0 20.48-8.874667 20.48-20.48s-8.874667-20.48-20.48-20.48-20.48 8.874667-20.48 20.48 8.874667 20.48 20.48 20.48z m88.746666 0c11.605333 0 20.48-8.874667 20.48-20.48s-8.874667-20.48-20.48-20.48-20.48 8.874667-20.48 20.48 8.874667 20.48 20.48 20.48z m88.746667 0c11.605333 0 20.48-8.874667 20.48-20.48s-8.874667-20.48-20.48-20.48-20.48 8.874667-20.48 20.48 8.874667 20.48 20.48 20.48z m-82.602667 168.618666c101.717333 0 184.32-82.602667 184.32-184.32s-82.602667-184.32-184.32-184.32-184.32 82.602667-184.32 184.32 82.602667 184.32 184.32 184.32z"
          fill="var(--color-des)"
        ></path>
        <path
          data-v-06af285c=""
          d="M1150.976 615.082667c-23.210667 0-41.642667-19.114667-41.642667-43.008 1.365333-23.893333 19.797333-43.008 41.642667-43.008 23.210667 0 41.642667 19.114667 41.642667 43.008 0 24.576-17.749333 43.008-41.642667 43.008z m0-71.68c-15.018667 0-27.306667 12.970667-27.989333 29.354666 0 15.701333 12.288 28.672 27.989333 28.672s27.989333-12.970667 27.989333-29.354666-12.288-28.672-27.989333-28.672zM150.186667 305.152c-23.210667 0-41.642667-19.114667-41.642667-43.008 0.682667-23.893333 19.114667-42.325333 41.642667-42.325333 23.210667 0 41.642667 19.114667 41.642666 43.008 0 23.210667-18.432 42.325333-41.642666 42.325333z m0-71.68c-15.018667 0-27.306667 12.970667-27.989334 29.354667 0 15.701333 12.288 28.672 27.989334 28.672s27.989333-12.970667 27.989333-29.354667-12.288-28.672-27.989333-28.672z"
          fill="var(--color-des)"
        ></path>
        <path
          data-v-06af285c=""
          d="M6.826667 1024c-4.096 0-6.826667-2.730667-6.826667-6.826667s2.730667-6.826667 6.826667-6.826666l780.970666-1.365334c4.096 0 6.826667 2.730667 6.826667 6.826667s-2.730667 6.826667-6.826667 6.826667L6.826667 1024zM1071.786667 1024l-217.088-1.365333c-4.096 0-6.826667-3.413333-6.826667-6.826667s3.413333-6.826667 6.826667-6.826667l217.088 1.365334c4.096 0 6.826667 3.413333 6.826666 6.826666 0 4.096-3.413333 6.826667-6.826666 6.826667zM935.253333 925.696H130.389333c-4.096 0-6.826667-2.730667-6.826666-6.826667s2.730667-6.826667 6.826666-6.826666H935.253333c4.096 0 6.826667 2.730667 6.826667 6.826666s-2.730667 6.826667-6.826667 6.826667z"
          fill="var(--color-des)"
        ></path>
      </svg>
      <div class="error">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { CACHE_KEY, getCache, setCache } from "@/utils/cache";
import { getTokenByAddress, isTokenAddress } from "../init";

export default {
  props: {
    tokenList: {
      type: Array,
      default() {
        return [];
      },
    },
    chain: {
      type: String,
      default: "bsc",
    },
  },
  data() {
    return {
      search: "",
      checked: false,
      loading: false,
      token: null,
      error: "",
      customToken: [],
    };
  },
  computed: {
    filterList() {
      if (!this.search) return this.customToken.concat(this.tokenList);
      const symbol = this.search.toLowerCase();
      return this.customToken
        .concat(this.tokenList)
        .filter((item) => {
          return (
            item.symbol.toLowerCase().indexOf(symbol) >= 0 ||
            item.address.toLowerCase() === symbol
          );
        })
        .sort((a, b) => {
          return a._symbol > b._symbol ? 1 : -1;
        });
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const list = getCache(`${CACHE_KEY.Custom}_${this.chain}`);
      this.customToken = JSON.parse(list || "[]");
    },
    stop() {
      console.log("stop");
    },
    close() {
      this.$emit("close");
    },
    selectToken(item) {
      this.$emit("select", item);
    },
    addToken() {
      if (!this.checked) return;
      const { address, name, symbol, decimals, icon } = this.token;
      this.customToken.push({
        address,
        name,
        symbol,
        decimals,
        icon,
        isCustom: true,
      });
      setCache(
        `${CACHE_KEY.Custom}_${this.chain}`,
        JSON.stringify(this.customToken)
      );
      this.token = null;
    },
    removeToken(token) {
      const { address } = token;
      this.customToken = this.customToken.filter((item) => {
        return item.address !== address;
      });
      setCache(
        `${CACHE_KEY.Custom}_${this.chain}`,
        JSON.stringify(this.customToken)
      );
      this.$emit("remove", address);
    },
    async input() {
      if (this.loading) return;

      this.error = "";
      if (this.filterList.length === 0) {
        if (isTokenAddress(this.search)) {
          this.loading = true;
          const token = await getTokenByAddress(this.chain, this.search);
          if (token && token.symbol) {
            this.token = token;
          } else {
            this.error = "Token not found";
          }
          this.loading = false;
        } else {
          this.error = "Invalid token address";
        }
      } else {
        this.token = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.token {
  width: 360px;
}
.token-search {
  margin-bottom: 10px;
  input {
    width: 100%;
    height: 50px;
    padding: 15px 20px;
    outline: none;
    border: none;

    background-color: var(--input);
    border: 2px solid var(--input);
    border-radius: 30px;
    box-sizing: border-box;

    line-height: 30px;
    font-size: 16px;
    font-family: "Roboto Medium";
    color: var(--color);

    &::placeholder {
      font-family: "Roboto Regular";
      color: var(--color-des);
    }
  }
}
.token-list {
  height: 340px;
  overflow: auto;
  margin: 0 -30px;

  &__item {
    cursor: pointer;
    height: 56px;
    display: grid;
    align-items: center;
    grid-gap: 8px;
    grid-template-columns: 30px 1fr 80px;
    padding: 0 37px 0 30px;

    &:hover {
      background-color: var(--item-hover);
    }

    .icon {
      width: 30px;
      border-radius: 15px;
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .symbol {
        color: var(--color);
        font-size: 14px;
        font-family: "Roboto Bold";
        margin-bottom: 5px;
      }

      .name {
        color: var(--color-content);
        font-size: 12px;
        font-family: "Roboto Regular";
        white-space: nowrap;
      }
    }

    .last {
      height: 56px;
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .remove {
        background-color: var(--input);
        font-size: 12px;
        font-family: "Roboto Regular";
        display: inline-block;
        padding: 8px 10px;
        border-radius: 5px;
        color: var(--color-content);
      }
    }
  }
}
.token-empty {
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  svg {
    width: 100px;
  }

  .error {
    margin-top: 25px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 16px;
      font-family: "Roboto Regular";
      color: var(--color-red);
    }
  }
}
.token-custom {
  &__tip {
    padding: 12px 30px;
    margin: 15px -30px;
    background-color: var(--input);
    p {
      font-size: 14px;
      font-family: "Roboto Regular";
      line-height: 28px;
      color: var(--color-red);
    }
  }

  &__token {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    .list {
      .item {
        padding: 8px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        span {
          font-size: 14px;
          font-family: "Roboto Regular";
          line-height: 1;

          &.name {
            margin-right: 10px;
            color: var(--color-des);
          }

          &.value {
            color: var(--color);
          }
        }
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 64px;
        border-radius: 32px;
        object-fit: cover;
      }
    }
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 72px;

    .understand {
      display: flex;
      align-items: center;

      span {
        font-size: 16px;
        font-family: "Roboto Regular";
        color: var(--color-des);
      }
    }
    .checkbox {
      cursor: pointer;
      width: 22px;
      height: 22px;
      margin-right: 5px;
      border-radius: 3px;
      background-color: var(--field);
      transition: background-color 0.3s;

      display: flex;
      align-items: center;
      justify-content: center;

      &.checked {
        background-color: var(--color-blue);
        &:after {
          content: "\2714";
          display: block;
          color: #fff;
          text-align: center;
          line-height: 1;
          font-size: 16px;
        }
      }
    }
    .button {
      width: 135px;
      height: 42px;
      border-radius: 30px;
      background: var(--color-blue);

      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 16px;
        font-family: "Roboto Regular";
        color: var(--button-color);
      }

      &.disable {
        cursor: not-allowed;
        background: var(--field);

        span {
          color: var(--color-des);
        }
      }
    }
  }
}
.token-loading {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  svg {
    width: 80px;
  }

  .label {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 14px;
      font-family: "Roboto Regular";
      color: var(--color-content);
    }
  }
}
</style>
