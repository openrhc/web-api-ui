<template>
  <table class="shadow">
    <tr>
      <td></td>
      <td>所属组</td>
      <td>协议</td>
      <td>名称</td>
      <td>延迟 / 速率</td>
      <td>测速</td>
      <td>操作</td>
    </tr>
    <tr v-for="(n, i) in nodes" :key="i" :class="{ active: n.active }">
      <td>
        {{ i + 1 }}
      </td>
      <td>
        {{ n.from }}
      </td>
      <td>
        {{ n.proto }}
      </td>
      <td>
        {{ n.name }}
      </td>
      <td>
        <template v-if="n.tips">
          {{ n.tips }}
        </template>
        <template v-else>
          {{ n.delay === 0 ? "" : n.delay + " ms" }}
          {{ n.speed === 0 ? "" : n.speed + " MiB/s" }}
        </template>
      </td>
      <td>
        <button @click="handleTestNode(i)">测试</button>
      </td>
      <td>
        <button class="danger" @click="handleDelNode(i)">删除</button>
      </td>
    </tr>
  </table>
  <table class="shadow">
    <tr>
      <td>分享链接</td>
      <td>添加</td>
    </tr>
    <tr>
      <td>
        <input />
      </td>
      <td>
        <button>添加</button>
      </td>
    </tr>
  </table>
</template>
<script>
import { reactive } from "vue";
import axios from "axios";

export default {
  name: "Nodes",
  components: {},
  setup() {
    // 节点列表
    const nodes = reactive([]);
    const editNode = reactive({
      proto: "",
      name: "",
      from: "",
      delay: 0,
      speed: 0,
      outbound: {},
      original: "",
    });
    // 获取节点
    const getNodes = () => {
      axios.get(`/xray/nodes`).then((res) => {
        nodes.splice(0);
        nodes.push(...res.data.data);
      });
    };
    // 删除节点
    const handleDelNode = (i) => {
      axios.get(`/xray/node/${i}/del`).then(() => {
        nodes.splice(i, 1);
      });
    };
    // 测试节点
    const handleTestNode = (i) => {
      nodes[i].tips = "Loading...";
      axios.get(`/xray/node/${i}/test`).then((res) => {
        if (res.data.code === 0) {
          const { delay, speed } = res.data.data;
          nodes[i].delay = delay;
          nodes[i].speed = speed;
          nodes[i].tips = "";
        } else {
          nodes[i].tips = res.data.msg;
        }
      });
    };
    // 增加节点
    const handleAddNode = () => {
      console.log(123);
    };
    // 保存节点
    const handleSaveNode = () => {
      console.log(123);
    };

    return {
      nodes,
      handleDelNode,
      handleTestNode,
      editNode,
      handleSaveNode,
      handleAddNode,
      // 父组件调用
      getNodes,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/base.less";
.active {
  color: white;
  background: @primaryColor !important;
  button {
    background: white;
  }
}
table {
  margin-bottom: 16px;
}
</style>