<template>
  <div id="nav">
    <div id="logo"></div>

    <div class="nav_item" v-for="nav in navList" :key="nav.id">
      <router-link :to="nav.to" class="item_link">
        <div class="link_icon">{{ nav.icon }}</div>
        <div class="link_name">{{ nav.name }}</div>
      </router-link>
      <div
        class="item_children"
        v-if="nav.children"
        v-show="$route.path.startsWith(nav.to)"
      >
        <router-link
          class="children_item"
          v-for="c in nav.children"
          :key="c.id"
          :to="c.to"
        >
          {{ c.name }}
        </router-link>
      </div>
    </div>

    <div id="version">{{ version }}</div>
  </div>
  <router-view class="view"></router-view>
</template>

<script>
export default {
  name: "App",
  components: {},
  setup() {
    const navList = [
      {
        id: 0,
        name: "状态",
        icon: "✨",
        to: "/",
      },
      {
        id: 1,
        name: "系统",
        icon: "🎊",
        to: "/system",
      },
      {
        id: 2,
        name: "网络",
        icon: "📡",
        to: "/network",
      },
      {
        id: 3,
        name: "服务",
        icon: "🎮",
        to: "/service",
        children: [
          {
            id: 0,
            name: "代理服务器",
            to: "/service/proxy",
          },
        ],
      },
      {
        id: 4,
        name: "设置",
        icon: "🎐",
        to: "/settings",
      },
    ];
    return {
      navList,
      version: "版本: 1.0",
    };
  },
};
</script>

<style lang="less">
@import "./assets/base.less";
body {
  margin: 0;
}
#app {
  display: flex;
}
#logo {
  width: 100%;
  height: 120px;
  background-color: white;
  background: url(./assets/logo_head.png) no-repeat;
  background-size: 100% auto;
  background-position: center;
}
#nav {
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 220px;
  background: white;
  z-index: 999;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.2);
}
.nav_item {
  margin: 8px 16px;
  display: flex;
  flex-direction: column;
  .item_link {
    display: flex;
    padding: 8px;
    text-decoration: none;
    .link_icon {
      width: 20px;
      height: 20px;
    }
    .link_name {
      flex: 1;
      text-align: center;
      padding-right: 20px;
      color: #636363;
    }
  }
  .item_children {
    display: flex;
    flex-direction: column;
    margin-left: 40px;
    font-size: 14px;
    .children_item {
      color: #636363;
      text-decoration: none;
      padding: 8px 0;
      margin-top: 16px;
      border-bottom: 2px solid transparent;
    }
    .router-link-active {
      background: transparent;
      // border-radius: 0;
      border-bottom: 2px solid @primaryColor;
    }
  }
  .router-link-active {
    background: @primaryColor;
    // border-radius: 8px;
    .link_name {
      color: white;
    }
  }
}

#version {
  margin-top: auto;
  text-align: center;
  line-height: 40px;
  font-size: 12px;
  color: #636363;
}

.view {
  flex: 1;
  background: @gray;
  height: 100vh;
  overflow-y: auto;
}
</style>
