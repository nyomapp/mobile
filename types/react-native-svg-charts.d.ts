declare module 'react-native-svg-charts' {
  import { ComponentType } from 'react';
    import { ViewStyle } from 'react-native';

  export interface PieChartData {
    value: number;
    svg?: {
      fill?: string;
      [key: string]: any;
    };
    key?: string;
    [key: string]: any;
  }

  export interface PieChartProps {
    style?: ViewStyle;
    data: PieChartData[];
    innerRadius?: string | number;
    outerRadius?: string | number;
    spacing?: number;
    [key: string]: any;
  }

  export const PieChart: ComponentType<PieChartProps>;
  
  // Add other chart exports as needed
  export const BarChart: ComponentType<any>;
  export const LineChart: ComponentType<any>;
  export const AreaChart: ComponentType<any>;
  export const StackedBarChart: ComponentType<any>;
  export const StackedAreaChart: ComponentType<any>;
  export const ProgressCircle: ComponentType<any>;
}
