<template>
  <form class="vk-form">
    <slot/>
  </form>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import type { ValidateFieldsError } from 'async-validator'
import type { FormProps, FormItemContext, FormContext, FormValidateFailure, FormInstance } from './types'
import { formContextKey } from './types'

// 定义组件的 props 类型
const props = defineProps<FormProps>()

// 定义组件选项
defineOptions({
  name: 'VkForm' // 设置组件名称为 'VkForm'
})

// 存储表单项的数组，用于管理所有的表单项
const fields: FormItemContext[] = []

// 添加表单项的方法，将表单项加入到 fields 数组中
const addField: FormContext['addField'] = (field) => {
  fields.push(field)
}

// 移除表单项的方法，从 fields 数组中删除指定的表单项
const removeField: FormContext['removeField'] = (field) => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1)
  }
}

// 重置表单的方法，可以选择性地重置指定的字段
const resetFields = (keys: string[] = []) => {
  // 根据传入的 keys 确定需要重置的表单项
  const filterArr = keys.length > 0 ? fields.filter(field => keys.includes(field.prop)) : fields
  // 遍历并重置每个表单项
  filterArr.forEach(field => field.resetField())
}

// 清除验证状态的方法，可以选择性地清除指定字段的验证状态
const clearValidate = (keys: string[] = []) => {
  // 根据传入的 keys 确定需要清除验证状态的表单项
  const filterArr = keys.length > 0 ? fields.filter(field => keys.includes(field.prop)) : fields
  // 遍历并清除每个表单项的验证状态
  filterArr.forEach(field => field.clearValidate())
}

// 验证整个表单的方法
const validate = async () => {
  let validationErrors: ValidateFieldsError = {} // 用于收集所有的验证错误
  // 遍历所有的表单项，并执行验证
  for (const field of fields) {
    try {
      await field.validate() // 如果验证通过，不做处理
    } catch (e) {
      const error = e as FormValidateFailure
      // 如果验证失败，合并错误信息
      validationErrors = {
        ...validationErrors,
        ...error.fields
      }
    }
  }
  // 如果没有任何验证错误，返回 true，表示验证成功
  if (Object.keys(validationErrors).length === 0) return true
  // 如果存在验证错误，返回一个被拒绝的 Promise，包含错误信息
  return Promise.reject(validationErrors)
}

// 提供表单上下文，供子组件使用
provide(formContextKey, {
  ...props,       // 传递组件的 props
  addField,       // 添加表单项的方法
  removeField     // 移除表单项的方法
})

// 通过 defineExpose 公开实例方法，供父组件调用
defineExpose<FormInstance>({
  validate,       // 验证表单的方法
  resetFields,    // 重置表单的方法
  clearValidate   // 清除验证状态的方法
})
</script>