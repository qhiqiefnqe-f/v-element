<template>
<div
  class="vk-tooltip"
  ref="popperContainerNode"
  v-on="outerEvents"
>
  <div
    class="vk-tooltip__trigger"
    ref="triggerNode"
    v-on="events"
  >
    <slot />
  </div>
  <Transition :name="transition">
    <div
      v-if="isOpen"
      class="vk-tooltip__popper"
      ref="popperNode"
    >
      <slot name="content">
        {{content}}
      </slot>
      <div id="arrow" data-popper-arrow></div>
    </div>
  </Transition>
</div>
</template>
<script setup lang="ts">
import { ref, watch, reactive, onUnmounted, computed } from 'vue' // 从 Vue 中导入 ref、watch、reactive、onUnmounted 和 computed 函数
import { createPopper } from '@popperjs/core' // 从 @popperjs/core 中导入 createPopper 函数
import type { Instance } from '@popperjs/core' // 从 @popperjs/core 中导入 Instance 类型
import { debounce } from 'lodash-es' // 从 lodash-es 中导入 debounce 函数
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types' // 导入 TooltipProps、TooltipEmits 和 TooltipInstance 类型定义
import useClickOutside from '../../hooks/useClickOutside' // 导入 useClickOutside 钩子

// 定义组件选项
defineOptions({
  name: 'VkTooltip' // 设置组件名称为 'VkTooltip'
})

// 定义组件的 props，并设置默认值
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  openDelay: 0,
  closeDelay: 0,
})

// 定义组件的 emits
const emits = defineEmits<TooltipEmits>()

// 定义一个 ref，用于控制 Tooltip 的可见性
const isOpen = ref(false)

// 定义 ref，用于存储 Tooltip 和触发元素的引用
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperContainerNode = ref<HTMLElement>()

// 定义 Popper 实例
let popperInstance: null | Instance = null

// 定义事件对象
let events: Record<string, any> = reactive({})
let outerEvents: Record<string, any> = reactive({})

// 定义打开和关闭次数
let openTimes = 0
let closeTimes = 0

// 计算 Popper 的选项
const popperOptions = computed(() => {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9],
        },
      }
    ],
    ...props.popperOptions
  }
})

// 打开 Tooltip
const open = () => {
  openTimes++
  console.log('open times', openTimes)
  isOpen.value = true
  emits('visible-change', true)
}

// 关闭 Tooltip
const close = () => {
  closeTimes++
  console.log('close times', closeTimes)
  isOpen.value = false
  emits('visible-change', false)
}

// 防抖处理打开和关闭函数
const openDebounce = debounce(open, props.openDelay)
const closeDebounce = debounce(close, props.closeDelay)

// 最终打开 Tooltip
const openFinal = () => {
  closeDebounce.cancel()
  openDebounce()
}

// 最终关闭 Tooltip
const closeFinal = () => {
  openDebounce.cancel()
  closeDebounce()
}

// 切换 Tooltip 的显示和隐藏
const togglePopper = () => {
  if (isOpen.value) {
    closeFinal()
  } else {
    openFinal()
  }
}

// 使用自定义钩子监听点击外部事件
useClickOutside(popperContainerNode, () => {
  if (props.trigger === 'click' && isOpen.value && !props.manual) {
    closeFinal()
  }
  if (isOpen.value) {
    emits('click-outside', true)
  }
})

// 绑定事件
const attachEvents = () => {
  if (props.trigger === 'hover') {
    events['mouseenter'] = openFinal
    outerEvents['mouseleave'] = closeFinal
  } else if (props.trigger === 'click') {
    events['click'] = togglePopper
  }
}

// 如果不是手动控制，则绑定事件
if (!props.manual) {
  attachEvents()
}

// 监听 props.manual 的变化
watch(() => props.manual, (isManual) => {
  if (isManual) {
    events = {}
    outerEvents = {}    
  } else {
    attachEvents()
  }
})

// 监听 props.trigger 的变化
watch(() => props.trigger, (newTrigger, oldTrigger) => {
  if (newTrigger !== oldTrigger) {
    // 清除事件
    events = {}
    outerEvents = {}
    attachEvents()
  }
})

// 监听 isOpen 的变化
watch(isOpen, (newValue) => {
  if (newValue) {
    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
    } else {
      popperInstance?.destroy()
    }
  }
}, { flush: 'post'})

// 组件卸载时的钩子函数
onUnmounted(() => {
  popperInstance?.destroy()
})

// 公开组件实例的方法和属性
defineExpose<TooltipInstance>({
  'show': openFinal,
  'hide': closeFinal
})
</script>