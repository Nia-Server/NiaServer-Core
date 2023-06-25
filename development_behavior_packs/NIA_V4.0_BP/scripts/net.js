import {world,system} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution} from './customFunction.js'
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';

//与服务器通信获取群聊消息
system.runInterval(() => {
    const reqCheck = new HttpRequest("http://127.0.0.1:3000/Check");
    reqCheck.body = JSON.stringify({
        score: 22,//还没想好做什么功能，先预留在这里
    });
    reqCheck.method = HttpRequestMethod.POST;
    reqCheck.headers = [
        new HttpHeader("Content-Type", "application/json"),
    ];
    http.request(reqCheck).then((response) => {
        if (response.status == 200) {
            let repData = JSON.parse(response.body)
            for (let i = 0; i < repData.msgboxs.length; i++) {
                world.sendMessage("§6[群聊]§r <"+ repData.msgboxs[i][0] + "§r> " + repData.msgboxs[i][1])
            }
            //错误信息解析
            //踢出未认证玩家
        } else {
            Broadcast("§c>> 依赖服务器连接失败，如果你看到此提示请联系腐竹！")
        }
    })
},60)

//

//服务器启动监听
world.afterEvents.worldInitialize.subscribe(() => {
    const reqServerStarted = new HttpRequest("http://127.0.0.1:3000/ServerStarted");
    reqServerStarted.body = JSON.stringify({
        score: 22,
    });
    reqServerStarted.method = HttpRequestMethod.POST;
    reqServerStarted.headers = [
        new HttpHeader("Content-Type", "application/json"),
    ];
    http.request(reqServerStarted).then((response) => {
        if (response.status == 200) {
            console.log("\x1b[33m[NIA V4] The dependent server has been successfully connected!\x1b[0m")
        } else {
            console.error("[NIA V4] Dependent server connection failed! Check whether the dependent server started successfully.")
        }
    })
})

//玩家加入服务器监听
world.afterEvents.playerJoin.subscribe((player) => {
    const reqPlayerJoin = new HttpRequest("http://127.0.0.1:3000/PlayerJoin");
    reqPlayerJoin.body = player.playerName
    reqPlayerJoin.method = HttpRequestMethod.POST;
    reqPlayerJoin.headers = [
        new HttpHeader("Content-Type", "application/json"),
    ];
    http.request(reqPlayerJoin)
})

//玩家离开服务器监听
world.afterEvents.playerLeave.subscribe((player) => {
    const reqPlayerLeave = new HttpRequest("http://127.0.0.1:3000/PlayerLeave");
    reqPlayerLeave.body = player.playerName
    reqPlayerLeave.method = HttpRequestMethod.POST;
    reqPlayerLeave.headers = [
        new HttpHeader("Content-Type", "application/json"),
    ];
    http.request(reqPlayerLeave)
})

//游戏聊天转发
world.afterEvents.chatSend.subscribe((t) => {
    const reqPlayerChat = new HttpRequest("http://127.0.0.1:3000/PlayerChat");
    let msg = {}
    msg.name = t.sender.nameTag
    msg.message = t.message
    reqPlayerChat.body = JSON.stringify(msg);
    reqPlayerChat.method = HttpRequestMethod.POST;
    reqPlayerChat.headers = [
        new HttpHeader("Content-Type", "application/json"),
    ];
    http.request(reqPlayerChat).then((response) => {
        if (!response.status == 200) {
            Broadcast("§c>> 依赖服务器连接失败，如果你看到此提示请联系腐竹！")
        }
    })
})