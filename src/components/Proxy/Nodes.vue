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
    <tr
      v-for="(n, i) in nodes"
      :key="i"
      :class="{
        active: n.active,
        dragactive: i === toIndex,
        dragfrom: i === fromIndex,
      }"
      draggable="true"
      @dragstart="handleDragStart(i)"
      @dragenter="handleDragEnter(i)"
      @dragend="handleDragEnd(i)"
    >
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
        <button @click="handleSwitchNode(i)">切换</button>
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
        <input v-model="sharelink" />
      </td>
      <td>
        <button @click="handleAddNode">添加</button>
      </td>
    </tr>
  </table>
</template>
<script>
import { reactive, ref } from "vue";
import axios from "axios";

export default {
  name: "Nodes",
  components: {},
  setup() {
    // 节点列表
    const nodes = reactive([]);
    const sharelink = ref("");
    // 拖动
    const fromIndex = ref(-1);
    const toIndex = ref(-1);
    // 获取节点
    const getNodes = () => {
      axios.get(`/proxy/nodes`).then((res) => {
        nodes.splice(0);
        nodes.push(...res.data.data);
      });
    };
    // 删除节点
    const handleDelNode = (i) => {
      axios.get(`/proxy/node/${i}/del`).then(() => {
        nodes.splice(i, 1);
      });
    };
    // 切换主节点
    const handleSwitchNode = (i) => {
      axios.get(`/proxy/mainnode/set?id=${i}`).then((res) => {
        if (res.data.code === 0) {
          console.log(res.data.msg);
          const old = nodes.find((v) => v.active);
          if (old) {
            old.active = false;
          }
          nodes[i].active = true;
        }
      });
    };
    // 测试节点
    const handleTestNode = (i) => {
      nodes[i].tips = "Loading...";
      axios.get(`/proxy/node/${i}/test`).then((res) => {
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
      axios
        .post(`/proxy/nodes/add`, {
          sharelink: sharelink.value,
        })
        .then((res) => {
          if (res.data.code === 0) {
            nodes.push(...res.data.data);
            sharelink.value = "";
          } else {
            console.log(res.data.msg);
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
        .get(`/proxy/nodes/sort?from=${fromIndex.value}&to=${toIndex.value}`)
        .then((res) => {
          console.log(res.data.msg);
          const tmp = nodes.splice(fromIndex.value, 1);
          nodes.splice(toIndex.value, 0, ...tmp);
          fromIndex.value = -1;
          toIndex.value = -1;
        });
    };
    return {
      nodes,
      handleDelNode,
      handleTestNode,
      handleAddNode,
      handleSwitchNode,
      sharelink,
      getNodes,
      fromIndex,
      toIndex,
      handleDragStart,
      handleDragEnter,
      handleDragEnd,
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
@media screen and (max-width: 768px) {
  .content {
    overflow: auto;
    table {
      min-width: 600px;
    }
  }
}
</style>