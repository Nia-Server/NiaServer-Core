import {world,system} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution, GetTime} from './customFunction.js'
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';
const port = 10086
const VERSION = "v1.3.1-pre-1"
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


    //NIAHttpBOT部分功能使用示例

    // 检查文件是否存在
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

    // 检查文件夹是否存在
    // const reqCheckDir = new HttpRequest(`http://127.0.0.1:${port}/CheckDir`);
    // reqCheckDir.body = "./A"
    // reqCheckDir.method = HttpRequestMethod.POST;
    // reqCheckDir.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqCheckDir).then((response) => {
    //     if (response.status == 200 && response.body == "true") {
    //         console.log("Target folder exists.")
    //     } else if (response.status == 200 && response.body == "false") {
    //         console.error("The target folder does not exist")
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

    //执行cmd指令
    // const reqRunCmd = new HttpRequest(`http://127.0.0.1:${port}/RunCmd`);
    // reqRunCmd.body = "del 123.txt"
    // reqRunCmd.method = HttpRequestMethod.POST;
    // reqRunCmd.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqRunCmd).then((response) => {
    //     if (response.status == 200 && response.body == "success") {
    //         console.log("Dos command executed successfully!")
    //     } else if (response.status == 200 && response.body != "success") {
    //         console.error(response.body)
    //     } else {
    //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })

    //向目标文件写入一行
    // const reqWriteLineToFile = new HttpRequest(`http://127.0.0.1:${port}/WriteLineToFile`);
    // reqWriteLineToFile.body = JSON.stringify({"fileName":"123.txt","content": "这是一行测试内容" + "\n"})
    // reqWriteLineToFile.method = HttpRequestMethod.POST;
    // reqWriteLineToFile.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqWriteLineToFile).then((response) => {
    //     if (response.status == 200 && response.body == "success") {
    //         console.log("Overwrite file data successfully!")
    //     } else if (response.status == 200 && response.body != "success") {
    //         console.error(response.body)
    //     } else {
    //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })

    //向目标文件覆写内容
    // const reqOverwriteFile = new HttpRequest(`http://127.0.0.1:${port}/OverwriteFile`);
    // reqOverwriteFile.body = JSON.stringify({"fileName":"123.txt","content": "这是一行测试内容" + "\n"})
    // reqOverwriteFile.method = HttpRequestMethod.POST;
    // reqOverwriteFile.headers = [
    //     new HttpHeader("Content-Type", "text/plain"),
    // ];
    // http.request(reqOverwriteFile).then((response) => {
    //     if (response.status == 200 && response.body == "success") {
    //         console.log("Overwrite file data successfully!")
    //     } else if (response.status == 200 && response.body != "success") {
    //         console.error(response.body)
    //     } else {
    //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
    //     }
    // })

}, 60)

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

        //检查更新
        const reqCheckUpdate = http.get(`http://api.github.com/repos/NIANIANKNIA/NIASERVER-V4/releases`)
        reqCheckUpdate.then((response) => {
            if (response.status == 200) {
                if (JSON.parse(response.body)[0].tag_name != VERSION) {
                    console.warn(`The current version is not the latest version. The currently used version is ${VERSION}, and the latest version is ${JSON.parse(response.body)[0].tag_name}. Click the link to jump to download immediately: https://github.com/NIANIANKNIA/NIASERVER-V4/releases/tag/${JSON.parse(response.body)[0].tag_name}`)
                } else {
                    console.log("Checking for updates is successful, all versions are the latest versions!")
                }
            } else {
                console.error("Github server connection failed!")
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