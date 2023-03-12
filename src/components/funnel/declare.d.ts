import { CSSProperties } from "vue";
export type FunnelSize = "small" | "medium" | "large";
// enum FunnelSize {
//   small,
//   medium,
//   large,
// }
export type Ititle = {
  text?: string;
  textStyle?: string | CSSProperties;
  subText?: string;
  subTextStyle?: string | CSSProperties;
};

export type IData = { value: number; label?: string };

export type Ioptions = {
  title?: Ititle;
  size?: FunnelSize;
  labelWidth?: string;
  colorList?: Array<string>;
  height?: string;
  gap?: {
    color?: string;
    height?: string;
  };
  data: Array<Idata>;
  legend: Array<string>;
  barOptions?: IbarOptions;
  tooltips?: Itooltips;
};

export type IsizeMap = {
  [key: string]: {
    [key: string]: string;
  };
};
export type Itooltips = {
  [key: string]: {
    [key: string]: string;
  };
};
export type IbarOptions = any;
