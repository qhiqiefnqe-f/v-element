<template>
  <button
    ref="_ref"
    class="vk-button"
    :class="{
      [`vk-button--${type}`]: type, // 根据 type 属性动态添加类名
      [`vk-button--${size}`]: size, // 根据 size 属性动态添加类名
      'is-plain': plain, // 如果 plain 为 true，则添加 'is-plain' 类
      'is-round': round, // 如果 rounad 为 true，则添加 'is-round' 类
      'is-circle': circle, // 如果 circle 为 true，则添加 'is-circle' 类
      'is-disabled': disabled, // 如果 disabled 为 true，则添加 'is-disabled' 类
      'is-loading': loading // 如果 loading 为 true，则添加 'is-loading' 类
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType" 
  >
    <Icon icon="spinner" spin v-if="loading" /> <!-- 如果 loading 为 true，显示旋转的图标 -->
    <Icon :icon="icon" v-if="icon" /> <!-- 如果传入了 icon 属性，显示对应的图标 -->
    <span>
      <slot /> <!-- 插槽，用于插入按钮的内容 -->
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue' // 从 Vue 中导入 ref 函数，用于创建响应式引用
import type { ButtonProps } from './types' // 导入按钮属性的类型定义
import Icon from '../Icon/Icon.vue' // 导入 Icon 组件

// 定义组件选项
defineOptions({
  name: 'VkButton' // 设置组件名称为 'VkButton'
})

// 定义组件的属性，并设置默认值
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button' // 设置 nativeType 属性的默认值为 'button'
})

// 创建对 HTMLButtonElement 的引用
const _ref = ref<HTMLButtonElement>()

// 公开 ref 属性，供父组件访问组件内部引用
defineExpose({
  ref: _ref
})
</script>

<!-- 添加 scoped 属性，限定 CSS 作用域到当前组件 -->
<style scoped>
/* 在这里添加你的样式 */
</style>