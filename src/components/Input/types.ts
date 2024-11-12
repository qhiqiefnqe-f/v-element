// 定义 Input 组件的属性接口
export interface InputProps {
  type?: string; // 输入框的类型，例如 'text'、'password' 等
  modelValue: string; // 输入框的值
  size?: 'large' | 'small'; // 输入框的大小，可以是 'large' 或 'small'
  disabled?: boolean; // 输入框是否禁用
  clearable?: boolean; // 输入框是否可清除
  showPassword?: boolean; // 是否显示密码切换按钮
  placeholder?: string; // 输入框的占位符
  readonly?: boolean; // 输入框是否只读
  autocomplete?: string; // 输入框的自动完成属性
  autofocus?: boolean; // 输入框是否自动获取焦点
  form?: string; // 输入框所属的表单
}

// 定义 Input 组件的事件接口
export interface InputEmits {
  (e: 'update:modelValue', value: string): void; // 更新 modelValue 事件
  (e: 'input', value: string): void; // input 事件，值有变化时触发
  (e: 'change', value: string): void; // change 事件，值修改且失去焦点时触发
  (e: 'focus', value: FocusEvent): void; // focus 事件，输入框获得焦点时触发
  (e: 'blur', value: FocusEvent): void; // blur 事件，输入框失去焦点时触发
  (e: 'clear'): void; // clear 事件，输入框值被清除时触发
}

// 定义 Input 组件的实例接口
export interface InputInstance {
  ref: HTMLInputElement | HTMLTextAreaElement; // 输入框的引用，可以是 HTMLInputElement 或 HTMLTextAreaElement
}