
let eventsMatrix = [[]];
//存储快照

rrweb.record({
    emit(event, isCheckout) {
        // isCheckout 是一个标识，告诉你重新制作了快照
        if (isCheckout) {
            eventsMatrix.push([]);
            savedata()
        }
        const lastEvents = eventsMatrix[eventsMatrix.length - 1];
        lastEvents.push(event);
    },
    checkoutEveryNms: 3* 60 * 1000, // 每3分钟重新制作快照
    packFn: rrweb.pack, //压缩数据
    sampling: {
        // 设置滚动事件的触发频率
        scroll: 150,
        // 每 150ms 最多触发一次
        input: 'last' // 连续输入时，只录制最终值
    }
});
//如果想停止录制可直接调用stopFn()

async function savedata() {
    //保存最后一个已录制完成的快照
    let events = []
    if (!eventsMatrix[eventsMatrix.length - 2]) return;
    events = eventsMatrix[eventsMatrix.length - 2];
    const rrwebevents = JSON.stringify({ events });
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
// setInterval(save, 60 * 1000);

//4.点击回放
function playback() {
    new rrwebPlayer({
        target: document.getElementById('playback'), // 可以自定义 DOM 元素
        data: {events},
    });
}