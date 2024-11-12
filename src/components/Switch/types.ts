// 定义 Switch 组件的值类型，可以是 boolean、string 或 number
export type SwitchValueType = boolean | string | number;

// 定义 Switch 组件的属性接口
export interface SwtichProps {
  modelValue: SwitchValueType; // v-model 绑定的值
  disabled?: boolean; // 开关是否禁用
  activeText?: string; // 开关选中时的文本
  inactiveText?: string; // 开关未选中时的文本
  activeValue?: SwitchValueType; // 开关选中时的值
  inactiveValue?: SwitchValueType; // 开关未选中时的值
  name?: string; // 开关的名称
  id?: string; // 开关的唯一标识符
  size?: 'small' | 'large'; // 开关的大小，可以是 'small' 或 'large'
}

// 定义 Switch 组件的事件接口
export interface SwtichEmits {
  (e: 'update:modelValue', value: SwitchValueType): void; // v-model 更新事件
  (e: 'change', value: SwitchValueType): void; // 开关值改变事件
}