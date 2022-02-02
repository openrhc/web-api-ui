<template>
  <table class="shadow">
    <tr>
      <td></td>
      <td>名称</td>
      <td>订阅地址</td>
      <td>包含关键词（|）</td>
      <td>排除关键词（|）</td>
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
      <td @dblclick="s.showinclude = false">
        <div v-show="s.showinclude">{{ s.editinclude }}</div>
        <input
          v-show="!s.showinclude"
          v-model="s.editinclude"
          @blur="s.showinclude = true"
        />
      </td>
      <td @dblclick="s.showexclude = false">
        <div v-show="s.showexclude">{{ s.editexclude }}</div>
        <input
          v-show="!s.showexclude"
          v-model="s.editexclude"
          @blur="s.showexclude = true"
        />
      </td>
      <td>
        <button @click="handleUpdateSub(i)">更新订阅</button>
      </td>
      <td>
        <button class="normal" @click="handleEmptySub(i)">清空</button>
        <button class="danger" @click="handleDelSub(i)">删除</button>
        <button
          v-show="
            s.name !== s.editname ||
            s.url !== s.editurl ||
            s.include !== s.editinclude ||
            s.exclude !== s.editexclude
          "
          @click="handleSetSub(i)"
        >
          保存
        </button>
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
      include: "",
      exclude: "",
    });
    // 获取订阅
    const getSubscribes = () => {
      axios.get(`/proxy/subscribes`).then((res) => {
        subscribes.splice(0);
        const tmp = res.data.data.map((v) => {
          return {
            ...v,
            showname: true,
            showurl: true,
            showinclude: true,
            showexclude: true,
            editname: v.name,
            editurl: v.url,
            editinclude: v.include,
            editexclude: v.exclude,
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
        .get(`/proxy/subscribe/${subscribes.length}/set`, {
          params: {
            name: newSub.name,
            url: newSub.url,
            include: newSub.include,
            exclude: newSub.exclude,
          },
        })
        .then(() => {
          subscribes.push({
            ...newSub,
            editname: newSub.name,
            editurl: newSub.url,
            editinclude: newSub.include,
            editexclude: newSub.exclude,
            showname: true,
            showurl: true,
            showinclude: true,
            showexclude: true,
          });
          newSub.name = "";
          newSub.url = "";
          newSub.include = "";
          newSub.exclude = "";
        });
    };
    // 保存订阅修改
    const handleSetSub = (i) => {
      axios
        .get(`/proxy/subscribe/${i}/set`, {
          params: {
            name: subscribes[i].editname,
            url: subscribes[i].editurl,
            include: subscribes[i].editinclude,
            exclude: subscribes[i].editexclude,
          },
        })
        .then(() => {
          subscribes[i].name = subscribes[i].editname;
          subscribes[i].url = subscribes[i].editurl;
          subscribes[i].include = subscribes[i].editinclude;
          subscribes[i].exclude = subscribes[i].editexclude;
          subscribes[i].showname = true;
          subscribes[i].showurl = true;
          subscribes[i].showinclude = true;
          subscribes[i].showexclude = true;
        });
    };
    // 删除订阅
    const handleDelSub = (i) => {
      axios.get(`/proxy/subscribe/${i}/del`).then(() => {
        subscribes.splice(i, 1);
      });
    };
    // 清空订阅
    const handleEmptySub = (i) => {
      axios.get(`/proxy/subscribe/${i}/empty`).then((res) => {
        console.log(res.data.msg);
      });
    };
    // 更新订阅
    const handleUpdateSub = (i) => {
      axios.get(`/proxy/subscribe/${i}/update`).then((res) => {
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
      handleSetSub,
      handleUpdateSub,
      handleEmptySub,
      getSubscribes,
    };
  },
};
</script>

<style lang="less" scoped>
table {
  margin-bottom: 16px;
  td {
    &:nth-child(3) {
      word-break: break-all;
      word-wrap: break-word;
    }
  }
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