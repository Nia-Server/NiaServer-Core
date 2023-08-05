import {world,system} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,log} from './customFunction.js'
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';
import { ExternalFS } from './API/filesystem.js';
const fs = new ExternalFS();
const port = 10086
const VERSION = "v1.4.0-pre-1"

const start = Date.now();


//服务器启动监听
world.afterEvents.worldInitialize.subscribe(() => {
    const reqServerStarted = http.get(`http://127.0.0.1:${port}/ServerStarted`)
    reqServerStarted.then((response) => {
        if (response.status == 200) {
            log("依赖服务器已经成功连接！")
        } else {
            console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！")
        }
    })

        //检查更新
        const reqCheckUpdate = http.get(`http://api.github.com/repos/NIANIANKNIA/NIASERVER-V4/releases`)
        reqCheckUpdate.then((response) => {
            if (response.status == 200) {
                if (JSON.parse(response.body)[0].tag_name != VERSION) {
                    log(`当前插件包不是最新版本，当前版本是 ${VERSION}, Github上的release最新版本为 ${JSON.parse(response.body)[0].tag_name}. 点击链接立即跳转下载: https://github.com/NIANIANKNIA/NIASERVER-V4/releases/tag/${JSON.parse(response.body)[0].tag_name}`);
                    log("本次检查更新共用时：" + (Date.now() - start) + " ms");
                } else {
                    log("自动检查更新成功！当前版本是最新版本！");
                    log("本次检查更新共用时：" + (Date.now() - start) + " ms");
                }
            } else {
                console.warn("[NIA V4] 自动检查更新失败！Github服务器连接失败！");
                log("本次检查更新共用时：" + (Date.now() - start) + " ms");
            }
        })
})




//玩家加入服务器监听
world.afterEvents.playerJoin.subscribe((player) => {
    const reqPlayerJoin = new HttpRequest(`http://127.0.0.1:${port}/PlayerJoin`);
    reqPlayerJoin.body = player.playerName
    reqPlayerJoin.method = HttpRequestMethod.Post;
    reqPlayerJoin.headers = [
        new HttpHeader("Content-Type", "text/plain")
    ];
    http.request(reqPlayerJoin)
})

//玩家离开服务器监听
world.afterEvents.playerLeave.subscribe((player) => {
    const reqPlayerLeave = new HttpRequest(`http://127.0.0.1:${port}/PlayerLeave`);
    reqPlayerLeave.body = player.playerName
    reqPlayerLeave.method = HttpRequestMethod.Post;
    reqPlayerLeave.headers = [
        new HttpHeader("Content-Type", "text/plain"),
    ];
    http.request(reqPlayerLeave)
})

//游戏聊天转发
world.afterEvents.chatSend.subscribe((t) => {
    const reqPlayerChat = new HttpRequest(`http://127.0.0.1:${port}/PlayerChat`);
    let msg = {}
    msg.name = t.sender.nameTag
    msg.message = t.message
    reqPlayerChat.body = JSON.stringify(msg);
    reqPlayerChat.method = HttpRequestMethod.Post;
    reqPlayerChat.headers = [
        new HttpHeader("Content-Type", "text/plain; charset=utf-8"),
    ];
    http.request(reqPlayerChat).then((response) => {
        if (!response.status == 200) {
            console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！")
        }
    })
})