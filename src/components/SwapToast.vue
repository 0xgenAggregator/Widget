<template>
  <div class="toast" :class="{ active: active }">
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "error",
    },
    timeout: {
      type: [Number, String],
      default: 2500,
    },
    timestamp: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      active: false,
    };
  },
  watch: {
    timestamp() {
      this.active = true;
      setTimeout(() => {
        this.active = false;
      }, this.timeout);
    },
  },
};
</script>

<style lang="scss" scoped>
.toast {
  position: absolute;
  left: 50%;
  top: -48px;
  height: 48px;
  min-width: 320px;
  border-radius: 0 0 15px 15px;
  transform: translateX(-50%);
  transition: all 0.3s ease;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-red);

  span {
    color: #fff;
    font-size: 14px;
    font-family: "Roboto Medium";
  }

  &.error {
    background-color: var(--color-red);
  }

  &.active {
    top: 0;
  }
}
</style>