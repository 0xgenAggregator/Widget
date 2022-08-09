<template>
  <div class="label">
    <div class="name">
      <span> {{ name }}</span>
      <ComToolTip v-if="help" text="this is test" />
    </div>
    <div class="value" :class="{ blue: blue }" v-if="value">
      <span> {{ value }}</span>
    </div>
    <slot />
  </div>
</template>

<script>
import ComToolTip from "./common/ComToolTip";
export default {
  components: {
    ComToolTip,
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    help: {
      type: String,
      default: "",
    },
    blue: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;

  &.mt20 {
    margin-top: 20px;
  }

  .name {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      color: var(--color-content);
      font-family: "Roboto Regular";
    }
  }

  .value {
    span {
      font-size: 14px;
      color: var(--color);
      font-family: "Roboto Medium";
    }

    &.blue {
      span {
        color: var(--color-blue);
      }
    }
  }
}
</style>
