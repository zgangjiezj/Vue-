todoList案例：
      添加功能：以【title创建的对象】为依据添加一个对象
        双向数据绑定：input的双向数据绑定，自动获取表单输入。
        父组件：定义更新数据的方法，接收子组件传的参数
        子组件：
            绑定事件
            绑定事件方法中：根据title创建一个todo对象
                          调用父组件的方法，传参，来添加数据
      显示/隐藏功能：鼠标移入，
            1. 绑定事件监听
            2. 设计数据（背景为灰色，按钮消失）
            3. 在监听回调中, 更新数据，更新页面显示
         同一方法的复用：传不同的参数来表示不同的功能，该参数为boolean类型
         v-show / 动态展示颜色 ：style
      删除功能：以【index】为依据删除一个对象
         父组件：定义删除的方法，传参传方法
         子组件：绑定点击事件，接收方法，调用父组件的方法删除，传参
      Footer:接收todos，来显示已完成数量/全部的数量  、显示【清除已完成的任务】并完成清除功能、 前面边框的选与不选
        1》来显示【已完成数量/全部的数量】： 
           根据complted = true 和 遍历数组todos来统计complted = true的数量，判断已完成的数量 ---》计算属性
           全部的数量 ===> 数组的长度
        2》显示【清除已完成的任务】并完成清除功能：
            显示【清除已完成的任务】：有一个checkbox被选中显示，没有一个被选中不显示.
            清除功能:清除的是todos--》父组件中定义方法：过滤数组，把框中选中那一个对象的删除，返回没选中的构成新数组
                                     子组件直接使用父组件中的清除的方法
        3》全选/全不选框：
              父组件：全选/全不选是：遍历数组，状态isCheckAll是啥，complated就是啥
              子组件：什么时候调用？
      数据保存到localstrage中：（单独写在utils文件夹中==数据存储的工具模块）
        界面根据数据显示，要改的数据是todos，存的是todos；
        什么时候存数据： 数据todos只要一变（本身+内部的所有层次），就要重新存==》监视属性 watch ，深度监视。
        什么时候取数据： 生命周期中：异步模拟异步读取数据==》定时器 

      子组件不要直接修改父组件的内容：修改item中的v-model=‘complated’的值
          item中的 v-model：由todo的complated来确定；===》get
          手动改了值，会调用父组件中的方法，更新状态 ==》set
         ====》放在计算属性里

      自定义事件：子组件向父组件
      删除功能：用全局事件总线实现
               Item更新数据的方法，传给App
      Fooer（子组件）：改用slot；把三部分结构都用slot代替，用name区分各个标签
      父组件：把三部分结构标签传给子组件

    计算属性和监视属性：
        fn() -->读了fn，fn存的是函数的地址
        计算属性里调用计算属性：this.计算属性--》读属性值就会自动调用对应的getter方法
   注：
