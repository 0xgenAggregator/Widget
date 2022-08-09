<template>
  <div class="select" :class="{ minSelect: min }" @mousedown.stop>
    <div class="select__selected" @click.stop="switchUnfold">
      <span>{{ selectedItem.label }}</span>
      <i class="iconfont icon-arrow-down"></i>
    </div>
    <NouFoldTransition>
      <div v-if="isUnfold" class="select__options">
        <ul>
          <li
            class="select__options__item"
            v-for="item in options"
            :key="item.value"
            @click="select(item)"
          >
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
    </NouFoldTransition>
  </div>
</template>

<script>
import NouFoldTransition from "@/components/common/FoldTransition";

export default {
  name: "SelectBase",
  components: { NouFoldTransition },
  props: {
    value: {
      type: [Number, String],
      require: true,
    },
    options: {
      type: Array,
      require: true,
      default() {
        return [];
      },
    },
    min: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectedItem() {
      return (
        this.options.find((item) => item.value === this.value) || { label: "" }
      );
    },
  },
  data() {
    return {
      isUnfold: false,
    };
  },
  methods: {
    switchUnfold() {
      if (this.isUnfold) {
        this.fold();
      } else {
        this.unfold();
      }
    },
    unfold() {
      this.isUnfold = true;
      this.$nextTick(() => {
        document.body.addEventListener("mousedown", this.fold);
      });
    },
    fold() {
      document.body.removeEventListener("mousedown", this.fold);
      this.isUnfold = false;
    },
    select(target) {
      if (target.disabled) return;
      this.$emit("input", target.value);
      this.$emit("change", target.value);
      this.fold();
    },
  },
};
</script>

<style lang="scss">
.select {
  width: 100%;
  position: relative;
  cursor: pointer;

  &__selected {
    height: 50px;

    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 3px solid var(--field);
    border-radius: 20px;
    padding: 0 20px;

    span {
      font-size: 14px;
      font-family: "Roboto Bold";
      white-space: nowrap;
    }

    i {
      color: var(--color-content);
    }
  }

  &__options {
    z-index: 1000;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    margin: 0;
    padding: 10px 0;
    background: var(--select);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    overflow: hidden;

    ul {
      max-height: 200px;
      overflow: auto;
    }

    &.left {
      left: 0;
      right: auto;
    }

    &.right {
      left: auto;
      right: 0;
    }
  }

  &__options__item {
    margin: 0;
    padding: 10px 20px;
    line-height: 20px;
    font-size: 12px;
    white-space: nowrap;

    &:hover {
      background: var(--select-hover);
      span {
        color: var(--color);
      }
    }

    display: flex;
    align-items: center;
    span {
      flex: 1;
      text-align: left;
      font-size: 12px;
      font-family: "Roboto Medium";
      color: var(--color-content);
    }
  }
}

.minSelect {
  .select__selected {
    height: 40px;
    border-radius: 12px;
    padding: 0 12px;
    span {
      font-family: "Roboto Medium";
    }
  }
}
</style>
