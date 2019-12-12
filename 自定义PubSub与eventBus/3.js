(function (window) {
  const eventBus ={}
  const eventContainer = {}
  eventBus.on = function (eventName,callback) {
    let callbacks = eventContainer[eventName]
    if(!callbacks){
      callbacks = []
      eventContainer[eventName] = callbacks
    }
    callbacks.push(callback)
  }
  eventBus.emit = function (eventName,data) {
    let callbacks = eventContainer[eventName]
    callbacks.forEach(callback => {
      callback(data)
    });
  }
  eventBus.off = function (flag) {
    if(falg === undefined){
      eventContainer = {}
    }else{
      delete eventContainer[flag]
    }
  }
  window.eventBus = eventBus;
})(window)