<template>
  <div 
    class="vk-form-item"
    :class="{
      'is-error': validateStatus.state === 'error', // 当验证状态为错误时，添加 'is-error' 类
      'is-success': validateStatus.state === 'success', // 当验证状态为成功时，添加 'is-success' 类
      'is-loading': validateStatus.loading, // 当验证状态为加载中时，添加 'is-loading' 类
      'is-required': isRequired // 当表单项为必填项时，添加 'is-required' 类
    }"
  >
    <!-- 表单项的标签 -->
    <label class="vk-form-item__label">
      <!-- 插槽 'label'，默认内容为 label 属性 -->
      <slot name="label" :label="label">
        {{label}}
      </slot>
    </label>
    <!-- 表单项的内容 -->
    <div class="vk-form-item__content">
      <!-- 默认插槽，传递 validate 方法 -->
      <slot :validate="validate"/>
      <!-- 错误消息，当验证状态为错误时显示 -->
      <div class="vk-form-item__error-msg" v-if="validateStatus.state === 'error'">
        {{validateStatus.errorMsg}}
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { inject, computed, reactive, provide, onMounted, onUnmounted } from 'vue'
import Schema from 'async-validator'
import { isNil } from 'lodash-es'
import { formContextKey, formItemContextKey } from './types'
import type { FormItemProps, FormValidateFailure, FormItemContext, ValidateStatusProp, FormItemInstance } from './types'

// 定义组件选项
defineOptions({
  name: 'VkFormItem'
})

// 定义组件的 props 类型
const props = defineProps<FormItemProps>()

// 注入表单上下文
const formContext = inject(formContextKey)

// 定义验证状态的响应式对象
const validateStatus: ValidateStatusProp = reactive({
  state: 'init', // 初始状态
  errorMsg: '', // 错误消息
  loading: false // 加载状态
})

// 定义初始值
let initialValue: any = null

// 计算属性：获取表单项的值
const innerValue = computed(() => {
  const model = formContext?.model
  if (model && props.prop && !isNil(model[props.prop])) {//通过父组件传来的表单数组查找该表单项的值
    return model[props.prop]
  } else {
    return null
  }
})

// 计算属性：获取表单项的验证规则
const itemRules = computed(() => {
  const rules = formContext?.rules
  if (rules && props.prop && rules[props.prop]) {
    return rules[props.prop]
  } else {
    return []
  }
})

// 计算属性：判断表单项是否为必填项
const isRequired = computed(() => {
  return itemRules.value.some(rule => rule.required)
})

// 获取触发的验证规则
const getTriggeredRules = (trigger?: string) => {
  // 过滤出触发事件匹配的验证规则
  return itemRules.value.filter(rule => {
    if (!rule.trigger || !trigger) return true
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })
}

// 验证方法
const validate = async (trigger?: string) => {
  const modelName = props.prop
  const triggeredRules = getTriggeredRules(trigger)
  if (triggeredRules.length === 0) {
    return true
  }
  if (modelName) {
    // 创建一个新的验证器实例，使用 Schema 定义验证规则
    const validator = new Schema({
      [modelName]: triggeredRules
    })
    // 设置验证状态为加载中
    validateStatus.loading = true
    // 执行验证，传入当前字段的值
    return validator.validate({ [modelName]: innerValue.value })
      .then(() => {
        // 验证成功时，将状态设置为成功
        validateStatus.state = 'success'
      })
      .catch((e: FormValidateFailure) => {
        // 验证失败时，处理错误信息
        const { errors } = e
        validateStatus.state = 'error'
        validateStatus.errorMsg = (errors && errors.length > 0) ? errors[0].message || '' : ''
        console.log(e.errors)
        // 返回一个被拒绝的 Promise，包含错误信息
        return Promise.reject(e)
      })
      .finally(() => {
        // 无论验证成功还是失败，都将加载状态设置为 false
        validateStatus.loading = false
      })
  }
}

// 清除验证状态的方法
const clearValidate = () => {
  // 清除验证状态，将状态重置为初始状态
  validateStatus.state = 'init'
  validateStatus.errorMsg = ''
  validateStatus.loading = false
}

// 重置字段的方法
const resetField = () => {
  // 重置字段的验证状态
  clearValidate()
  const model = formContext?.model
  // 如果模型存在且字段属性存在且不为空，则将字段值重置为初始值
  if (model && props.prop && !isNil(model[props.prop])) {
    model[props.prop] = initialValue
  }
}

// 定义表单项上下文对象
const context: FormItemContext = {
  validate,
  prop: props.prop || '',
  clearValidate,
  resetField
}

// 提供表单项上下文
provide(formItemContextKey, context)

// 组件挂载时的钩子函数
onMounted(() => {
  if (props.prop) {
    formContext?.addField(context)
    initialValue = innerValue.value
  }
})

// 组件卸载时的钩子函数
onUnmounted(() => {
  formContext?.removeField(context)
})

// 公开组件实例的方法和属性
defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidate
})
</script>