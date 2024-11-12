<template>
  <div
    class="vk-input"
    :class="{
      [`vk-input--${type}`]: type,
      [`vk-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus
    }"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" class="vk-input__prepend">
        <slot name="prepend" />
      </div>
      <div class="vk-input__wrapper">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="vk-input__prefix">
            <slot name="prefix" />
        </span>
        <input
          class="vk-input__inner"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          ref="inputRef"
          v-bind="attrs"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          v-model="innerValue"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <!-- suffix slot -->
        <span v-if="$slots.suffix || showClear || showPasswordArea" class="vk-input__suffix" @click="keepFocus">
            <slot name="suffix" />
            <Icon 
              icon="circle-xmark"
              v-if="showClear"
              class="vk-input__clear"
              @click="clear"
              @mousedown.prevent="NOOP"
            />
            <Icon 
              icon="eye"
              v-if="showPasswordArea && passwordVisible"
              class="vk-input__password"
              @click="togglePasswordVisible"
            />
            <Icon 
              icon="eye-slash"
              v-if="showPasswordArea && !passwordVisible"
              class="vk-input__password"
              @click="togglePasswordVisible"
            />
        </span>
      </div>
      <!-- append slot -->
      <div v-if="$slots.append" class="vk-input__append">
        <slot name="append" />
      </div>
    </template>
    <!-- textarea -->
    <template v-else>
      <textarea
        class="vk-textarea__wrapper"
        v-bind="attrs"
        ref="inputRef"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
        v-model="innerValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, useAttrs, nextTick, inject } from 'vue' // 从 Vue 中导入 ref、watch、computed、useAttrs、nextTick 和 inject 函数
import type { Ref } from 'vue' // 从 Vue 中导入 Ref 类型
import type { InputProps, InputEmits } from './types' // 导入 InputProps 和 InputEmits 类型定义
import Icon from '../Icon/Icon.vue' // 导入 Icon 组件
import { formItemContextKey } from '../Form/types' // 导入 formItemContextKey 上下文键

// 定义组件选项
defineOptions({
  name: 'VkInput', // 设置组件名称为 'VkInput'
  inheritAttrs: false // 禁用属性继承
})

// 定义组件的 props，并设置默认值
const props = withDefaults(defineProps<InputProps>(), { type: 'text', autocomplete: 'off' })

// 定义组件的 emits
const emits = defineEmits<InputEmits>()

// 获取组件的所有属性
const attrs = useAttrs()

// 定义一个 ref，用于存储输入框的值
const innerValue = ref(props.modelValue)

// 定义一个 ref，用于存储输入框的焦点状态
const isFocus = ref(false)

// 定义一个 ref，用于存储密码可见状态
const passwordVisible = ref(false)

// 定义一个 ref，用于存储输入框的引用
const inputRef = ref() as Ref<HTMLInputElement>

// 注入 formItem 上下文
const formItemContext = inject(formItemContextKey)

// 运行验证函数
const runValidation = (trigger?: string) => {
  formItemContext?.validate(trigger).catch((e) => console.log(e.errors))
}

// 计算属性：是否显示清除按钮
const showClear = computed(() => 
  props.clearable &&
  !props.disabled &&
  !!innerValue.value &&
  isFocus.value
)

// 计算属性：是否显示密码区域
const showPasswordArea = computed(() => 
  props.showPassword &&
  !props.disabled &&
  !!innerValue.value
)

// 切换密码可见状态
const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}

// 空函数
const NOOP = () => {}

// 保持焦点
const keepFocus = async () => {
  await nextTick()
  inputRef.value.focus()
}

// 处理输入事件
const handleInput = () => {
  emits('update:modelValue', innerValue.value)
  emits('input', innerValue.value)
  runValidation('input')
}

// 处理更改事件
const handleChange = () => {
  emits('change', innerValue.value)
  runValidation('change')
}

// 处理聚焦事件
const handleFocus = (event: FocusEvent) => {
  isFocus.value = true
  emits('focus', event)
}

// 处理失焦事件
const handleBlur = (event: FocusEvent) => {
  console.log('blur triggered')
  isFocus.value = false
  emits('blur', event)
  runValidation('blur')
}

// 清除输入框的值
const clear = () => {
  console.log('clear triggered')
  innerValue.value = ''
  emits('update:modelValue', '')
  emits('clear')
  emits('input', '')
  emits('change', '')
}

// 监听 props.modelValue 的变化，并更新 innerValue
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})

// 公开组件实例的方法和属性
defineExpose({
  ref: inputRef
})
</script>