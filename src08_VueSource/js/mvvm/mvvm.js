/* 
相当于Vue的构造函数
*/
function MVVM(options) {
    // 将配置对象保存到实例对象vm上
    this.$options = options;
    // 将data对象保存到【实例对象vm】和【局部变量data】上
    var data = this._data = this.$options.data;
    // 将实例对象vm保存到变量me
    var me = this;

    //实现数据代理： vm.*** --> vm._data.***
       // 遍历data中所有属性
    Object.keys(data).forEach(function(key) { // 某个属性: 当前为name
        // 对当前属性实现数据代理
        me._proxy(key); //me存this的原因是：不存，this在回调函数的返回里，this不指向最外侧的vm对象，而是window
    });

    // 对data中所有层次属性进行监视劫持
    observe(data, this);
    // 创建一个编译对象(编译模板) ---》先判断配置对象中是否有el,有传el,没有传body
    this.$compile = new Compile(options.el || document.body, this)
}

// 指定MVVM新的原型对象
MVVM.prototype = {
    $watch: function(key, cb, options) {
        new Watcher(this, key, cb);
    },

    _proxy: function(key) {// name
        var me = this;
        // 给vm添加指定的属性==》传过来的name
        Object.defineProperty(me, key, {
            configurable: false, // 不可重新定义
            enumerable: true, // 可以枚举遍历
            // 当通过vm.xxx读取属性值时自动调用
            get: function proxyGetter() {
                // 读取data中对应的属性值返回
                return me._data[key];
            },
            // 当通过vm.xxx = value修改属性时, 自动调用
            set: function proxySetter(newVal) {
                // 将最新的值保存到data对应的属性上
                me._data[key] = newVal;
            }
        });
    }
};
