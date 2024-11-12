import { render, h, shallowReactive } from 'vue' // 从 Vue 中导入 render、h 和 shallowReactive 函数
import type { CreateMessageProps, MessageContext } from './types' // 导入类型定义
import MessageConstructor from './Message.vue' // 导入 Message 组件
import useZIndex from '../../hooks/useZIndex' // 导入 useZIndex 钩子

let seed = 1 // 用于生成唯一 ID 的种子
const instances: MessageContext[] = shallowReactive([]) // 存储所有消息实例的数组，使用 shallowReactive 使其响应式

// 创建消息实例的函数
export const createMessage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex() // 获取下一个 zIndex 值的函数
  const id = `message_${seed++}` // 生成唯一 ID
  const container = document.createElement('div') // 创建一个容器元素

  // 销毁消息实例的函数
  const destory = () => {
    // 删除数组中的实例
    const idx = instances.findIndex(instance => instance.id === id)
    if (idx === -1) return
    instances.splice(idx, 1)
    render(null, container) // 卸载组件
  }

  // 手动调用删除，其实就是手动的调整组件中 visible 的值
  // visible 是通过 expose 传出来的
  const manualDestroy = () => {
    const instance = instances.find(instance => instance.id === id)
    if (instance) {
      instance.vm.exposed!.visible.value = false // 设置 visible 为 false
    }
  }

  // 合并传入的 props 和新增的属性
  const newProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestory: destory
  }

  // 创建虚拟节点
  const vnode = h(MessageConstructor, newProps)
  render(vnode, container) // 渲染虚拟节点到容器中

  // 将容器的第一个子元素（即渲染的组件）添加到 body 中
  document.body.appendChild(container.firstElementChild!)

  const vm = vnode.component! // 获取组件实例
  const instance = {
    id,
    vnode,
    vm,
    props: newProps,
    destory: manualDestroy
  }
  instances.push(instance) // 将实例添加到数组中
  return instance // 返回实例
}

// 获取最后一个消息实例的函数
export const getLastInstance = () => {
  return instances.at(-1)
}

// 获取最后一个消息实例的底部偏移量
export const getLastBottomOffset = (id: string) => {
  const idx = instances.findIndex(instance => instance.id === id)
  console.log('idx', id, idx, instances.length)
  if (idx <= 0) {
    return 0
  } else {
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
}

// 关闭所有消息实例的函数
export const closeAll = () => {
  instances.forEach(instance => {
    instance.destory()
  })
}