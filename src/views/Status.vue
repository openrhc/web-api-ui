<template>
  <div class="status">
    <div class="cell shadow">
      <div class="title">系统</div>
      <table>
        <tr>
          <td>主机名</td>
          <td>{{ system.hostname }}</td>
        </tr>
        <tr>
          <td>CPU信息</td>
          <td>{{ system.cpus.length }} 核</td>
        </tr>
        <tr>
          <td>内存信息</td>
          <td>{{ Math.round(system.totalmem / 1000000000) }} G</td>
        </tr>
        <tr>
          <td>内核版本</td>
          <td>{{ system.type }}  {{ system.release }}</td>
        </tr>
        <tr>
          <td>运行时间</td>
          <td>{{ system.uptime }}</td>
        </tr>
        <tr>
          <td>平均负载</td>
          <td>{{ system.loadavg.join(', ') }}</td>
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
    const system = {
      arch: "arm64",
      freemem: 1123536896,
      totalmem: 2021146624,
      release: "5.14.15-openrhc",
      uptime: 6129.65,
      platform: "linux",
      cpus: [
        {
          model: "unknown",
          speed: 1000,
          times: {
            user: 227890,
            nice: 0,
            sys: 86910,
            idle: 5656330,
            irq: 42160,
          },
        },
        {
          model: "unknown",
          speed: 1000,
          times: {
            user: 237430,
            nice: 0,
            sys: 76860,
            idle: 5588980,
            irq: 48380,
          },
        },
        {
          model: "unknown",
          speed: 1000,
          times: {
            user: 276100,
            nice: 0,
            sys: 80800,
            idle: 5699850,
            irq: 21700,
          },
        },
        {
          model: "unknown",
          speed: 1000,
          times: {
            user: 262370,
            nice: 0,
            sys: 76100,
            idle: 5729020,
            irq: 19310,
          },
        },
      ],
      loadavg: [0.12, 0.2, 0.18],
      hostname: "alarm",
      networkInterfaces: {
        lo: [
          {
            address: "127.0.0.1",
            netmask: "255.0.0.0",
            family: "IPv4",
            mac: "00:00:00:00:00:00",
            internal: true,
            cidr: "127.0.0.1/8",
          },
        ],
        eth0: [
          {
            address: "192.168.0.10",
            netmask: "255.255.255.0",
            family: "IPv4",
            mac: "02:d8:d7:71:09:f4",
            internal: false,
            cidr: "192.168.0.10/24",
          },
        ],
      },
      version: "#1 SMP PREEMPT Thu Oct 28 01:37:07 CST 2021",
      type: "Linux",
    };
    // 内存信息
    const systemMem = [
      {
        desp: "可用数",
        k: "s",
        v: [847, 999],
      },
      {
        desp: "已缓存",
        k: "a",
        v: [4, 999],
      },
    ];
    return {
      system,
      systemMem,
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
  .title {
    font-size: 20px;
    font-weight: bold;
    margin: 8px 16px;
  }
}
</style>