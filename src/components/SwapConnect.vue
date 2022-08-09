<template>
  <div class="connect">
    <div class="wallet-list g-scrollbar">
      <div
        class="g-clickable wallet-list__item"
        v-for="(item, i) in list"
        :key="i"
        @click="connect(item)"
      >
        <img :src="item.icon" class="icon" />
        <div class="name">
          <span>{{ item.name }}</span>
        </div>
        <div class="padding">
          <span v-if="item.name === name">Pending...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tryConnect, genSdk } from "../init";
const { config } = genSdk;
const list = config.wallets.walletList;

export default {
  props: {
    chain: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      name: "",
    };
  },
  computed: {
    list() {
      return list.filter((item, i) => {
        return item.supportChains.indexOf(this.chain) >= 0;
      });
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async connect(item) {
      const { name } = item;
      this.name = name;
      const sdk = await tryConnect(this.chain, name);
      this.name = "";
      this.$emit("connect", sdk);
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-list {
  max-height: 400px;
  overflow: auto;
  margin: 0 -30px;
  padding: 0 30px;

  &__item {
    cursor: pointer;
    height: 54px;
    display: grid;
    align-items: center;
    grid-gap: 8px;
    grid-template-columns: 35px 120px 1fr;
    padding: 0 30px;
    border-radius: 30px;
    background-color: var(--field);
    margin-bottom: 15px;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--option-color);

      .name {
        color: var(--color);
      }
    }

    .icon {
      width: 30px;
      border-radius: 15px;
    }

    .name {
      color: var(--color-content);
      font-size: 14px;
      font-family: "Roboto Bold";
    }

    .padding {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      span {
        font-size: 14px;
        font-family: "Roboto Medium";
        color: var(--color-des);
      }
    }
  }
}
</style>
