declare module 'recharts/types/component/DefaultTooltipContent' {
  export type ValueType = number | string | Array<number | string>;
  export type NameType = number | string;
  export type TooltipProps<TValue extends ValueType, TName extends NameType> = import('recharts/types/component/DefaultTooltipContent').Props<TValue, TName>;
}
