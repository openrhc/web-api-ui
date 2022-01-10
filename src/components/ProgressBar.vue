<template>
  <div class="progressbar">
    <div class="progress" :style="{ width: (value * 100) / max + '%' }">
      {{ ((value * 100) / max).toFixed(2) + "%" }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    max: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  setup() {},
};
</script>
<style lang="less" scoped>
@import "../assets/base.less";
.progressbar {
  width: 100%;
  border: 1px solid @primaryColor;
  box-sizing: border-box;
  .progress {
    box-sizing: border-box;
    padding-left: 4px;
    font-size: 12px;
    line-height: 22px;
    color: white;
    text-shadow: 1px 1px 2px gray;
    width: 20%;
    height: 100%;
    background: @primaryColor;
  }
}
</style>