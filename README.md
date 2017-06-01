# 一款分屏滚动的组件

用法很简单（会慢慢更加完善）

#Use

1.引入JS文件

2.在body里加入如下的div布局;需要几个页面里面的“自定2”就有几个，然后你的所有页面信息都在div class="自定2"里布局就行了；

      <div id="自定1">

        <div class="自定2"></div>
        
        <div class="自定2"></div>
        
        <div class="自定2"></div>
        
        <div class="自定2"></div>
        
        <div class="自定2"></div>
        
        <div class="自定2"></div>
        
        ...
        
      </div>
    
    
    3.实例化一个函数，传一个对象，box填你的div的id，items填classname，如：
    
    <script>
    
        var Split = new SplitScreen({
        
            box: "自定1",
            
            items: "自定2"
            
        });
        
    </script>
