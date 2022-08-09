<template>
  <div class="field">
    <div class="field__head">
      <span>{{ type === "from" ? "From" : "To" }}</span>
      <div class="right">
        <div
          class="g-clickable max"
          v-if="type === 'from' && +token.balance > 0"
          @click="setMax"
        >
          <span>Max</span>
        </div>
        <div class="balance">
          <span>Balance: </span>
          <span>{{ token.balance || 0 }}</span>
        </div>
      </div>
    </div>
    <div class="field__body">
      <div class="icon" @click="$emit('select')">
        <img :src="token.icon" v-if="iconSuccess" />
        <div class="g-skeleton icon-empty" v-else></div>
        <span>{{ token.symbol }}</span>
        <i class="iconfont icon-arrow-up" />
      </div>
      <div class="loading" v-if="loading">
        <span class="loader"></span>
      </div>
      <div class="input" v-else>
        <input
          type="text"
          placeholder="enter amount"
          v-bind:value="value"
          @input="emitInput"
          :readonly="type === 'to'"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
    },
    type: {
      type: String,
      default: "from",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    token: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      timeout: null,
      iconSuccess: false,
    };
  },
  watch: {
    "token.icon"() {
      this.loadIcon();
    },
  },
  methods: {
    setMax() {
      const val = this.token.balance || "0";
      this.$emit("input", val);
      this.$emit("change", val);
    },
    loadIcon() {
      this.iconSuccess = false;
      const { icon } = this.token;
      if (!icon) return;
      const img = new Image();
      img.src = icon;
      console.log("loadIcon", img.src);
      img.onload = () => {
        console.log("loadIcon", "success");
        this.iconSuccess = true;
      };
    },
    emitInput(e) {
      clearTimeout(this.timeout);
      let val = e.target.value;
      console.log("emitInput", val);
      this.timeout = setTimeout(() => {
        val = Math.abs(val || 0)
          .toString()
          .match(RegExp("^\\d*(\\.?\\d{0,8})"))[0];
        e.target.value = val;
        console.log("emitInput", val);
        this.$emit("input", val);
        this.$emit("change", val);
      }, 600);
    },
  },
};
</script>

<style lang="scss" scoped>
.field {
  &__head {
    height: 36px;
    padding-right: 15px;
    display: grid;
    align-items: center;
    grid-template-columns: 120px 1fr;

    span {
      font-size: 14px;
      line-height: 1;
      font-family: "Roboto Regular";
      color: var(--color-content);
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .max {
      cursor: pointer;
      width: 40px;
      height: 20px;
      border-radius: 10px;
      margin-right: 5px;
      background: var(--border-color);

      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 12px;
        font-family: "Roboto Regular";
      }
    }

    .balance {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      span {
        &:first-child {
          color: var(--color-content);
          margin-right: 5px;
        }
      }
    }
  }
  &__body {
    height: 60px;
    padding: 0 15px;
    display: grid;
    align-items: center;
    grid-template-columns: 120px 1fr;
    background-color: var(--field);
    border-radius: 15px;

    .icon {
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 32px;
        height: 32px;
        border-radius: 16px;
        object-fit: cover;
      }

      span {
        font-size: 14px;
        line-height: 1;
        font-family: "Roboto Bold";
        margin: 0 3px 0 7px;
        color: var(--color);
        transition: all 0.3s ease;
      }

      i {
        font-size: 20px;
        transform: rotate(180deg) scale(0.7);
        color: var(--color-des);
        transition: all 0.3s ease;
      }

      .icon-empty {
        width: 32px;
        height: 32px;
        border-radius: 16px;
        background-color: var(--option-color);
      }
    }

    .input {
      input {
        width: 200px;
        height: 30px;
        background-color: transparent;
        border: none;
        outline: none;
        text-align: right;

        font-size: 22px;
        line-height: 1;
        font-family: "Roboto Bold";
        color: var(--color);
      }
    }

    .loading {
      width: 200px;
      height: 30px;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .loader {
        width: 26px;
        height: 26px;
        border: 3px solid var(--option-color);
        border-bottom-color: var(--color-blue);
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
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
  }
}
</style>
