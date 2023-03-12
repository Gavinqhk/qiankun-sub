<template>
  <div class="funnel">
    <Funnel :options="options"></Funnel>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import Funnel from "@/components/funnel/Funnel.vue";

export default defineComponent({
  name: "Funnel",
  components: {
    Funnel,
  },
  setup() {
    const options = reactive({
      title: {
        text: "漏斗图数据",
        subText: "漏斗图副标题",
      },
      labelWidth: "230px",
      size: "large",
      // height: "40px",
      // gap: {
      //   height: "45px",
      //   color: "#eee",
      // },
      // colorList: ["#497EE3", "#37C1FC", "#54DAD3"],
      data: [
        {
          value: 100,
          label: "发送人次",
        },
        {
          value: 189,
          label: "送达人次",
        },
        {
          value: 23,
          label: "点击人次",
        },
      ],
      legend: ["送达率", "点击率"],
      barOptions: {
        labels: [
          "极光通道",
          "华为通道",
          "小米通道",
          "vivo通道",
          "OPPO通道",
          "魅族通道",
          "FCM通道",
          "华硕通道",
          "推必达通道",
        ],
        colors: [
          "#00AC83",
          "#1B6EFF",
          "#26B49E",
          "#333333",
          "#41FFDD",
          "#0E72FF",
          "#18AD91",
          "#777777",
          "#87FDFF",
          "#999999",
        ],
        data: [
          [642, 91, 15, 0, 28, 2, 1, 0, 0],
          [42, 51, 15, 0, 18, 1, 1, 0, 0],
          [142, 31, 1, 0, 8, 0, 0, 0, 0],
        ],
      },
      tooltips: {
        title: "发送数量",
      },
    });
    return {
      options,
    };
  },
});
</script>
