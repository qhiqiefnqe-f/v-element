<template>
  <div class="vk-collapse">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue' // 从 Vue 中导入 ref、provide 和 watch 函数
import type { NameType, CollapseProps, CollapseEmits } from './types' // 导入类型定义
import { collapseContextKey } from './types' // 导入上下文键

// 定义组件选项
defineOptions({
  name: 'VkCollapse' // 设置组件名称为 'VkCollapse'
})

// 定义组件的 props 类型
const props = defineProps<CollapseProps>()

// 定义组件的 emits 类型
const emits = defineEmits<CollapseEmits>()

// 定义一个响应式引用，用于存储当前激活的面板名称
const activeNames = ref<NameType[]>(props.modelValue)

// 监听 props.modelValue 的变化，并更新 activeNames
watch(() => props.modelValue, () => {
  activeNames.value = props.modelValue
})

// 如果是手风琴模式且激活的面板数量超过一个，发出警告
if (props.accordion && activeNames.value.length > 1) {
  console.warn('accordion mode should only have one active item')
}

// 处理面板点击事件
const handleItemClick = (item: NameType) => {
  let _activeNames = [...activeNames.value]
  if (props.accordion) {
    // 手风琴模式下，只能有一个激活的面板
    _activeNames = [activeNames.value[0] === item ? '' : item]
    activeNames.value = _activeNames
  } else {
    const index = _activeNames.indexOf(item)
    if (index > -1) {
      // 如果面板已经激活，则移除它
      _activeNames.splice(index, 1)
    } else {
      // 如果面板未激活，则添加它
      _activeNames.push(item)
    }
    activeNames.value = _activeNames
  }
  // 触发 update:modelValue 事件，通知父组件更新
  emits('update:modelValue', activeNames.value)
}

// 提供 collapse 上下文，供子组件使用
provide(collapseContextKey, {
  activeNames,
  handleItemClick
})
</script>