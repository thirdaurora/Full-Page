(function() {
    //构造函数
    function SplitScreen(data) {
        if(typeof data != "object") {console.log('argument must a object');return}
        this.box = document.getElementById(data.box);
        this.items = getClass(document, data.items);
        this.nowIndex = 0,
        this.isOK = true,
        this.time,
        this.sidebarItems = [],
        this.pageHeight;

        this.init();
    }
    //给构造函数原型添加方法
    SplitScreen.prototype = {
        //初始化
        init: function() {
            var that = this;
            this.createSidebar();
            this.box.scrollTop = 0;
            this.sidebarItems[0].style.backgroundColor = "#fff";
            this.pageHeight = this.items[0].offsetHeight;
            this.box.style.cssText = "position:absolute;width:100%;height:100%;overflow:hidden;";
            //鼠标事件绑定
            addEvent(this.box, "mousewheel", function(event) {that.scrollFunc(event)});        //各种浏览器
            addEvent(this.box, "DOMMouseScroll", function(event) {that.scrollFunc(event)});    //Firefox浏览器
            for(var i=0;i<this.sidebarItems.length;i++) {
                addEvent(this.sidebarItems[i], "click", function() {that.clickScroll(this)});
            }
        },
        //在页面添加一个fixed定位的侧栏
        createSidebar: function() {
            var sidebar = document.createElement('div'),
                sidebarBox = document.createElement('div'),
                main = document.getElementsByTagName("body")[0],
                sidebarItem;
                for(var i=0;i<this.items.length;i++) {
                    sidebarItem = document.createElement('i');
                    sidebarItem.className = "left-sidebar-item";
                    sidebarItem.style.cssText = "background-color:#555;border-radius:10px;width:10px;height:10px;display:inline-block;cursor:pointer;";
                    sidebarBox.appendChild(sidebarItem);
                    this.sidebarItems[i] = sidebarItem;
                    this.items[i].style.cssText = "position:absolute;width:100%;height:100%;top:" + (i*100) + "%;";
                }
                sidebar.className = "left-fixed-sidebar";
                sidebar.style.cssText = "position:fixed;height:100%;width:1.29%;top:0;left:0;line-height:100%;";
                sidebarBox.className = "left-sidebar-box";
                sidebarBox.style.cssText = "margin-top:180px;text-align:center;";
                sidebar.appendChild(sidebarBox);
                main.style.cssText = "padding:0;margin:0;width:100%;height:100%;overflow:hidden;";
                main.appendChild(sidebar);
        },
        //判断鼠标中键是向上滑动还是向下滑动
        scrollFunc: function(e) {
            if(this.isOK) {
                this.isOK = false;
                var direction;
                e = e || this.box.event;
                if(e.wheelDelta) {   //各种浏览器
                    if(e.wheelDelta > 0) {
                        direction = 1; 
                    }else if(e.wheelDelta < 0) {
                        direction = 0; 
                    }  
                }else if (e.detail) {   //Firefox浏览器
                    if(e.detail> 0) {
                        direction = 0;
                    }else if(e.detail< 0) {
                        direction = 1;
                    }  
                }
                this.move(direction);
            }
        },
        //滑动前的判断
        move: function(direction) {
            if(direction === 0 && this.nowIndex <5) {
                    this.moveAnimation(1, 1);   //滑动
                    this.nowPosition(1)         //改变侧栏对应的背景色
                }else if(direction === 1 && this.nowIndex > 0) {
                    this.moveAnimation(-1, 1);
                    this.nowPosition(-1)
                }else {
                    this.isOK = true;
            }
        },
        //侧栏点击的定位滑动事件
        clickScroll: function(e) {
            if(this.isOK) {
                var goal;
                this.isOK = false;
                for(var i=0;i<this.sidebarItems.length;i++) {
                    if(this.sidebarItems[i] === e) {
                        goal = i;
                        this.sidebarItems[i].style.backgroundColor = "#fff";
                    }else {
                        this.sidebarItems[i].style.backgroundColor = "#555";
                    }
                }
                if(goal > this.nowIndex) {
                    this.moveAnimation(1, 2, goal);
                }else if(goal < this.nowIndex) {
                    this.moveAnimation(-1, 2, goal);
                }else {
                    this.isOK = true;
                }
            }
        },
        //滑动动画
        moveAnimation: function(num, type, goal) {
            var scrollStar = this.pageHeight * this.nowIndex,
                that = this;
                if (type === 1) {
                    var scrollEnd = this.pageHeight * (this.nowIndex + num);
                }else if(type === 2) {
                    var scrollEnd = this.pageHeight * goal;
                }
                this.time = setInterval(function() {
                    if(scrollEnd === scrollStar) {
                        if (type === 1) {
                            that.nowIndex = that.nowIndex + num;
                        }else if(type === 2) {
                            that.nowIndex = goal;
                        }
                        that.isOK = true;
                        clearInterval(that.time);
                    }
                    if((scrollEnd*num - scrollStar*num) > 10) {
                        scrollStar = scrollStar + 10*num;
                    }else {
                        scrollStar = scrollEnd;
                    } 
                    that.box.scrollTop = scrollStar;
                }, 10);
        },
        //侧栏点击事件
        nowPosition: function (num) {
            for(var i=0;i<this.sidebarItems.length;i++) {
                if(i === (this.nowIndex+num)) {
                    this.sidebarItems[i].style.backgroundColor = "#fff";
                }else {
                    this.sidebarItems[i].style.backgroundColor = "#555";
                }
            }
        }
    }
    //构造函数外接端口
    window.SplitScreen = SplitScreen;
    
    //内置兼容取Class方法
    function getClass(ele, className) {
        if(document.getElementsByClassName) {
            var allArr = ele.getElementsByClassName(className);
            if(allArr.length == 1) {
                return allArr[0];
            }else {
                return allArr;
            }
        }else {
            var allTag = ele.getElementsByTagName("*");
            var allArr = [];
            var classNameArr = [];
            for(var i=0;i<allTag.length;i++) {
                classNameArr = allTag[i].className.split(' ');
                for(var j=0;j<classNameArr.length;j++) {
                    if (classNameArr[j] === className) {
                        allArr.push(allTag[i]);
                    }
                }
            }
            if(allArr.length == 1) {
                return allArr[0];
            }else {
                return allArr;
            }
        }
    }
    //内置兼容添加事件方法
    function addEvent(target, eventType, func) {
        if(target.addEventListener) {
            target.addEventListener(eventType, func, false);
        } else if(target.attachEvent) {
            target.attachEvent("on" + eventType, func);
        } else {
            target["on" + eventType] = func;
        }
    }
})();
