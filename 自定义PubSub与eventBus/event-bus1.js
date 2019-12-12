/* 
自定义全局事件总线对象模块
*/
(function (window) {
  // 总线对象模块
  let eventBus = {}
  /**
   *{
      "add": [
        callback1,
        callback2
      ],
      "delete": [
        callback3
      ]
    }
   */
  
  // 外部容器
   let eventContainer = {}

//监听：1、将小容器挂到对象上 /2、 将回调函数添加到小容器中
  eventBus.on = function (eventName,callback) {
    // 内部容器
    let callbacks = eventContainer[eventName]
    if(!callbacks){
      //将空的小容器挂到大对象中
      callbacks = []
      eventContainer[eventName] = callbacks
      //简写： eventContainer[eventName] = callbacks = []
    }
    // 将回调函数callback添加到小容器callbacks中
    callbacks.push(callback)
    // eventContainer[eventName].push(callback)
  }

//分发功能：小容器存在，遍历所有的回调函数，回调函数发数据(发啥，要看监听了啥)
  eventBus.emit = function (eventName,data) {
    // 小容器
     let callbacks = eventContainer[eventName]
    //遍历回调函数，发数据
     if(callbacks && callbacks.length >0){
       callbacks.forEach(callback=>{
         callback(data)
       })
     }
  }
// 取消：  1. flag没有指定: 取消所有
  //        2. flag是eventName: 取消对应的所有
  eventBus.off = function (flag) {
     if( flag === undefined){
       eventContainer = {}
     }else{
       delete eventContainer[flag]
     }
  }
  window.eventBus = eventBus
})(window)