<template>
  <div class="shadow navbar">
    <router-link
      class="nav_item"
      v-for="(v, i) in navs"
      :to="'?nav=' + i"
      :key="v"
      :class="{ active: i === navIndex }"
      @click="navIndex = i"
    >
      {{ v }}
    </router-link>
  </div>
  <div class="content">
    <div v-show="navIndex === 0">
      <XrayBaseSetting ref="xrayBaseSetting" />
    </div>
    <div v-show="navIndex === 1">
      <XraySubscribes ref="xraySubscribes" />
    </div>
    <div v-show="navIndex === 2">
      <XrayNodes ref="xrayNodes" />
    </div>
    <div v-show="navIndex === 3">
      <XrayRoutes ref="xrayRoutes" />
    </div>
  </div>
</template>
<script>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import XrayBaseSetting from "@/components/Xray/BaseSetting.vue";
import XraySubscribes from "@/components/Xray/Subscribes.vue";
import XrayNodes from "@/components/Xray/Nodes.vue";
import XrayRoutes from "@/components/Xray/Routes.vue";

export default {
  name: "Xray",
  components: {
    XrayBaseSetting,
    XraySubscribes,
    XrayNodes,
    XrayRoutes,
  },
  setup() {
    const route = useRoute();
    const queryNavIndex = Number(route.query.nav) || 0;

    const xrayBaseSetting = ref(null);
    const xrayNodes = ref(null);
    const xraySubscribes = ref(null);
    const xrayRoutes = ref(null);

    // 导航列表
    const navs = [
      "基本设置",
      "订阅列表",
      "节点列表",
      "分流策略",
      "DNS服务器",
      // "高级设置",
      // "透明代理",
    ];

    const navIndex = ref(queryNavIndex);

    watchEffect(() => {
      if (navIndex.value === 0 && xrayBaseSetting.value) {
        xrayBaseSetting.value.refreshData();
      }
      if (navIndex.value === 1 && xraySubscribes.value) {
        xraySubscribes.value.getSubscribes();
      }
      if (navIndex.value === 2 && xrayNodes.value) {
        xrayNodes.value.getNodes();
      }
      if (navIndex.value === 3 && xrayRoutes.value) {
        xrayRoutes.value.getRoutes();
      }
    });

    return {
      navs,
      navIndex,
      xrayBaseSetting,
      xraySubscribes,
      xrayNodes,
      xrayRoutes,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/base.less";
.navbar {
  display: flex;
  justify-content: center;
  margin: 16px;
  .nav_item {
    user-select: none;
    cursor: pointer;
    padding: 4px 8px;
    text-decoration: none;
    color: #5c5c5c;
  }
  .active {
    color: white;
    background-color: @primaryColor;
  }
}
.content {
  position: relative;
  margin: 16px;
  & > div {
    display: flex;
    flex-direction: column;
  }
  table {
    margin-top: 16px;
  }
}
</style>