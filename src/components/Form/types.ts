// 这些导入的类型用于定义表单验证规则和错误处理。
import type { InjectionKey } from 'vue'
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

// 表单项的属性
// label 是表单项的标签，prop 是可选的属性名称
export interface FormItemProps {
  label: string; // 表单项的标签
  prop?: string; // 可选的属性名称，用于绑定表单数据
}

// 表单项的验证规则
// trigger 表示触发验证的事件
export interface FormItemRule extends RuleItem {
  trigger?: string; // 可选的触发事件，例如 'blur' 或 'change'
}

// FormRules 类型是一个记录类型，它将字符串映射到 FormItemRule 数组
// 这表示表单的验证规则
export type FormRules = Record<string, FormItemRule[]>

// 表单的属性
export interface FormProps {
  model: Record<string, any>; // 表单的数据模型
  rules: FormRules; // 表单的验证规则
}

// 表单上下文接口，扩展自 FormProps
// 包含添加和移除表单项的方法
export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void; // 添加表单项的方法
  removeField: (field: FormItemContext) => void; // 移除表单项的方法
}

// 验证状态的属性
export interface ValidateStatusProp {
  state: 'init' | 'success' | 'error'; // 验证状态，可以是 'init'、'success' 或 'error'
  errorMsg: string; // 错误消息
  loading: boolean; // 是否正在加载
}

// 表单项的上下文接口
export interface FormItemContext {
  prop: string; // 表单项的属性名称
  validate: (trigger?: string) => Promise<any>; // 验证方法，返回一个 Promise
  resetField(): void; // 重置表单项的方法
  clearValidate(): void; // 清除验证状态的方法
}

// 表单验证失败的结果
export interface FormValidateFailure {
  errors: ValidateError[] | null; // 验证错误数组
  fields: ValidateFieldsError; // 验证字段错误
}

// 表单实例接口
export interface FormInstance {
  validate: () => Promise<any>; // 验证表单的方法，返回一个 Promise
  resetFields: (props?: string[]) => void; // 重置表单的方法
  clearValidate: (props?: string[]) => void; // 清除验证状态的方法
}

// 表单项实例接口
export interface FormItemInstance {
  validateStatus: ValidateStatusProp; // 验证状态的属性
  validate: (trigger?: string) => Promise<any>; // 验证方法，返回一个 Promise
  resetField(): void; // 重置表单项的方法
  clearValidate(): void; // 清除验证状态的方法
}

// 定义两个常量 formContextKey 和 formItemContextKey
// 它们分别是 InjectionKey<FormContext> 和 InjectionKey<FormItemContext> 类型
// 用于在 Vue 的依赖注入系统中标识特定类型的依赖项
export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContextKey')