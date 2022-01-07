<template>
  <div class="routing">
    <div class="routing_item">
      <div class="title">直连</div>
      <textarea
        class="shadow"
        v-model="directList"
        @blur="handleDirectChange"
      ></textarea>
    </div>
    <div class="routing_item">
      <div class="title">代理</div>
      <textarea
        class="shadow"
        v-model="proxyList"
        @blur="handleProxyChange"
      ></textarea>
    </div>
    <div class="routing_item">
      <div class="title">拦截</div>
      <textarea
        class="shadow"
        v-model="blockList"
        @blur="handleBlockChange"
      ></textarea>
    </div>
  </div>
  <table class="shadow">
    <tr>
      <td></td>
      <td>规则</td>
      <td>入站</td>
      <td>出站</td>
      <td>备注</td>
      <td>操作</td>
    </tr>
    <tr
      v-for="(r, i) in routes"
      :key="i"
      draggable="true"
      @dragstart="handleDragStart(i)"
      @dragenter="handleDragEnter(i)"
      @dragend="handleDragEnd(i)"
      :class="{ dragactive: i === toIndex, dragfrom: i === fromIndex }"
    >
      <td>{{ i + 1 }}</td>
      <td @dblclick="r.showrule = false">
        <div v-show="r.showrule">
          {{ r.editrule }}
        </div>
        <select
          v-show="!r.showrule"
          @blur="r.showrule = true"
          v-model="r.editrule"
        >
          <option v-for="(t, j) in type" :key="j" :value="t">
            {{ t }}
          </option>
        </select>
      </td>
      <td @dblclick="r.showvalue = false">
        <div v-show="r.showvalue">
          {{ r.editvalue }}
        </div>
        <input
          v-show="!r.showvalue"
          type="text"
          v-model="r.editvalue"
          @blur="r.showvalue = true"
        />
      </td>
      <td @dblclick="r.showoutboundtag = false">
        <div v-show="r.showoutboundtag">
          {{ r.editoutboundtag }}
        </div>
        <select
          v-show="!r.showoutboundtag"
          v-model="r.editoutboundtag"
          @blur="r.showoutboundtag = true"
        >
          <option :value="r.outboundTag">
            {{ r.outboundTag }}
          </option>
          <option value="direct">direct</option>
          <option value="proxy">proxy</option>
          <option value="block">block</option>
          <!-- 代理 -->
          <option v-for="(n, j) in nodes" :key="j" :value="n.name">
            {{ n.from }} - {{ n.name }}
            {{ n.delay === 0 ? "" : "(" + n.delay + " ms" }}
            {{ n.speed === 0 ? "" : n.speed + " MiB/s )" }}
          </option>
        </select>
      </td>
      <td @dblclick="r.showdesp = false">
        <div v-show="r.showdesp">{{ r.editdesp }}</div>
        <input
          type="text"
          v-show="!r.showdesp"
          v-model="r.editdesp"
          @blur="r.showdesp = true"
        />
      </td>
      <td>
        <button class="danger" @click="handleDelRoute(i)">删除</button>
        <button
          v-show="
            r.editrule !== r.rule ||
            r.editoutboundtag !== r.outboundTag ||
            r.editvalue !== r.value ||
            r.editdesp !== r.desp
          "
          @click="handleSetRoute(i)"
        >
          保存
        </button>
      </td>
    </tr>
  </table>
  <table class="shadow">
    <tr>
      <td>规则</td>
      <td>入站</td>
      <td>出站</td>
      <td>备注</td>
    </tr>
    <tr>
      <td>
        <select v-model="newRoute.rule">
          <option v-for="(t, j) in type" :key="j">
            {{ t }}
          </option>
        </select>
      </td>
      <td>
        <input v-model="newRoute.value" />
      </td>
      <td>
        <select v-model="newRoute.outboundTag">
          <option value="direct">direct</option>
          <option value="proxy">proxy</option>
          <option value="block">block</option>
          <!-- 代理 -->
          <option v-for="(n, j) in nodes" :key="j" :value="n.name">
            {{ n.from }} - {{ n.name }}
            {{ n.delay === 0 ? "" : "(" + n.delay + " ms" }}
            {{ n.speed === 0 ? "" : n.speed + " MiB/s )" }}
          </option>
        </select>
      </td>
      <td>
        <input v-model="newRoute.desp" />
      </td>
      <td>
        <button @click="handleAddRoute">新增</button>
      </td>
    </tr>
  </table>
</template>

<script>
import { reactive, ref } from "vue";
import axios from "axios";

export default {
  name: "Routes",
  setup() {
    const directList = ref("");
    const proxyList = ref("");
    const blockList = ref("");
    let directListOld = "";
    let proxyListOld = "";
    let blockListOld = "";
    // 分流类别
    const type = ["domain", "ip", "protocol", "network", "port", "inboundTag"];
    const nodes = reactive([]);
    const routes = reactive([]);
    const newRoute = reactive({
      outboundTag: "",
      desp: "",
      rule: "domain",
      value: "",
    });
    // 拖动
    const fromIndex = ref(-1);
    const toIndex = ref(-1);
    // 获取分流规则
    const getRoutes = () => {
      axios.get(`/xray/routes`).then((res) => {
        nodes.splice(0);
        routes.splice(0);
        const {
          proxyList: a,
          directList: b,
          blockList: c,
          routes: d,
          nodes: e,
        } = res.data.data;
        proxyList.value = a.join("\n");
        directList.value = b.join("\n");
        blockList.value = c.join("\n");
        proxyListOld = proxyList.value;
        directListOld = directList.value;
        blockListOld = blockList.value;
        nodes.push(...e);
        const tmp = d.map((v) => {
          let value = v.value;
          if (typeof value === "object") {
            value = value.join(",");
          }
          return {
            ...v,
            value,
            editoutboundtag: v.outboundTag,
            editdesp: v.desp,
            editrule: v.rule,
            editvalue: value,
            showoutboundtag: true,
            showdesp: true,
            showrule: true,
            showvalue: true,
          };
        });
        routes.push(...tmp);
      });
    };

    // 删除分流规则
    const handleDelRoute = (i) => {
      axios.get(`/xray/route/${i}/del`).then((res) => {
        if (res.data.code === 0) {
          routes.splice(i, 1);
        } else {
          alert(res.data.msg);
        }
      });
    };

    // 增加分流规则
    const handleAddRoute = () => {
      if (
        !newRoute.value ||
        !newRoute.rule ||
        !newRoute.outboundTag ||
        !newRoute.desp
      ) {
        return;
      }
      axios
        .get(`/xray/route/${routes.length}/set`, {
          params: newRoute,
        })
        .then((res) => {
          if (res.data.code === 0) {
            routes.push({
              ...newRoute,
              editoutboundtag: newRoute.outboundTag,
              editdesp: newRoute.desp,
              editrule: newRoute.rule,
              editvalue: newRoute.value,
              showoutboundtag: true,
              showdesp: true,
              showrule: true,
              showvalue: true,
            });
            newRoute.outboundTag = "";
            newRoute.desp = "";
            newRoute.rule = "domain";
            newRoute.value = "";
          } else {
            alert(res.data.msg);
          }
        });
    };

    // 设置分流
    const handleSetRoute = (i) => {
      axios
        .get(`/xray/route/${i}/set`, {
          params: {
            outboundTag: routes[i].editoutboundtag,
            desp: routes[i].editdesp,
            rule: routes[i].editrule,
            value: routes[i].editvalue,
          },
        })
        .then((res) => {
          if (res.data.code === 0) {
            routes[i].outboundTag = routes[i].editoutboundtag;
            routes[i].desp = routes[i].editdesp;
            routes[i].rule = routes[i].editrule;
            routes[i].value = routes[i].editvalue;
          } else {
            alert(res.data.msg);
          }
        });
    };

    // 提交直连列表
    const handleDirectChange = () => {
      if (directListOld === directList.value) {
        return;
      }
      axios
        .get(`/xray/directlist/set`, {
          params: {
            list: directList.value,
          },
        })
        .then((res) => {
          if (res.data.code === 0) {
            directListOld = directList.value;
            console.log(res.data.msg);
          } else {
            alert(res.data.msg);
          }
        });
    };
    // 提交代理列表
    const handleProxyChange = () => {
      if (proxyListOld === proxyList.value) {
        return;
      }
      axios
        .get(`/xray/proxylist/set`, {
          params: {
            list: proxyList.value,
          },
        })
        .then((res) => {
          if (res.data.code === 0) {
            proxyListOld = proxyList.value;
            console.log(res.data.msg);
          } else {
            alert(res.data.msg);
          }
        });
    };
    // 提交拦截列表
    const handleBlockChange = () => {
      if (blockListOld === blockList.value) {
        return;
      }
      axios
        .get(`/xray/blocklist/set`, {
          params: {
            list: blockList.value,
          },
        })
        .then((res) => {
          if (res.data.code === 0) {
            blockListOld = blockList.value;
            console.log(res.data.msg);
          } else {
            alert(res.data.msg);
          }
        });
    };

    // 拖动开始
    const handleDragStart = (i) => {
      fromIndex.value = i;
    };
    const handleDragEnter = (i) => {
      toIndex.value = i;
    };
    // 拖动结束
    const handleDragEnd = () => {
      if (fromIndex.value === toIndex.value) {
        fromIndex.value = -1;
        toIndex.value = -1;
        return;
      }
      axios
        .get(`/xray/routes/sort?from=${fromIndex.value}&to=${toIndex.value}`)
        .then((res) => {
          console.log(res.data.msg);
          const tmp = routes.splice(fromIndex.value, 1);
          routes.splice(toIndex.value, 0, ...tmp);
          fromIndex.value = -1;
          toIndex.value = -1;
        });
    };

    return {
      directList,
      proxyList,
      blockList,
      nodes,
      routes,
      type,
      handleDelRoute,
      handleAddRoute,
      handleSetRoute,
      newRoute,
      getRoutes,
      handleDirectChange,
      handleProxyChange,
      handleBlockChange,
      handleDragStart,
      handleDragEnter,
      handleDragEnd,
      fromIndex,
      toIndex,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/base.less";
.routing {
  display: flex;
  justify-content: space-between;
  .routing_item {
    display: flex;
    flex-direction: column;
    background: white;
    flex: 1;
    .title {
      color: #5c5c5c;
      text-align: center;
      padding: 8px 0;
      border-bottom: 1px solid @gray;
    }
    textarea {
      min-height: 160px;
      font-size: 16px;
    }
  }
  .routing_item:nth-of-type(2n) {
    margin: 0 16px;
  }
}
table {
  margin-top: 16px;
  td {
    word-break: break-all;
    &:nth-child(2) {
      max-width: 260px;
    }
  }
  .dragactive {
    color: white;
    background: @primaryColor !important;
  }
  .dragfrom {
    background: rgba(0, 0, 0, 0.2) !important;
  }
}
</style>