<template>
  <div id="nav" :class="{ show: showNav }">
    <div class="logo"></div>
    <div class="nav_item" v-for="nav in navList" :key="nav.id">
      <router-link
        :to="nav.to"
        class="item_link"
        @click="showNav = nav.children !== undefined"
      >
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
          @click="showNav = false"
        >
          {{ c.name }}
        </router-link>
      </div>
    </div>
    <div id="version">{{ version }}</div>
  </div>
  <div class="nav_mobile">
    <div class="mask" v-show="showNav" @click="showNav = false"></div>
    <router-link to="/">
      <div class="logo"></div>
    </router-link>
    <svg
      t="1641785791941"
      class="icon nav_menu"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2131"
      width="32"
      height="32"
      @click="showNav = true"
    >
      <path
        d="M195.584 245.76h571.392A31.66208 31.66208 0 0 1 798.72 277.36064v15.79008a31.66208 31.66208 0 0 1-31.744 31.60064H195.584A31.66208 31.66208 0 0 1 163.84 293.15072v-15.79008A31.66208 31.66208 0 0 1 195.584 245.76z m0 236.97408H608.256a31.66208 31.66208 0 0 1 31.744 31.60064v15.79008a31.66208 31.66208 0 0 1-31.744 31.60064H195.584A31.66208 31.66208 0 0 1 163.84 530.14528v-15.81056a31.66208 31.66208 0 0 1 31.744-31.60064z m0 236.97408h571.392A31.68256 31.68256 0 0 1 798.72 751.32928v15.81056A31.66208 31.66208 0 0 1 766.976 798.72H195.584A31.66208 31.66208 0 0 1 163.84 767.11936v-15.79008a31.66208 31.66208 0 0 1 31.744-31.60064z"
        p-id="2132"
        fill="#707070"
      ></path>
    </svg>
  </div>
  <router-view class="view"></router-view>
</template>

<script>
import { ref } from "vue";
export default {
  name: "App",
  components: {},
  setup() {
    const showNav = ref(false);
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
    const handleClick = (e) => {
      console.log(e.target);
    };
    return {
      navList,
      version: "版本: 1.0",
      handleClick,
      showNav,
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
.logo {
  width: 100%;
  height: 120px;
  background-color: white;
  background: url(./assets/logo_head.png) no-repeat;
  background-size: 100% auto;
  background-position: center;
}
#nav_menu {
  display: none;
}
#nav {
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 220px;
  background: white;
  z-index: 999;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
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

.nav_mobile {
  display: none;
  align-items: center;
  z-index: 99;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 98;
  }
  .logo {
    width: 120px;
    height: 56px;
  }
  .nav_menu {
    margin-left: auto;
    margin-right: 16px;
  }
}

@media screen and (max-width: 768px) {
  #app {
    flex-direction: column;
  }
  #nav {
    position: absolute;
    transform: translateX(-100%);
    box-shadow: none;
  }
  .show {
    transform: translateX(0%) !important;
  }
  .nav_mobile {
    display: flex;
  }
}
</style>
