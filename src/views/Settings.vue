<template>
  <div>
    <table class="shadow">
      <tr
        v-for="(l, i) in list"
        :key="l.id"
        draggable="true"
        @dragstart="handleDragStart(i)"
        @dragenter="handleDragEnter(i)"
        @dragend="handleDragEnd(i)"
        :class="{ dragactive: i === currentIndex, dragfrom: i === startIndex }"
      >
        <td>{{ i }}</td>
        <td>
          {{ l.name }}
        </td>
      </tr>
    </table>
    <ProgressBar :max="100" :value="20" />
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import ProgressBar from "@/components/ProgressBar.vue";

export default {
  name: "Settings",
  components: {
    ProgressBar,
  },
  setup() {
    const currentIndex = ref(-1);
    const startIndex = ref(-1);
    const list = reactive([
      { id: 1, name: "我的id = 1" },
      { id: 2, name: "我的id = 2" },
      { id: 3, name: "我的id = 3" },
      { id: 4, name: "我的id = 4" },
      { id: 5, name: "我的id = 5" },
      { id: 6, name: "我的id = 6" },
    ]);
    const handleDragStart = (i) => {
      startIndex.value = i;
    };
    const handleDragEnter = (i) => {
      currentIndex.value = i;
    };
    const handleDragEnd = (i) => {
      console.log("handleDragEnd", i);
      const tmp = list.splice(startIndex.value, 1);
      list.splice(currentIndex.value, 0, ...tmp);
      currentIndex.value = -1;
      startIndex.value = -1;
    };
    return {
      list,
      handleDragStart,
      handleDragEnter,
      handleDragEnd,
      currentIndex,
      startIndex,
    };
  },
};
</script>

<style lang="less" scoped>
.dragactive {
  background: skyblue;
}
.dragfrom {
  background: rgba(0, 0, 0, 0.2);
}
</style>