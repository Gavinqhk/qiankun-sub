<template>
  <div class="virtualList">
    <h1>k-tools</h1>
    <div class="container">
      <p>{{ msg }}</p>
      <button @click="send(msg)">发送</button>
      <router-link to="/vList">vList</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "KTools",
  setup() {
    const send = (msg: string) => {
      window.postMessage(msg, "*");
    };
    return {
      msg: JSON.stringify({ key: "k1", value: "v1" }),
      send,
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
