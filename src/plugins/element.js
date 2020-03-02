import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 导入弹框组件
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//将Vue的弹框组件挂载到vue的原型对象上，这样每一个组件都可以通过 this 来访问 $message 来进行弹框提示
Vue.prototype.$message = Message;
