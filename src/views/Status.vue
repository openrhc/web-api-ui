<template>
  <div class="status">
    <div class="cell shadow">
      <div class="title">系统</div>
      <table v-if="system.info">
        <tr>
          <td>主机名</td>
          <td>{{ system.info.hostname }}</td>
        </tr>
        <tr>
          <td>CPU信息</td>
          <td>{{ system.info.cpus.length }} 核</td>
        </tr>
        <tr>
          <td>内存信息</td>
          <td>{{ Math.round(system.info.totalmem / 1000000000) }} G</td>
        </tr>
        <tr>
          <td>内核版本</td>
          <td>{{ system.info.type }} {{ system.info.release }}</td>
        </tr>
        <tr>
          <td>运行时间</td>
          <td>{{ formatTime(system.info.uptime) }}</td>
        </tr>
        <tr>
          <td>平均负载</td>
          <td>{{ system.info.loadavg.join("&nbsp;&nbsp;") }}</td>
        </tr>
      </table>
    </div>

    <div class="cell shadow">
      <div class="title">内存</div>
      <table v-if="system.mem">
        <tr>
          <td>使用率</td>
          <td>
            <ProgressBar :max="system.mem.total" :value="system.mem.used" />
          </td>
        </tr>
      </table>
      <table v-else>
        <tr>
          <td>使用率</td>
          <td>
            <ProgressBar
              :max="system.info.totalmem"
              :value="system.info.totalmem - system.info.freemem"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import axios from "axios";
import ProgressBar from "@/components/ProgressBar.vue";

export default {
  name: "Status",
  components: {
    ProgressBar,
  },
  setup() {
    // 基本信息
    const system = reactive({
      info: null,
      mem: null,
    });
    const getStatus = () => {
      axios.get("http://192.168.0.10:7788/system/status").then((res) => {
        system.info = res.data.data;
        if (res.data.data.mem) {
          const { MemTotal, Shmem, MemFree, Buffers, Cached, SReclaimable } =
            res.data.data.mem;
          system.mem = {};
          system.mem.total = MemTotal;
          system.mem.free = MemFree;
          system.mem.used =
            MemTotal + Shmem - MemFree - Buffers - Cached - SReclaimable;
        }
      });
    };
    const formatTime = (s) => {
      const day = Math.floor(s / 86400);
      s = s - day * 86400;
      const hour = Math.floor(s / 3600);
      s = s - hour * 3600;
      const min = Math.floor(s / 60);
      s = Math.floor(s - min * 60);
      return day + "d " + hour + "h " + min + "m " + s + "s";
    };
    getStatus();
    return {
      system,
      formatTime,
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