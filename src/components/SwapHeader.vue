<template>
  <div class="header">
    <div class="g-clickable" @click="$emit('back')">
      <i class="iconfont icon-arrow-down2"></i>
    </div>
    <span>{{ title }}</span>
    <div class="g-clickable">
      <i class="iconfont icon-help"></i>
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
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

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
  }

  i {
    font-size: 24px;
  }

  .icon-arrow-down2 {
    transform: rotate(90deg);
  }
}
</style>