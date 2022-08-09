<template>
  <div class="setting">
    <div class="setting__item slippage">
      <div class="slippage__title">
        <span>Slippage tolerance</span>
        <span>{{ tolerance }}%</span>
      </div>
      <div class="slippage__value">
        <div class="option">
          <div
            class="option__item"
            v-for="(option, i) in toleranceOptions"
            :class="{ on: +toleranceValue === option.code }"
            :key="i"
            @click="selectTolerance(option.code)"
          >
            <span>{{ option.name }}</span>
          </div>
        </div>
        <div class="custom">
          <input
            type="number"
            v-model="toleranceValue"
            @input="changeTolerance"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tolerance: {
      type: [Number, String],
      default: "3",
    },
  },
  data() {
    return {
      toleranceValue: this.tolerance,
      toleranceOptions: [
        {
          code: 0.1,
          name: "0.1%",
        },
        {
          code: 0.5,
          name: "0.5%",
        },
        {
          code: 1,
          name: "1%",
        },
        {
          code: 3,
          name: "3%",
        },
      ],
    };
  },
  watch: {
    tolerance(val) {
      this.toleranceValue = val;
    },
  },
  methods: {
    selectTolerance(code) {
      this.toleranceValue = code;
      this.changeTolerance();
    },
    changeTolerance() {
      clearTimeout(this.timeout);
      let tolerance = +this.toleranceValue;
      this.timeout = setTimeout(() => {
        if (tolerance < 0.1) {
          tolerance = 1;
          this.$emit("error", "tolerance is too small");
        } else if (tolerance > 30) {
          tolerance = 30;
          this.$emit("error", "tolerance is too big");
        }
        this.toleranceValue = tolerance;
        this.$emit("changeTolerance", tolerance);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.slippage {
  &__title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    span {
      font-size: 14px;
      font-family: "Roboto Bold";

      &:last-child {
        font-family: "Roboto Black";
      }
    }
  }

  &__value {
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    background-color: var(--input);
    padding: 0 20px 0 10px;

    .option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__item {
        cursor: pointer;
        flex: 1;
        height: 50px;
        border-radius: 15px;
        &.on {
          background-color: var(--option-color);
          span {
            color: var(--color-blue);
          }
        }
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 14px;
          font-family: "Roboto Bold";
          color: var(--color-content);
        }
      }
    }

    .custom {
      width: 120px;
      display: flex;
      align-items: center;

      input {
        background-color: transparent;
        border: none;
        outline: none;
        text-align: right;
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        width: 100%;
        font-size: 14px;
        line-height: 1;
        font-family: "Roboto Bold";
        color: var(--color);
      }
    }
  }
}
</style>