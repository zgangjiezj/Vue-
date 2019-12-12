(function (window) {
  // 需要向外暴露的事件总线对象
  const eventBus = {}
  // 包含所有监听器函数的容器对象
  // 内部结构: {msg1: [listener1, listener2], msg2: [listener3]}
  let listenersContainer = {}
  /*
  用来绑定监听的on方法
  eventName: 事件名
  listener: 监听回调函数
  */
  eventBus.on = function (eventName, listener) {
  // 得到包含当前事件名对应已有事件监听的数组
  let listeners = listenersContainer[eventName]
  // 如果不存在
  if (!listeners) {
  // 创建存储事件监听的数组容器, 关联到总对象容器上
  listenersContainer[eventName] = []
  }
  // 将监听器添加到数组容器中
  listenersContainer[eventName].push(listener)
  }
  
  /* 
  用来分发/触发事件的emit方法
  eventName: 事件名
  data: 需要传递的数据
  */
  eventBus.emit = function (eventName, data) {
  // 得到包含当前事件名对应已有事件监听的数组
  const listeners = listenersContainer[eventName]
  // 只有当存在事件监听时才处理
  if (listeners && listeners.length>0) {
  // 遍历并同步调用每个监听函数, 传入指定的数据
  listeners.forEach((listener, index) => {
  listener(data)
  })
  }
  }
  
  /* 
  用来解绑事件监听的off方法
  eventName: 事件名, 
  没值: 解绑所有监听
  有值: 解绑对应的所有监听
  */
  eventBus.off = function (eventName) {
  // 如果事件名没有指定, 解绑所有事件监听(重置监听容器)
  if (typeof eventName === undefined) {
  listenersContainer = {}
  } else { // 解绑当前事件名的所有监听(删除事件名对应的属性)
  delete listenersContainer[eventName]
  }
  }
  
  // 向外暴露事件总线对象
  window.eventBus = eventBus
  
  })(window)