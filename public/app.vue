<template>
  <div class="example">
    <gen-widget />
  </div>
</template>
<script>
import genWidget from "../src/index.vue";
export default {
  components: {
    genWidget,
  },
  data: function () {
    return {};
  },
  methods: {},
};
</script>
<style lang="less">
.example {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
