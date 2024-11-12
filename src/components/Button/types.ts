import type { PropType } from 'vue'

// 定义按钮类型，可以是 'primary'、'success'、'warning'、'danger' 或 'info'
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

// 定义按钮大小，可以是 'large' 或 'small'
export type ButtonSize = 'large' | 'small'

// 定义按钮的原生类型，可以是 'button'、'submit' 或 'reset'
export type NativeType = 'button' | 'submit' | 'reset'

// 定义按钮组件的属性接口
export interface ButtonProps {
  type?: ButtonType; // 按钮类型
  size?: ButtonSize; // 按钮大小
  plain?: boolean; // 是否为朴素按钮
  round?: boolean; // 是否为圆角按钮
  circle?: boolean; // 是否为圆形按钮
  disabled?: boolean; // 是否禁用按钮
  nativeType?: NativeType; // 按钮的原生类型
  autofocus?: boolean; // 是否自动获取焦点
  icon?: string; // 按钮的图标
  loading?: boolean; // 是否显示加载状态
}

// 定义按钮实例的接口
export interface ButtonInstance {
  ref: HTMLButtonElement // 按钮的引用
}

// 定义按钮组件的属性类型
export const buttonProps = {
  type: {
    type: String as PropType<ButtonType> // 按钮类型
  },
  size: {
    type: String as PropType<ButtonSize> // 按钮大小
  },
  plain: {
    type: Boolean // 是否为朴素按钮
  },
  round: {
    type: Boolean // 是否为圆角按钮
  },
  circle: {
    type: Boolean // 是否为圆形按钮
  },
  disabled: {
    type: Boolean // 是否禁用按钮
  },
  nativeType: {
    type: String as PropType<NativeType>, // 按钮的原生类型
    default: 'button' // 默认值为 'button'
  },
  autofocus: {
    type: Boolean // 是否自动获取焦点
  },
  icon: {
    type: String // 按钮的图标
  },
  loading: {
    type: Boolean // 是否显示加载状态
  }
}