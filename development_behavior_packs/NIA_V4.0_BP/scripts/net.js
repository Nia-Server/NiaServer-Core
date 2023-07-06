import {world,system} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution} from './customFunction.js'
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';
const port = 10086
//与服务器通信获取群聊消息
system.runInterval(() => {
    // let reqCheck = http.get(`http://127.0.0.1:${port}/Check`)
    // reqCheck.then((response) => {
    //     console.log("Error: " + response.status)
    // })
    const reqCheck = new HttpRequest(`http://127.0.0.1:${port}/Check`);
    reqCheck.body = "hello"
    reqCheck.method = HttpRequestMethod.POST;
    reqCheck.headers = [
        new HttpHeader("Content-Type", "text/plain"),
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

    //检查文件是否存在
    // const reqCheckFile = new HttpRequest(`http://127.0.0.1:${port}/CheckFile`);
    // reqCheckFile.body = "FileName.json"
    // reqCheckFile.method = HttpRequestMethod.POST;
    // reqCheckFile.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqCheckFile).then((response) => {
    //     if (response.status == 200 && response.body == "true") {
    //         console.log("Target file exists.")
    //     } else if (response.status == 200 && response.body == "false") {
    //         console.error("The target file does not exist")
    //     } else {
    //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })

    //创建json文件
    // const reqCreateNewJsonFile = new HttpRequest(`http://127.0.0.1:${port}/CreateNewJsonFile`);
    // reqCreateNewJsonFile.body = JSON.stringify({"fileName":"market111.json","fileContent":{"a":10}})
    // reqCreateNewJsonFile.method = HttpRequestMethod.POST;
    // reqCreateNewJsonFile.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqCreateNewJsonFile).then((response) => {
    //     if (response.status == 200 && response.body == "success") {
    //         console.log("File created successfully!")
    //     } else if (response.status == 200 && response.body != "success") {
    //         console.error(response.body)
    //     } else {
    //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })

    //得到json文件数据
    // const reqGetJsonFileData = new HttpRequest(`http://127.0.0.1:${port}/GetJsonFileData`);
    // reqGetJsonFileData.body = "market.json"
    // reqGetJsonFileData.method = HttpRequestMethod.POST;
    // reqGetJsonFileData.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqGetJsonFileData).then((response) => {
    //     if (response.status == 200 && response.body != "The target file does not exist") {
    //         console.log("Get file data successfully! File data:" + response.body)
    //     } else if (response.status == 200 && response.body == "The target file does not exist") {
    //         console.error("The target file does not exist")
    //     } else {
    //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })

    //覆盖文件内容
    // const reqOverwriteJsonFile = new HttpRequest(`http://127.0.0.1:${port}/OverwriteJsonFile`);
    // reqOverwriteJsonFile.body = JSON.stringify({"fileName":"FileName.json","fileData":{"a":"呵呵呵呵"}})
    // reqOverwriteJsonFile.method = HttpRequestMethod.POST;
    // reqOverwriteJsonFile.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqOverwriteJsonFile).then((response) => {
    //     if (response.status == 200 && response.body == "success") {
    //         console.log("Overwrite file data successfully!")
    //     } else if (response.status == 200 && response.body != "success") {
    //         console.error(response.body)
    //     } else {
    //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })
},60)

//

//服务器启动监听
world.afterEvents.worldInitialize.subscribe(() => {
    const reqServerStarted = http.get(`http://127.0.0.1:${port}/ServerStarted`)
    reqServerStarted.then((response) => {
        if (response.status == 200) {
            console.log("\x1b[33m[NIA V4] The dependent server has been successfully connected!\x1b[0m")
        } else {
            console.error("[NIA V4] Dependent server connection failed! Check whether the dependent server started successfully.")
        }
    })
    // const reqServerStarted = new HttpRequest(`http://127.0.0.1:${port}/ServerStarted`);
    // reqServerStarted.body = JSON.stringify({
    //     score: 22,
    // });
    // reqServerStarted.method = HttpRequestMethod.POST;
    // reqServerStarted.headers = [
    //     new HttpHeader("Content-Type", "application/json"),
    // ];
    // http.request(reqServerStarted).then((response) => {
    //     if (response.status == 200) {
    //         console.log("\x1b[33m[NIA V4] The dependent server has been successfully connected!\x1b[0m")
    //     } else {
    //         console.error("[NIA V4] Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })
})

//玩家加入服务器监听
world.afterEvents.playerJoin.subscribe((player) => {
    const reqPlayerJoin = new HttpRequest(`http://127.0.0.1:${port}/PlayerJoin`);
    reqPlayerJoin.body = player.playerName
    reqPlayerJoin.method = HttpRequestMethod.POST;
    reqPlayerJoin.headers = [
        new HttpHeader("Content-Type", "text/plain")
    ];
    http.request(reqPlayerJoin)
})

//玩家离开服务器监听
world.afterEvents.playerLeave.subscribe((player) => {
    const reqPlayerLeave = new HttpRequest(`http://127.0.0.1:${port}/PlayerLeave`);
    reqPlayerLeave.body = player.playerName
    reqPlayerLeave.method = HttpRequestMethod.POST;
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
    reqPlayerChat.method = HttpRequestMethod.POST;
    reqPlayerChat.headers = [
        new HttpHeader("Content-Type", "text/plain; charset=utf-8"),
    ];
    http.request(reqPlayerChat).then((response) => {
        if (!response.status == 200) {
            Broadcast("§c>> 依赖服务器连接失败，如果你看到此提示请联系腐竹！")
        }
    })
})