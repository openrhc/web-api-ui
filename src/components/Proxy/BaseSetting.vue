<template>
  <table class="shadow">
    <tr>
      <td>状态</td>
      <td>
        <span class="status" :class="{ active: isActive }">
          {{ isActive ? "运行中" : "已停止" }}
        </span>
        <span class="status" :class="{ active: isEnabled }">
          {{ isEnabled ? "允许自启" : "禁止自启" }}
        </span>
        <span class="status active" v-if="version">
          {{ version }}
        </span>
      </td>
    </tr>
    <tr>
      <td>服务</td>
      <td>
        <button @click="handleSwitch(0)">开启</button>
        <button @click="handleSwitch(1)">重启</button>
        <button @click="handleSwitch(2)">停止</button>
      </td>
    </tr>
    <tr>
      <td>主节点</td>
      <td>
        <select @change="handleMainNodeChange" v-model="mainNodeIndex">
          <option v-if="nodes.length === 0" value="-1">请先更新订阅</option>
          <option v-else-if="mainNodeIndex === -1" value="-1">
            请选择一个主节点
          </option>
          <option v-for="(n, i) in nodes" :key="i" :value="i">
            {{ n.from }} - {{ n.name }}
            {{ n.delay === 0 ? "" : "(" + n.delay + " ms" }}
            {{ n.speed === 0 ? "" : n.speed + " MiB/s )" }}
          </option>
        </select>
      </td>
    </tr>
  </table>
</template>

<script>
import axios from "axios";
import { reactive, ref } from "vue";

export default {
  name: "BaseSetting",
  setup() {
    const nodes = reactive([]);
    const mainNodeIndex = ref(-1);
    const isActive = ref(false);
    const isEnabled = ref(false);
    const version = ref("");

    // 生成配置并保存
    const generateconfig = () => {
      axios.get(`/proxy/config/save`).then((res) => {
        if (res.data.code === 0) {
          console.log("ok");
        } else {
          alert(res.data.msg);
        }
      });
    };
    // 启动/重启/关闭服务
    const handleSwitch = (i) => {
      const action = ["start", "restart", "stop"];
      axios.get(`/proxy/service/${action[i]}`).then((res) => {
        console.log(res.data.msg);
        isActive.value = i !== 2;
      });
    };
    // 切换主节点
    const handleMainNodeChange = () => {
      axios.get(`/proxy/mainnode/set?id=${mainNodeIndex.value}`).then((res) => {
        console.log(res.data.msg);
      });
    };
    // 获取节点
    const getNodes = () => {
      axios.get(`/proxy/nodes`).then((res) => {
        nodes.splice(0);
        nodes.push(...res.data.data);
        mainNodeIndex.value = nodes.findIndex((v) => v.active);
      });
    };
    // 获取服务状态
    const getServiceStatus = () => {
      axios.get(`/proxy/service/status`).then((res) => {
        const { active, enabled, version: _version } = res.data.data;
        isActive.value = active;
        isEnabled.value = enabled;
        version.value = _version;
      });
    };

    //刷新数据
    const refreshData = () => {
      getServiceStatus();
      getNodes();
    };

    return {
      isActive,
      isEnabled,
      version,
      generateconfig,
      nodes,
      mainNodeIndex,
      handleMainNodeChange,
      handleSwitch,
      refreshData,
    };
  },
};
</script>

<style lang="less" scoped>
.status {
  font-size: 12px;
  color: gray;
  padding: 0 4px;
  margin-right: 16px;
  border: 1px solid gray;
}
.active {
  color: green;
  border: 1px solid green;
}
</style>
