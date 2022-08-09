<template>
  <div class="tooltip">
    <i class="iconfont icon-help"></i>
    <div
      class="tooltip__text"
      :class="`${align}`"
      :style="{ left: left + 'px', width: width + 'px' }"
    >
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    left: {
      type: [Number, String],
      default: 50,
    },
    align: {
      type: String,
      default: "",
    },
    width: {
      type: [Number, String],
      default: 250,
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;
  display: flex;
  align-items: center;

  .iconfont {
    font-size: 18px;
    color: var(--color-content);
    margin-left: 3px;
    cursor: pointer;
  }

  &__text {
    visibility: hidden;
    position: absolute;
    left: 50px;
    bottom: 21px;
    background-color: var(--input);

    width: 250px;
    padding: 10px;
    border-radius: 8px;

    z-index: 1;
    opacity: 0;
    transition: opacity 0.5s;
    transition-delay: 0.1s;
    transform: translateX(-30%);
    word-break: keep-all;
    box-sizing: border-box;
    border: 1px solid var(--border-color);

    span {
      font-family: "Roboto Regular";
      font-style: normal;
      font-size: 14px;
      line-height: 18px;
      text-align: left;
      color: var(--color);
      white-space: pre-line;
    }

    &.right {
      &::before,
      &::after {
        left: auto;
        right: 45px;
      }
    }

    &::before {
      content: "";
      position: absolute;
      top: 100%;
      left: 38px;
      margin-left: -7px;
      border-width: 5px;
      border-style: solid;
      border-color: var(--border-color) transparent transparent transparent;
    }

    &::after {
      content: "";
      position: absolute;
      top: calc(100% - 1.5px);
      left: 38px;
      margin-left: -7px;
      border-width: 5px;
      border-style: solid;
      border-color: var(--input) transparent transparent transparent;
    }
  }

  &:hover &__text {
    visibility: visible;
    opacity: 1;
  }
}
</style>
