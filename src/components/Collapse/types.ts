import type { Ref, InjectionKey } from 'vue' // 从 Vue 中导入 Ref 和 InjectionKey 类型
export type NameType = string | number // 定义 NameType 类型，可以是字符串或数字

// 定义 Collapse 组件的属性接口
export interface CollapseProps {
  modelValue: NameType[]; // 当前激活的面板名称数组
  accordion?: boolean; // 是否为手风琴模式
}

// 定义 CollapseItem 组件的属性接口
export interface CollapseItemProps {
  name: NameType; // 面板的名称
  title?: string; // 面板的标题
  disabled?: boolean; // 是否禁用面板
}

// 定义 Collapse 组件的上下文接口
export interface CollapseContext {
  activeNames: Ref<NameType[]>; // 当前激活的面板名称数组的引用
  handleItemClick: (name: NameType) => void; // 处理面板点击事件的方法
}

// 定义 Collapse 组件的事件接口
export interface CollapseEmits {
  (e: 'update:modelValue', values: NameType[]): void; // 更新 modelValue 事件
  (e: 'change', values: NameType[]): void; // 面板状态变化事件
}

// 定义 Collapse 组件的上下文键，用于依赖注入
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey')