<template>
  <div class="virtualList">
    <h1>virtualList</h1>
    <div
      class="container"
      :style="`height: ${containerHeight}px`"
      @scroll="handleScroll($event)"
    >
      <div class="mark" :style="`height: ${itemSize * list.length}px;`"></div>
      <ul class="list" :style="`transform: translateY(${translateY}px);`">
        <li v-for="i in vList" :key="i">
          {{ i }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";

export default defineComponent({
  name: "VirtualList",
  setup() {
    const itemSize = 40;
    const containerHeight = 400;
    const scrollTop = ref<number>(0);
    const list: Array<string> = [];
    for (let i = 0; i <= 1011; i++) {
      list.push("item" + (i + 1));
    }
    const itemCount = computed(() => {
      return Math.ceil(containerHeight / itemSize);
    });
    const startIndex = computed(() => {
      return Math.floor(scrollTop.value / itemSize);
    });
    const endIndex = computed(() => {
      return Math.min(startIndex.value + itemCount.value, list.length - 1);
    });
    const vList = computed(() => {
      return list.slice(startIndex.value, endIndex.value);
    });
    const translateY = computed(() => {
      return scrollTop.value - (scrollTop.value % itemSize);
    });
    const handleScroll = (e: Event) => {
      scrollTop.value = (e.target as HTMLElement).scrollTop;
    };

    return {
      list,
      vList,
      itemSize,
      translateY,
      containerHeight,
      handleScroll,
    };
  },
});
</script>
<style scoped>
.container {
  position: relative;
  overflow: auto;
}
.mark {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
li {
  line-height: 40px;
}
</style>
