<template>
<div
  class="vk-select"
  :class="{'is-disabled': disabled }"
  @click="toggleDropdown"
  @mouseenter="states.mouseHover = true"
  @mouseleave="states.mouseHover = false"
>
  <Tooltip
    placement="bottom-start"
    ref="tooltipRef"
    :popperOptions="popperOptions"
    @click-outside="controlDropdown(false)"
    manual
  >
  <Input 
      v-model="states.inputValue"
      :disabled="disabled"
      :placeholder="filteredPlaceholder"
      ref="inputRef"
      :readonly="!filterable || !isDropdownShow"
      @input="debouceOnFilter"
      @keydown="handleKeydown"
    >
      <template #suffix>
        <Icon 
          icon="circle-xmark"
          v-if="showClearIcon"
          class="vk-input__clear"
          @mousedown.prevent="NOOP"
          @click.stop="onClear"  
        />

        <Icon
          v-else
          icon="angle-down" 
          class="header-angle" 
          :class="{ 'is-active': isDropdownShow }"
        />
      </template>
    </Input>
    <template #content>
      <div class="vk-select__loading" v-if="states.loading"><Icon icon="spinner" spin/></div>
      <div class="vk-select__nodata" v-else-if="filterable && filteredOptions.length === 0">no matching data</div>
      <ul class="vk-select__menu" v-else>
        <template v-for="(item, index) in filteredOptions" :key="index">
          <li 
            class="vk-select__menu-item"
            :class="{
              'is-disabled': item.disabled, 
              'is-selected': states.selectedOption?.value === item.value ,
              'is-highlighted': states.highlightIndex === index
            }"
            :id="`select-item-${item.value}`"
            @click.stop="itemSelect(item)"
          >
            <RenderVnode :vNode="renderLabel ? renderLabel(item) : item.label"/>
          </li>
        </template>
      </ul>
    </template>
  </Tooltip>
</div>  
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue' // 从 Vue 中导入 ref、reactive、computed 和 watch 函数
import type { Ref } from 'vue' // 从 Vue 中导入 Ref 类型
import { isFunction, debounce } from 'lodash-es' // 从 lodash-es 中导入 isFunction 和 debounce 函数
import type { SelectProps, SelectEmits, SelectOption, SelectStates } from './types' // 导入 SelectProps、SelectEmits、SelectOption 和 SelectStates 类型定义
import Tooltip from '../Tooltip/Tooltip.vue' // 导入 Tooltip 组件
import type { TooltipInstance } from '../Tooltip/types' // 导入 TooltipInstance 类型定义
import Input from '../Input/Input.vue' // 导入 Input 组件
import Icon from '../Icon/Icon.vue' // 导入 Icon 组件
import RenderVnode from '../Common/RenderVnode' // 导入 RenderVnode 组件
import type { InputInstance } from '../Input/types' // 导入 InputInstance 类型定义

// 查找选项
const findOption = (value: string) => {
  const option = props.options.find(option => option.value === value)
  return option ? option : null
}

// 定义组件选项
defineOptions({
  name: 'VkSelect'
})

// 定义组件的 props，并设置默认值
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => []
})

// 计算超时时间
const timeout = computed(() => props.remote ? 300 : 0)

// 定义组件的 emits
const emits = defineEmits<SelectEmits>()

// 初始化选项
const initialOption = findOption(props.modelValue)

// 定义 Tooltip 和 Input 的引用
const tooltipRef = ref() as Ref<TooltipInstance>
const inputRef = ref() as Ref<InputInstance>

// 定义组件的状态
const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1
})

// 定义下拉菜单的显示状态
const isDropdownShow = ref(false)

// 定义 Popper 的选项
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }: { state: any }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
    }
  ],
}

// 定义过滤后的选项
const filteredOptions = ref(props.options)

// 监听 props.options 的变化，并更新 filteredOptions
watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions
})

// 生成过滤后的选项
const generateFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchValue)
  } else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    states.loading = true
    try {
      filteredOptions.value = await props.remoteMethod(searchValue)
    } catch (e) {
      console.error(e)
      filteredOptions.value = []
    } finally {
      states.loading = false
    }
  } else {
    filteredOptions.value = props.options.filter(option => option.label.includes(searchValue))
  }
  states.highlightIndex = -1
}

// 过滤选项
const onFilter = () => {
  generateFilterOptions(states.inputValue)
}

// 防抖处理过滤选项
const debouceOnFilter = debounce(() => {
  onFilter()
}, timeout.value)

// 计算过滤后的占位符
const filteredPlaceholder = computed(() => {
  return (props.filterable && states.selectedOption && isDropdownShow.value) 
  ? states.selectedOption.label : props.placeholder
})

// 控制下拉菜单的显示和隐藏
const controlDropdown = (show: boolean) => {
  if (show) {
    // filter 模式
    // 之前选择过对应的值
    if (props.filterable && states.selectedOption) {
      states.inputValue = ''
    }
    // 进行一次默认选项的生成
    if (props.filterable) {
      generateFilterOptions(states.inputValue)
    }
    tooltipRef.value.show()
  } else {
    tooltipRef.value.hide()
    // blur 时候将之前的值回灌到 input 中
    if (props.filterable) {
      states.inputValue = states.selectedOption ? states.selectedOption.label : ''
    }
    states.highlightIndex = -1
  }
  isDropdownShow.value = show
  emits('visible-change', show)
}

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdownShow.value) {
        controlDropdown(true)
      } else {
        if (states.highlightIndex > -1 && filteredOptions.value[states.highlightIndex]) {
          itemSelect(filteredOptions.value[states.highlightIndex])
        } else {
          controlDropdown(false)
        }
      }
      break
    case 'Escape':
      if (isDropdownShow.value) {
        controlDropdown(false)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (filteredOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === 0) {
          states.highlightIndex = filteredOptions.value.length - 1
        } else {
          // move up
          states.highlightIndex--
        }
      }
      break
    case 'ArrowDown':
      e.preventDefault()
      if (filteredOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === (filteredOptions.value.length - 1)) {
          states.highlightIndex = 0
        } else {
          // move down
          states.highlightIndex++
        }
      }
      break
    default:
      break;
  }
}

// 计算是否显示清除图标
const showClearIcon = computed(() => {
  return props.clearable 
    && states.mouseHover
    && states.selectedOption
    && states.inputValue.trim() !== ''
})

// 清除选项
const onClear = () => {
  states.selectedOption = null
  states.inputValue = ''
  emits('clear')
  emits('change', '')
  emits('update:modelValue', '')
}

// 空函数
const NOOP = () => {}

// 切换下拉菜单的显示和隐藏
const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdownShow.value) {
    controlDropdown(false)
  } else {
    controlDropdown(true)
  }
}

// 选择选项
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return
  states.inputValue = e.label
  states.selectedOption = e
  emits('change', e.value)
  emits('update:modelValue', e.value)
  controlDropdown(false)
  inputRef.value.ref.focus()
}
</script>