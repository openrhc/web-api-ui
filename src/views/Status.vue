<template>
  <div class="status">
    <div class="cell shadow">
      <div class="title">系统</div>
      <table>
        <tr v-for="v in systemInfo" :key="v.k">
          <td>{{ v.desp }}</td>
          <td>{{ v.v }}</td>
        </tr>
      </table>
    </div>

    <div class="cell shadow">
      <div class="title">内存</div>
      <table>
        <tr v-for="v in systemMem" :key="v.k">
          <td>{{ v.desp }}</td>
          <td>{{ v.v }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Status",
  components: {},
  setup() {
    // 基本信息
    const systemInfo = [
      {
        k: "hostname",
        v: "alarm",
        desp: "主机名",
      },
      {
        k: "hostname",
        v: "1520MHz 28°C",
        desp: "CPU信息",
      },
      {
        k: "hostname",
        v: "openrhc-5.15.6",
        desp: "内核版本",
      },
      {
        k: "hostname",
        v: "Mon Sep 22:42:02 2021",
        desp: "本地时间",
      },
      {
        k: "hostname",
        v: "1d 3h 40m 23s",
        desp: "运行时间",
      },
      {
        k: "hostname",
        v: "0.06 0.02 0.06",
        desp: "平均负载",
      },
      {
        k: "hostname",
        v: "5 %",
        desp: "CPU使用率(%)",
      },
    ];
    // 内存信息
    const systemMem = [
      {
        desp: '可用数',
        k: 's',
        v: [847, 999]
      },
      {
        desp: '已缓存',
        k: 'a',
        v: [4, 999]
      }
    ]
    return {
      systemInfo,
      systemMem
    };
  },
};
</script>

<style lang="less" scoped>
@import "../assets/base.less";
.cell {
  display: flex;
  margin: 16px;
  flex-direction: column;
  .title{
    font-size: 20px;
    font-weight: bold;
    margin: 8px 16px;
  }
}
</style>