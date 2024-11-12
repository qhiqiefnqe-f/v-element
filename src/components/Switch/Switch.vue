<template>
<div
  class="vk-switch"
  :class="{
    [`vk-switch--${size}`]: size,
    'is-disabled': disabled,
    'is-checked': checked
  }"
  @click="switchValue"
>
  
  <input 
    class="vk-swtich__input"
    type="checkbox"
    role="switch"
    ref="input"
    :name="name"
    :disabled="disabled"
    @keydown.enter="switchValue"
  />
  <div class="vk-switch__core">
    <div class="vk-switch__core-inner">
      <span v-if="activeText || inactiveText" class="vk-switch__core-inner-text">
        {{checked ? activeText : inactiveText}}
      </span>
    </div>
    <div class="vk-switch__core-action">
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue' // 从 Vue 中导入 ref、computed、onMounted 和 watch 函数
import type { SwtichProps, SwtichEmits } from './types' // 导入 SwtichProps 和 SwtichEmits 类型定义

// 定义组件选项
defineOptions({
  name: 'VkSwtich', // 设置组件名称为 'VkSwtich'
  inheritAttrs: false // 禁用属性继承
})

// 定义组件的 props，并设置默认值
const props = withDefaults(defineProps<SwtichProps>(), {
  activeValue: true,
  inactiveValue: false
})

// 定义组件的 emits
const emits = defineEmits<SwtichEmits>()

// 定义一个 ref，用于存储开关的值
const innerValue = ref(props.modelValue)

// 定义一个 ref，用于存储输入元素的引用
const input = ref<HTMLInputElement>()

// 计算属性：当前是否被选中
const checked = computed(() => innerValue.value === props.activeValue)

// 切换开关的值
const switchValue = () => {
  if (props.disabled) return // 如果开关被禁用，则不处理点击事件
  const newValue = checked.value ? props.inactiveValue : props.activeValue // 根据当前状态切换值
  innerValue.value = newValue
  emits('update:modelValue', newValue) // 触发 'update:modelValue' 事件，通知父组件更新
  emits('change', newValue) // 触发 'change' 事件
}

// 组件挂载时的钩子函数
onMounted(() => {
  input.value!.checked = checked.value // 设置输入元素的 checked 属性
})

// 监听 checked 的变化，并更新输入元素的 checked 属性
watch(checked, (val) => {
  input.value!.checked = val 
})

// 监听 props.modelValue 的变化，并更新 innerValue
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})
</script>