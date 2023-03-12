<template>
  <div class="funnel-wrapper" :style="{ paddingRight: lebalWidth }">
    <div class="title-wrapper" v-if="title">
      <p class="main-title" v-if="title.text" :style="title.textStyle">
        {{ title.text }}
      </p>
      <p class="sub-title" v-if="title.subText" :style="title.subTextStyle">
        {{ title.subText }}
      </p>
    </div>
    <slot name="title"></slot>
    <div class="funnel-box" v-if="options.data.length > 0">
      <div
        v-for="(bar, index) in options.data"
        :key="index"
        class="funnel-item"
      >
        <div
          class="funnel-bar-box"
          :style="{
            height: barHeight,
          }"
        >
          <div
            class="funnel-bar"
            :class="`${bar.value === 0 && index !== 0 ? 'funnel-bar-0' : ''}`"
            :style="{
              backgroundColor: colorList[index],
              height: barHeight,
              width: styleList[index].barWidth,
            }"
            @mousemove="showToolTips($event, index)"
            @mouseleave="hideToolTips"
          >
            <ul v-if="barOptionsData[index]" class="barOptionsUl">
              <li
                v-for="(barOpData, idx) in barOptionsData[index]"
                :key="barOpData.id"
                :style="{
                  backgroundColor: barOptions ? barOptions[idx].color : '',
                  width: getBarOptionWidth(barOpData, barOptionsDataAll[index]),
                }"
              ></li>
            </ul>
          </div>
          <div
            class="funnel-bar-label"
            :style="{ left: styleList[index].barWidth, width: lebalWidth }"
          >
            <p class="funnel-bar-label-title">{{ bar.label }}</p>
            <p class="funnel-bar-label-value">{{ bar.value }}</p>
          </div>
        </div>
        <div class="funnel-gap-box" v-if="index !== options.legend.length">
          <p
            class="funnel-gap"
            :class="`${bar.value === 0 ? 'funnel-gap-0' : ''}`"
            :style="{
              backgroundColor: gap.color,
              height: gap.height,
              clipPath:
                'polygon(0 0,' +
                `${styleList[index].gapLastClipPoint} 0, ${styleList[index].gapClipPoint} 100%,` +
                '0 100%)',
            }"
          ></p>
          <div class="funnel-gap-label" :style="{ height: gap.height }">
            <i
              class="icon"
              :style="{
                background:
                  'linear-gradient(360deg,' +
                  `${colorList[index]} 0%, ${colorList[index + 1]} 100%` +
                  ')',
              }"
            ></i>
            <span
              class="funnel-gap-label-title"
              :style="{ lineHeight: gap.height }"
              >{{ options.legend[index] }}</span
            >
            <span class="funnel-gap-label-value">
              {{
                getGapRate(bar.value, options.data[index + 1].value) !== "--"
                  ? getGapRate(bar.value, options.data[index + 1].value) + "%"
                  : getGapRate(bar.value, options.data[index + 1].value)
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="funnel-box error" v-else>
      <div class="funnel-item" v-for="(d, index) in errorData" :key="index">
        <p
          :style="{
            backgroundColor: '#F4F6F9',
            width: `${d.width}`,
            height: '36px',
            opacity: '0.6',
            marginBottom: '0',
          }"
        ></p>
        <p
          v-if="index < errorData.length - 1"
          :style="{
            backgroundColor: '#F4F6F9',
            width: '100%',
            height: '45px',
            opacity: '0.2',
            marginBottom: '0',
            clipPath: `polygon(0 0, ${d.width} 0, ${
              errorData[index + 1].width
            } 100%, 0 100%)`,
          }"
        ></p>
      </div>
      <img
        src="https://img.jiguang.cn/error/no-data.png"
        alt=""
        class="errorimg"
      />
    </div>
    <div
      v-if="tooltips && barOptions"
      class="funnel-tooltips"
      :style="tooltipsStyle"
    >
      <p class="tooltips-title">{{ tooltips.title }}</p>
      <ul class="tooltips-ul">
        <li v-for="(data, index) in barOptions" :key="data.color">
          <span class="color" :style="{ backgroundColor: data.color }"></span>
          <span class="label">{{ data.label }}</span>
          <span class="number">{{ tooltipsData[index] }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, reactive} from "vue";
import { Ioptions, IsizeMap } from "./declare";

export default defineComponent({
  name: "JgFunnel",
  props: {
    options: {
      type: Object as PropType<Ioptions>,
      required: true,
    },
  },
  setup(props) {
    const defaultLabelWidth = "135px";
    const defaultGapColor = "#f4f6f9";
    const defaultColorList = ["#497EE3", "#37C1FC", "#54DAD3"];
    const defaultBarColorList = [
      "#497EE3",
      "#45C0A9",
      "#545796",
      "#F99D47",
      "#2FB3D2",
      "#805CB4",
      "#B1D681",
      "#8B8CAB",
      "#EB6D50",
      "#7CD5F7",
      "#FFA58C",
      "#5E7092",
      "#81A6E2",
      "#D686DB",
      "#FC8D6E",
      "#99E8CB",
      "#259A99",
      "#E6965C",
      "#E6965C",
    ];
    const defaultSizeMap: IsizeMap = {
      small: {
        barHeight: "36px",
        gapHeight: "45px",
      },
      medium: {
        barHeight: "40px",
        gapHeight: "55px",
      },
      large: {
        barHeight: "44px",
        gapHeight: "65px",
      },
    };
    // 转化为rgb用于后续转化rgba
    function hexToRgb(hex: string) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    }
    // 标题
    const title = computed(() => {
      if (props.options.title?.text || props.options.title?.subText) {
        return props.options.title;
      }
      return "";
    });
    // 右侧文案宽度
    const lebalWidth = computed<string>(() => {
      return props.options.labelWidth ?? defaultLabelWidth;
    });
    // bar高度，设置了height参数优先展示，无则展示size对于高度。
    const barHeight = computed<string>(() => {
      let height = defaultSizeMap["medium"].barHeight;
      if (props.options.size) {
        height = defaultSizeMap[props.options.size].barHeight;
      }
      return props.options.height ?? height;
    });
    // gap高和颜色，设置了gap参数优先展示，无则展示size对于高度。
    const gap = computed<{ color: string; height: string }>(() => {
      let height = defaultSizeMap["medium"].gapHeight;
      if (props.options.size) {
        height = defaultSizeMap[props.options.size].gapHeight;
      }
      return {
        color: props.options.gap?.color ?? defaultGapColor,
        height: props.options.gap?.height ?? height,
      };
    });
    // bar颜色
    const baseColorList = computed<Array<string>>(() => {
      if (props.options.colorList && props.options.colorList?.length > 0) {
        return props.options.colorList;
      } else {
        return defaultColorList;
      }
    });
    const colorList = ref<Array<string>>([]);
    const initColorList = () => {
      const dataLen = props.options.data.length;
      const colorLen = baseColorList.value.length;
      if (dataLen > colorLen) {
        const rgbRes = hexToRgb(baseColorList.value[0]);
        let a = 1;
        for (let i = 0; i < props.options.data.length; i++) {
          colorList.value.push(
            `rgba(${rgbRes?.r}, ${rgbRes?.g}, ${rgbRes?.b}, ${a.toFixed(1)})`
          );
          a -= 0.1;
        }
      } else {
        colorList.value = baseColorList.value;
      }
    };
    initColorList();
    // 获取漏斗百分比
    const getGapRate = (topValue: number, value: number): number | string => {
      if (topValue !== 0 && value !== 0) {
        return ((value * 100) / topValue).toFixed(2);
      } else {
        return "--";
      }
    };

    // 查找最大值设置为100%
    const maxValue = computed<number>(() => {
      return Math.max(...(props.options.data?.map(({ value }) => value) ?? []));
    });

    const getBarWidth = (value: number): number => {
      return maxValue.value ? (value * 100) / maxValue.value : 0;
    };

    const styleList = ref<
      Array<{
        barWidth: string;
        gapWidth: string;
        gapLastClipPoint?: string;
        gapClipPoint?: string;
      }>
    >([]);

    const initStyle = () => {
      props.options.data.forEach((data, index, arr) => {
        const barWidth = `${Math.min(getBarWidth(data.value), 100)}%`;
        let gapWidth = "";
        let gapClipPoint = "";
        if (index <= arr.length - 2) {
          gapWidth = `${Math.max(
            Math.min(getBarWidth(data.value), 100),
            Math.min(getBarWidth(arr[index + 1].value), 100)
          )}%`;
          gapClipPoint = `${Math.min(getBarWidth(arr[index + 1].value), 100)}%`;
        }
        const style = {
          barWidth,
          gapWidth,
          gapLastClipPoint: barWidth,
          gapClipPoint: gapClipPoint,
        };
        if (barWidth === "0%") {
          style.gapLastClipPoint = "2px";
          style.gapClipPoint = "2px";
        }
        styleList.value.push(style);
      });
    };
    initStyle();
    console.log(styleList.value);

    const barColorList = computed(() => {
      if (!props.options.barOptions || !props.options.barOptions.colors) {
        return defaultBarColorList;
      } else if (
        props.options.barOptions &&
        props.options.barOptions.colors &&
        props.options.barOptions.labels &&
        props.options.barOptions.colors.length >=
          props.options.barOptions.labels.length
      ) {
        return props.options.barOptions.colors;
      }

      return [...props.options.barOptions.colors, ...defaultBarColorList];
    });
    // 每条bar的内容
    const barOptions = computed(() => {
      const options: { label: string; color: string }[] = [];
      if (props.options.barOptions) {
        props.options.barOptions.labels.forEach(
          (item: string, index: number) => {
            options.push({
              label: item,
              color: barColorList.value[index],
            });
          }
        );
        return options;
      }
      return "";
    });
    // 每条bar的内容的数据
    const barOptionsData = computed(() => {
      if (props.options.barOptions && props.options.barOptions.data) {
        return props.options.barOptions.data;
      }
      return "";
    });
    // 每条bar的内容的数据总数
    const barOptionsDataAll = computed(() => {
      if (props.options.barOptions && props.options.barOptions.data) {
        const dataAll: Array<number> = [];
        props.options.barOptions.data.forEach((item: Array<number>) => {
          let count = 0;
          item.forEach((num: number) => {
            count += num;
          });
          dataAll.push(count);
        });
        return dataAll;
      }
      return [];
    });
    // 计算每个option的宽度
    const getBarOptionWidth = (num: number, allCount: number) => {
      const width = Number(((num * 100) / allCount).toFixed(2)) + "%";
      return width;
    };
    // tooltips
    const tooltips = computed(() => {
      if (props.options.tooltips) {
        return props.options.tooltips;
      }
      return null;
    });

    const tooltipsData = ref<Array<number>>([]);
    const tooltipsStyle = reactive({
      display: "none",
      top: "0px",
      left: "0px",
    });
    const showToolTips = (event: MouseEvent, index: number) => {
      tooltipsData.value = barOptionsData.value[index];
      tooltipsStyle.display = "block";
      tooltipsStyle.left = event.clientX + 10 + "px";
      tooltipsStyle.top = event.clientY + 10 + "px";
    };
    const hideToolTips = () => {
      tooltipsStyle.display = "none";
    };
    const errorData = [
      {
        width: "100%",
      },
      {
        width: "79.5%",
      },
      {
        width: "61.4%",
      },
    ];
    return {
      title,
      maxValue,
      colorList,
      barHeight,
      gap,
      getGapRate,
      styleList,
      lebalWidth,
      getBarWidth,
      errorData,
      barOptions,
      barOptionsData,
      barOptionsDataAll,
      getBarOptionWidth,
      tooltips,
      tooltipsData,
      showToolTips,
      hideToolTips,
      tooltipsStyle,
    };
  },
});
</script>

<style scoped lang="less">
body * {
  margin: 0;
  padding: 0;
}
.funnel-wrapper {
  position: relative;
  font-size: 0;
  box-sizing: border-box;
  .title-wrapper {
    margin-bottom: 17px;
  }
  .main-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #253044;
  }
  .sub-title {
    font-size: 14px;
    color: rgba(23, 33, 44, 0.52);
  }
  .funnel-bar-box {
    position: relative;
    .funnel-bar {
      display: inline-block;
      &.funnel-bar-0 {
        width: 2px !important;
        background: #d5dce8 !important;
      }
    }
    .funnel-bar-label {
      position: absolute;
      top: 0;
      margin-left: 8px;
    }
    .funnel-bar-label-title {
      font-size: 12px;
      line-height: 16px;
      color: rgba(23, 33, 44, 0.52);
    }
    .funnel-bar-label-value {
      font-family: Roboto-Medium, Roboto;
      font-size: 16px;
      font-weight: 500;
      color: #253044;
      line-height: 24px;
    }
  }
  .funnel-gap-box {
    position: relative;
    .funnel-gap {
      width: 100%;
    }
    .funnel-gap-label {
      position: absolute;
      left: 0;
      top: 0;
      overflow: hidden;
      padding-left: 15px;
      .icon {
        display: inline-block;
        margin-right: 8px;
        width: 10px;
        height: 10px;
        clip-path: polygon(
          0 60%,
          35% 60%,
          40% 0%,
          60% 0%,
          65% 60%,
          100% 60%,
          50% 100%
        );
      }
    }
    .funnel-gap-label-title {
      display: inline-block;
      margin-right: 5px;
      font-size: 12px;
      color: rgba(23, 33, 44, 0.52);
    }
    .funnel-gap-label-value {
      font-family: Roboto-Medium, Roboto;
      font-size: 14px;
      font-weight: 500;
      color: #253044;
    }
  }
  .funnel-box {
    &.error {
      position: relative;
      .errorimg {
        position: absolute;
        top: 50%;
        left: 10%;
        transform: translate(0, -50%);
        max-width: 178px;
        max-height: 178px;
        width: 50%;
        background-color: transparent;
      }
    }
  }
  .barOptionsUl {
    height: 100%;
    width: 100%;
    li {
      display: inline-block;
      height: 100%;
      width: 0%;
    }
  }
  .funnel-tooltips {
    position: fixed;
    font-size: 12px;
    top: 0px;
    left: 0px;
    z-index: 999;
    background-color: #253044;
    color: #fff;
    border-radius: 4px;
    .tooltips-title {
      padding: 8px 12px;
      margin-bottom: 0px;
    }
    .tooltips-ul {
      padding: 0px 12px;
      li {
        margin-bottom: 8px;
        list-style-type: none;
        vertical-align: middle;
        .color {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 1px;
          margin-right: 10px;
        }
        .label {
          display: inline-block;
          line-height: 15px;
          min-width: 100px;
        }
        .number {
          display: inline-block;
          line-height: 15px;
          min-width: 50px;
        }
      }
    }
  }
}
</style>
