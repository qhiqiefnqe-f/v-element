import type { VNode, ComponentInternalInstance } from 'vue'

// 定义消息组件的属性接口
export interface MessageProps {
  message?: string | VNode; // 消息内容，可以是字符串或 VNode
  duration?: number; // 消息显示时长（毫秒）
  showClose?: boolean; // 是否显示关闭按钮
  type?: 'success'| 'info'| 'warning'| 'danger'; // 消息类型
  onDestory: () => void; // 消息销毁时的回调函数
  id: string; // 消息唯一标识符
  zIndex: number; // 消息的 zIndex 值
  offset?: number; // 消息的偏移量
  transitionName?: string; // 消息的过渡动画名称
}

// 定义消息实例的上下文接口
export interface MessageContext {
  id: string; // 消息唯一标识符
  vnode: VNode; // 消息的虚拟节点
  vm: ComponentInternalInstance; // 消息的组件实例
  props: MessageProps; // 消息的属性
  destory: () => void; // 消息销毁时的回调函数
}

// 定义创建消息时的属性类型，排除 'onDestory'、'id' 和 'zIndex'
export type CreateMessageProps = Omit<MessageProps, 'onDestory' | 'id' | 'zIndex'>