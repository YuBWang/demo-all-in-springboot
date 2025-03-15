

var events = [];

//
//
// // 每 10 秒调用一次 save 方法，避免请求过多
// setInterval(save, 10 * 1000);

//4.点击回放
function playback() {
    $.ajax({
        type: "GET",
        async: false,
        scriptCharset: 'UTF-8',
        url: "http://127.0.0.1:8099/rrweb/event", //访问的链接
        success:function(res){  //成功的回调函数
           //var data = JSON.parse(res);
            console.log(res.events);
            events = res.events;
        },
        error: function (e) {
        }
    });

    new rrwebPlayer({
        target: document.getElementById('playback'), // 可以自定义 DOM 元素
        data: {events},
        unpackFn: rrweb.unpack,
    });
}