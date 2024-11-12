import type { VNode } from 'vue' // 从 Vue 中导入 VNode 类型

// 定义 Select 组件的选项接口
export interface SelectOption {
  label: string; // 选项的标签
  value: string; // 选项的值
  disabled?: boolean; // 选项是否禁用
}

// 定义渲染标签的函数类型
export type RenderLabelFunc = (option: SelectOption) => VNode; // 接受一个 SelectOption 类型的参数，返回一个 VNode

// 定义自定义过滤函数类型
export type CustomFilterFunc = (value: string) => SelectOption[]; // 接受一个字符串类型的参数，返回一个 SelectOption 数组

// 定义自定义远程过滤函数类型
export type CustomFilterRemoteFunc = (value: string) => Promise<SelectOption[]>; // 接受一个字符串类型的参数，返回一个 Promise，解析为 SelectOption 数组

// 定义 Select 组件的属性接口
export interface SelectProps {
  modelValue: string; // v-model 绑定的值
  options?: SelectOption[]; // 选项数组
  placeholder: string; // 输入框的占位符
  disabled: boolean; // 输入框是否禁用
  clearable?: boolean; // 输入框是否可清除
  renderLabel?: RenderLabelFunc; // 自定义渲染标签的函数
  filterable?: boolean; // 是否可过滤选项
  filterMethod?: CustomFilterFunc; // 自定义过滤函数
  remote?: boolean; // 是否使用远程过滤
  remoteMethod?: CustomFilterRemoteFunc; // 自定义远程过滤函数
}

// 定义 Select 组件的状态接口
export interface SelectStates {
  inputValue: string; // 输入框的值
  selectedOption: null | SelectOption; // 选中的选项
  mouseHover: boolean; // 鼠标是否悬停在输入框上
  loading: boolean; // 是否正在加载远程数据
  highlightIndex: number; // 高亮显示的选项索引
}

// 定义 Select 组件的事件接口
export interface SelectEmits {
  (e: 'change', value: string): void; // 选项改变事件
  (e: 'update:modelValue', value: string): void; // v-model 更新事件
  (e: 'visible-change', value: boolean): void; // 下拉菜单可见性改变事件
  (e: 'clear'): void; // 清除事件
}