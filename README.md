# 🌟 V-Element 组件库

V-Element 是一个基于 Vue 3 的轻量级组件库，提供了丰富的常用组件，帮助开发者快速构建现代化的 Web 应用。

# 部分演示
![image](https://github.com/user-attachments/assets/6796d0f8-eda8-4d6a-b9a7-e8554a71a8cb)
![image](https://github.com/user-attachments/assets/32de09b3-1d0e-408f-a72e-33f866126e47)
![image](https://github.com/user-attachments/assets/224929de-4995-4cce-900c-9b723ef24fd1)
![image](https://github.com/user-attachments/assets/b643ca5f-6dfe-4aeb-b886-e2696ae54f8a)
![image](https://github.com/user-attachments/assets/9c7d4933-755a-4a05-985d-6fed9322336b)




## ✨ 特性

- 🚀 基于 Vue 3 + TypeScript 开发
- 🎨 简洁优雅的设计风格
- 📦 丰富的组件: Button, Input, Select, Switch等
- 📝 完善的文档和示例
- 🔧 支持按需引入
- 🌐 支持 UMD 和 ES Module 两种引入方式

## 📦 安装

```bash
npm i @vikingmute/v-element --save
```

## 🚀 快速开始

### 全局引入

```js
import { createApp } from 'vue'
// 引入所有组件
import VElement from '@vikingmute/v-element'
// 引入样式
import '@vikingmute/v-element/dist/index.css'

import App from './App.vue'
// 全局使用
createApp(App).use(VElement).mount('#app')
```

### 按需引入

```js
import { createApp } from 'vue'
import App from './App.vue'

// 按需引入组件
import { Button, Input, Select } from '@vikingmute/v-element'
// 引入样式
import '@vikingmute/v-element/dist/index.css'

const app = createApp(App)
// 注册组件
app.component(Button.name, Button)
app.component(Input.name, Input)
app.component(Select.name, Select)

app.mount('#app')
```

## 🧩 组件列表

### 基础组件
- [Button 按钮](http://element.vikingship.xyz/components/button.html)
- [Input 输入框](http://element.vikingship.xyz/components/input.html)
- [Select 选择器](http://element.vikingship.xyz/components/select.html)
- [Switch 开关](http://element.vikingship.xyz/components/switch.html)
- [Form 表单](http://element.vikingship.xyz/components/form.html)
- [Tooltip 文字提示](http://element.vikingship.xyz/components/tooltip.html)
- [Message 消息提示](http://element.vikingship.xyz/components/message.html)
- [Icon 图标](http://element.vikingship.xyz/components/icon.html)

## 🔨 开发

```bash
# 启动开发服务器
npm run dev

# 构建组件库
npm run build

# 启动文档开发服务器
npm run docs:dev

# 构建文档
npm run docs:build
```
