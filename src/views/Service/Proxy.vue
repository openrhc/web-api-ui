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
      <ProxyBaseSetting ref="proxyBaseSetting" />
    </div>
    <div v-show="navIndex === 1">
      <ProxySubscribes ref="proxySubscribes" />
    </div>
    <div v-show="navIndex === 2">
      <ProxyNodes ref="proxyNodes" />
    </div>
    <div v-show="navIndex === 3">
      <ProxyRoutes ref="proxyRoutes" />
    </div>
  </div>
</template>
<script>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import ProxyBaseSetting from "@/components/Proxy/BaseSetting.vue";
import ProxySubscribes from "@/components/Proxy/Subscribes.vue";
import ProxyNodes from "@/components/Proxy/Nodes.vue";
import ProxyRoutes from "@/components/Proxy/Routes.vue";

export default {
  name: "Proxy",
  components: {
    ProxyBaseSetting,
    ProxySubscribes,
    ProxyNodes,
    ProxyRoutes,
  },
  setup() {
    const route = useRoute();
    const queryNavIndex = Number(route.query.nav) || 0;

    const proxyBaseSetting = ref(null);
    const proxyNodes = ref(null);
    const proxySubscribes = ref(null);
    const proxyRoutes = ref(null);

    // 导航列表
    const navs = [
      "基本设置",
      "订阅列表",
      "节点列表",
      "分流策略",
      // "DNS服务器",
      // "高级设置",
      // "透明代理",
    ];

    const navIndex = ref(queryNavIndex);

    watchEffect(() => {
      if (navIndex.value === 0 && proxyBaseSetting.value) {
        proxyBaseSetting.value.refreshData();
      }
      if (navIndex.value === 1 && proxySubscribes.value) {
        proxySubscribes.value.getSubscribes();
      }
      if (navIndex.value === 2 && proxyNodes.value) {
        proxyNodes.value.getNodes();
      }
      if (navIndex.value === 3 && proxyRoutes.value) {
        proxyRoutes.value.getRoutes();
      }
    });

    return {
      navs,
      navIndex,
      proxyBaseSetting,
      proxySubscribes,
      proxyNodes,
      proxyRoutes,
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