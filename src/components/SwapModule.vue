<template>
  <div class="module">
    <slot name="module__head">
      <div class="module__head">
        <div class="g-clickable" @click="back">
          <i class="iconfont icon-arrow-down2"></i>
        </div>
        <span>{{ title }}</span>
        <div class="g-clickable hidden">
          <i class="iconfont icon-help"></i>
        </div>
      </div>
    </slot>
    <div class="module__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    back() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="scss" scoped>
.module {
  width: 420px;
  padding: 30px;
  box-sizing: border-box;
  &__head {
    width: 360px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    span {
      flex: 1;
      text-align: center;
      font-size: 18px;
      line-height: 1;
      font-family: "Roboto Bold";
      color: var(--color);
    }

    .g-clickable {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.hidden {
        visibility: hidden;
      }
    }

    i {
      font-size: 24px;
    }

    .icon-arrow-down2 {
      transform: rotate(90deg);
    }
  }
  &__body {
    width: 360px;
  }
}
</style>