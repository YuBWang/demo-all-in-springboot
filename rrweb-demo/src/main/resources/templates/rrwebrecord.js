var input = document.querySelectorAll('.ui-input input');
input.forEach(function(val, i) {
    val.onfocus = function() {
        this.parentNode.className += ' focus';
    }
    val.onblur = function() {
        this.parentNode.className = this.parentNode.className.replace('focus', '');
    }
});

var events = [];

rrweb.record({
    emit(event) {
        // 将 event 存入 events 数组中
        events.push(event);
    },
    sampling: {
        // 不录制鼠标移动事件
        // mousemove: false,
        // 不录制鼠标交互事件
        mouseInteraction: false,
        // 设置输入事件的录制时机
        input: 'last' // 连续输入时，只录制最终值
    },
   packFn: rrweb.pack,
});

// save 函数用于将 events 发送至后端存入，并重置 events 数组
// function save() {
//     const body = JSON.stringify({ events });
//     events = [];
//     fetch('http://127.0.0.1:8090/mnt/do/rrweb/event', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body:JSON.stringify({ "eventicode": events }),
//     });
// }
function save() {
    if(events.length == 0){return;}
    const rrwebevents = JSON.stringify({ events });
    events = [];
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8090/mnt/do/rrweb/event", //访问的链接
        data:JSON.stringify({
            event:rrwebevents
        }),
        dataType: "json",
        contentType: "application/json",
        success:function(res){  //成功的回调函数
            var data = JSON.parse(res);
        },
        error: function (e) {
        }
    });
}


// 每 10 秒调用一次 save 方法，避免请求过多
setInterval(save, 60 * 1000);

//4.点击回放
function playback() {
    new rrwebPlayer({
        target: document.getElementById('playback'), // 可以自定义 DOM 元素
        data: {events},
    });
}