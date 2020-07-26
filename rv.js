               (function(w) {
                    var params = {
                        foo_id: "1001",
                        foo_userid: "",
                        foo_screen_w: "",
                        foo_screen_h: "",
                        foo_referrer: "",
                        foo_title: "",
                        foo_cookie: "",
                        foo_flash: ""
                    }
                    var dm = ["domain.com"];
                    var dmIndex = 0;
                
                    //公共方法
                    var fn = {
                        args: '',
                        setCookie: function(name, value, hours) {
                            var expire = "";
                            if (hours != null) {
                                expire = "; expires=" + new Date((new Date()).getTime() + hours * 3600000).toGMTString();
                            }
                            document.cookie = name + "=" + escape(value) + expire + ";domain=." + dm[dmIndex] + ";path=/; ";
                        },
                        getCookie: function(name) {
                            var cookieValue = "";
                            var search_s = name + "=";
                            if (document.cookie.length > 0) {
                                var offset = document.cookie.indexOf(search_s);
                                if (offset != -1) {
                                    offset += search_s.length;
                                    var end = document.cookie.indexOf(";", offset);
                                    if (end == -1) end = document.cookie.length;
                                    cookieValue = unescape(document.cookie.substring(offset, end));
                                }
                            }
                            return cookieValue;
                        },
                        getArgs: function() {
                            //获取用户配置
                            if (_foo) {
                                fn.each(_foo, function(index, data) {
                                    if (data[0] == 'userid') {
                                        params.foo_userid = data[1];
                                    } else {
                                        params[data[0]] = data[1];
                                    }
                                });
                            }
                            //搜集参数
                            if (document) {
                                params.foo_title = document.title || '';
                                params.foo_referrer = document.referrer || '';
                            }
                            if (window && window.screen) {
                                params.foo_screen_h = window.screen.height || 0;
                                params.foo_screen_w = window.screen.width || 0;
                                params.foo_cookie = Number(window.navigator.cookieEnabled);
                            }
                            try {
                                params.foo_flash = Number(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
                            } catch (exception) {
                                params.foo_flash = Number('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
                            }
                            // 组织参数
                            var args = '';
                            for (var i in params) {
                                if (args != '') {
                                    args += '&';
                                }
                                args += i + '=' + encodeURIComponent(params[i]);
                            }
                            args += "&r=" + Math.floor(Math.random() * new Date().getTime()) + '&fe_foo_uuid=' + fn.getCookie('foo_uuid');
                            fn.args = args;
                            return args;
                        },
                        newImg:function(src){
                            var n = "log_" + (new Date()).getTime();
                            var img = window[n] = new Image(); //把new Image()赋给一个全局变量长期持有
                            img.src = src;
                            img.onload = img.onerror = img.onabort = function() {
                                window[n] = img.onload = img.onerror = img.onabort = null;
                                img = null; //释放局部变量img
                            }
                        },
                        checkPeople: function(args) {
                            var flag = true;
                            function isPeople(ev) {
                                if (!flag) { return }
                                flag = false;
                                fn.setCookie('foo_ispeople', 1, 24);
                                fn.newImg('//foo.domain.com/foo_1001.gif?' + args + '&event_type=' + ev);
                            }
                            if (fn.getCookie('foo_ispeople')) {
                                isPeople(0);
                            } else {
                                var doc = document;
                                if (doc.addEventListener) { //所有主流浏览器，除了 IE 8 及更早 IE版本
                                    doc.addEventListener("mousemove", function() { isPeople(1) });
                                    doc.addEventListener("touchstart", function() { isPeople(2) });
                                } else if (doc.attachEvent) { // IE 8 及更早 IE 版本
                                    doc.attachEvent("onmousemove", function() { isPeople(1) });
                                }
                                setTimeout(function(){
                                    fn.newImg('//foo.domain.com/foo_2002.gif?' + args);
                                },3000);
                                setTimeout(function(){
                                    fn.newImg('//foo.domain.com/foo_2003.gif?' + args);
                                },5000);
                                setTimeout(function(){
                                    fn.newImg('//foo.domain.com/foo_2005.gif?' + args);
                                },8000);
                                setTimeout(function(){
                                    fn.newImg('//foo.domain.com/foo_2004.gif?' + args);
                                },10000);
                
                            }
                        },
                        each: function(data, callback) {
                            for (var i in data) {
                                callback(i, data[i]);
                            }
                        },
                        setUuid: function(callback) {
                            if (fn.getCookie('foo_uuid')) {
                                callback();
                            } else {
                                var js = document.createElement("script");
                                js.src = "//foo.domain.com/getfoouuid.js?d=" + dm[dmIndex] + '&r=' + Math.round(Math.random() * 2147483647);
                                var s = document.getElementsByTagName("script")[0];
                                s.parentNode.insertBefore(js, s);
                                if (navigator.appName.toLowerCase().indexOf('netscape') == -1) {
                                    js.onreadystatechange = function() {
                                        if (js.readyState == "loaded" || js.readyState == "complete") {
                                            js.onreadystatechange = null;
                                            callback && callback();
                                        }
                                    }
                                } else {
                                    js.onload = function() {
                                        callback();
                                    }
                                }
                            }
                        },
                        trackEvent: function(type, data) {
                            var args = {}
                            if (data) {
                                args.data = data;
                            }
                            switch (type) {
                                case 'signin': //登录
                                    args.type = 20;
                                    args.sub_type = 1;
                                    break;
                                case 'signout': //退出登录
                                    args.type = 20;
                                    args.sub_type = 2;
                                    break;
                                case 'register': //注册
                                    args.type = 20;
                                    args.sub_type = 3;
                                    break;
                                case 'search': //搜索
                                    args.type = 40;
                                    args.sub_type = 'user_search';
                                    if (!data.keywords) {
                                        return;
                                    }
                                    break;
                                case 'enterim': //进入聊天
                                    args.type = 40;
                                    args.sub_type = 'enterim';
                                    break;
                                case 'iming': //聊天中
                                    args.type = 40;
                                    args.sub_type = 'iming';
                                    if (!data.desc) {
                                        return;
                                    }
                                    break;
                                case 'favorite': //收藏
                                    args.type = 40;
                                    args.sub_type = 'favorite';
                                    if (!data.type || !data.id) {
                                        return;
                                    }
                                    break;
                                case 'submit': //表单提交
                                    args.type = 40;
                                    args.sub_type = 'get_user_clue';
                                    if (!data.phone) {
                                        return;
                                    }
                                    break;
                                default:
                                    return;
                            }
                            try {
                                var arr = '';
                                fn.each(args, function(i, d) {
                                    if (i == 'data') {
                                        arr += '&data=' + encodeURIComponent(JSON.stringify(d));
                                    } else {
                                        arr += '&' + i + '=' + d;
                                    }
                                });
                            } catch (e) {}
                
                            fn.newImg('//foo.domain.com/foo_2001.gif?' + fn.args + arr)
                        }
                    }
                
                    //事件分析
                    w.foo = {
                        trackEvent: fn.trackEvent
                    }
                
                    // 常规分析
                    fn.setUuid(function() {
                        var args = fn.getArgs();
                        var flag = false;
                        fn.each(dm, function(i, d) {
                            if (window.location.host.indexOf(d) >= 0) {
                                flag = true;
                                dmIndex = i;
                            }
                        });
                        if (flag) {
                            if (top.location == self.location) {
                                fn.newImg('//foo.domain.com/foo_0001.gif?' + args);
                                fn.checkPeople(args);
                            } else {
                                fn.newImg('//foo.domain.com/foo_0002.gif?' + args);
                            }
                        } else {
                            fn.newImg('//foo.domain.com/foo_0005.gif?' + args);
                        }
                    });
                })(window);

