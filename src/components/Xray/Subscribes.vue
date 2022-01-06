<template>
  <table class="shadow">
    <tr>
      <td></td>
      <td>名称</td>
      <td>订阅地址</td>
      <td>更新</td>
      <td>操作</td>
    </tr>
    <tr v-for="(s, i) in subscribes" :key="i">
      <td>
        {{ i + 1 }}
      </td>
      <td @dblclick="s.showname = false">
        <div v-show="s.showname">{{ s.editname }}</div>
        <input
          v-show="!s.showname"
          v-model="s.editname"
          @blur="s.showname = true"
        />
      </td>
      <td @dblclick="s.showurl = false">
        <div v-show="s.showurl">{{ s.editurl }}</div>
        <input
          v-show="!s.showurl"
          v-model="s.editurl"
          @blur="s.showurl = true"
        />
      </td>
      <td>
        <button @click="handleUpdateSub(i)">更新订阅</button>
      </td>
      <td>
        <button class="danger" @click="handleDelSub(i)">删除</button>
      </td>
      <td v-show="s.name !== s.editname || s.url !== s.editurl">
        <button @click="handleSaveSub(i)">保存</button>
      </td>
    </tr>
  </table>
  <table class="shadow">
    <tr>
      <td>名称</td>
      <td>订阅地址</td>
      <td>添加</td>
    </tr>
    <tr>
      <td>
        <input v-model="newSub.name" />
      </td>
      <td>
        <input v-model="newSub.url" />
      </td>
      <td>
        <button @click="handleAddSub">添加</button>
      </td>
    </tr>
  </table>
</template>
<script>
import { reactive } from "vue";
import axios from "axios";

export default {
  name: "Subscribes",
  components: {},
  setup() {
    // 订阅列表
    const subscribes = reactive([]);
    // 新的订阅
    const newSub = reactive({
      name: "",
      url: "",
    });
    // 获取订阅
    const getSubscribes = () => {
      axios.get(`/xray/subscribes`).then((res) => {
        subscribes.splice(0);
        const tmp = res.data.data.map((v) => {
          return {
            ...v,
            showname: true,
            showurl: true,
            editname: v.name,
            editurl: v.url,
          };
        });
        subscribes.push(...tmp);
      });
    };
    // 添加订阅
    const handleAddSub = () => {
      if (!newSub.name || !newSub.url) {
        return;
      }
      if (subscribes.find((v) => v.name === newSub.name)) {
        return alert("换个名称");
      }
      axios
        .get(`/xray/subscribe/${subscribes.length}/set`, {
          params: {
            name: newSub.name,
            url: newSub.url,
          },
        })
        .then(() => {
          subscribes.push({
            ...newSub,
            editname: newSub.name,
            editurl: newSub.url,
            showname: true,
            showurl: true,
          });
          newSub.name = "";
          newSub.url = "";
        });
    };
    // 保存订阅修改
    const handleSaveSub = (i) => {
      axios
        .get(`/xray/subscribe/${i}/set`, {
          params: {
            name: subscribes[i].editname,
            url: subscribes[i].editurl,
          },
        })
        .then(() => {
          subscribes[i].name = subscribes[i].editname;
          subscribes[i].url = subscribes[i].editurl;
          subscribes[i].showname = true;
          subscribes[i].showurl = true;
        });
    };
    // 删除订阅
    const handleDelSub = (i) => {
      axios.get(`/xray/subscribe/${i}/del`).then(() => {
        subscribes.splice(i, 1);
      });
    };
    // 更新订阅
    const handleUpdateSub = (i) => {
      axios.get(`/xray/subscribe/${i}/update`).then((res) => {
        if (res.data.code !== 0) {
          alert(res.data.msg);
        }
      });
    };

    return {
      subscribes,
      newSub,
      handleAddSub,
      handleDelSub,
      handleSaveSub,
      handleUpdateSub,
      getSubscribes,
    };
  },
};
</script>

<style lang="less" scoped>
table {
  margin-bottom: 16px;
}
</style>