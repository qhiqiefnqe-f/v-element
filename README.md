
### 安装


```bash
npm i @vikingmute/v-element --save
```

### 开始使用

**全局使用**


```js
// 引入所有组件
import VElement from '@vikingmute/v-element'
// 引入样式
import '@vikingmute/v-element/dist/style.css'

import App from './App.vue'
// 全局使用
createApp(App).use(VElement).mount('#app')
```