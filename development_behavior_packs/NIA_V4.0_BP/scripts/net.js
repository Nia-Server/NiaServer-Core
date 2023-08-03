import {world,system} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,log} from './customFunction.js'
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';
import { ExternalFS } from './API/filesystem.js';
const fs = new ExternalFS();
const port = 10086
const VERSION = "v1.4.0-pre-1"

const start = Date.now();


//与服务器通信获取群聊消息
// system.runInterval(() => {
//     const reqCheck = new HttpRequest(`http://127.0.0.1:${port}/Check`);
//     reqCheck.body = "hello"
//     reqCheck.method = HttpRequestMethod.POST;
//     reqCheck.headers = [
//         new HttpHeader("Content-Type", "text/plain"),
//     ];
//     http.request(reqCheck).then((response) => {
//         if (response.status == 200) {
//             let repData = JSON.parse(response.body)
//             for (let i = 0; i < repData.msgboxs.length; i++) {
//                 world.sendMessage("§6[群聊]§r <"+ repData.msgboxs[i][0] + "§r> " + repData.msgboxs[i][1])
//             }
//         } else {
//             console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！")
//         }
//     })

//     //let MarketData = []

//     // fs.getJSONFileData("market.json").then((result) => {
//     //     MarketData = result;
//     //     if (result == 0) {
//     //         fs.CreateNewJsonFile("market.json",[1,2,3])
//     //         MarketData = [1,2,3];
//     //     }
//     //     console.log(JSON.stringify(result))
//     // })


//     //NIAHttpBOT部分功能使用示例

//     // 检查文件是否存在
//     // const reqCheckFile = new HttpRequest(`http://127.0.0.1:${port}/CheckFile`);
//     // reqCheckFile.body = "FileName.json"
//     // reqCheckFile.method = HttpRequestMethod.POST;
//     // reqCheckFile.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqCheckFile).then((response) => {
//     //     if (response.status == 200 && response.body == "true") {
//     //         console.log("Target file exists.")
//     //     } else if (response.status == 200 && response.body == "false") {
//     //         console.error("The target file does not exist")
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

//     // 检查文件夹是否存在
//     // const reqCheckDir = new HttpRequest(`http://127.0.0.1:${port}/CheckDir`);
//     // reqCheckDir.body = "./A"
//     // reqCheckDir.method = HttpRequestMethod.POST;
//     // reqCheckDir.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqCheckDir).then((response) => {
//     //     if (response.status == 200 && response.body == "true") {
//     //         console.log("Target folder exists.")
//     //     } else if (response.status == 200 && response.body == "false") {
//     //         console.error("The target folder does not exist")
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

//     //创建json文件
//     // const reqCreateNewJsonFile = new HttpRequest(`http://127.0.0.1:${port}/CreateNewJsonFile`);
//     // reqCreateNewJsonFile.body = JSON.stringify({"fileName":"market111.json","fileContent":{"a":10}})
//     // reqCreateNewJsonFile.method = HttpRequestMethod.POST;
//     // reqCreateNewJsonFile.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqCreateNewJsonFile).then((response) => {
//     //     if (response.status == 200 && response.body == "success") {
//     //         console.log("File created successfully!")
//     //     } else if (response.status == 200 && response.body != "success") {
//     //         console.error(response.body)
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

//     //得到json文件数据
//     // const reqGetJsonFileData = new HttpRequest(`http://127.0.0.1:${port}/GetJsonFileData`);
//     // reqGetJsonFileData.body = "market.json"
//     // reqGetJsonFileData.method = HttpRequestMethod.POST;
//     // reqGetJsonFileData.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqGetJsonFileData).then((response) => {
//     //     if (response.status == 200 && response.body != "The target file does not exist") {
//     //         console.log("Get file data successfully! File data:" + response.body)
//     //     } else if (response.status == 200 && response.body == "The target file does not exist") {
//     //         console.error("The target file does not exist")
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

//     //覆盖文件内容
//     // const reqOverwriteJsonFile = new HttpRequest(`http://127.0.0.1:${port}/OverwriteJsonFile`);
//     // reqOverwriteJsonFile.body = JSON.stringify({"fileName":"FileName.json","fileData":{"a":"呵呵呵呵"}})
//     // reqOverwriteJsonFile.method = HttpRequestMethod.POST;
//     // reqOverwriteJsonFile.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqOverwriteJsonFile).then((response) => {
//     //     if (response.status == 200 && response.body == "success") {
//     //         console.log("Overwrite file data successfully!")
//     //     } else if (response.status == 200 && response.body != "success") {
//     //         console.error(response.body)
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

//     //执行cmd指令
//     // const reqRunCmd = new HttpRequest(`http://127.0.0.1:${port}/RunCmd`);
//     // reqRunCmd.body = "del 123.txt"
//     // reqRunCmd.method = HttpRequestMethod.POST;
//     // reqRunCmd.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqRunCmd).then((response) => {
//     //     if (response.status == 200 && response.body == "success") {
//     //         console.log("Dos command executed successfully!")
//     //     } else if (response.status == 200 && response.body != "success") {
//     //         console.error(response.body)
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

//     //向目标文件写入一行
//     // const reqWriteLineToFile = new HttpRequest(`http://127.0.0.1:${port}/WriteLineToFile`);
//     // reqWriteLineToFile.body = JSON.stringify({"fileName":"123.txt","content": "这是一行测试内容" + "\n"})
//     // reqWriteLineToFile.method = HttpRequestMethod.POST;
//     // reqWriteLineToFile.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqWriteLineToFile).then((response) => {
//     //     if (response.status == 200 && response.body == "success") {
//     //         console.log("Overwrite file data successfully!")
//     //     } else if (response.status == 200 && response.body != "success") {
//     //         console.error(response.body)
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

//     //向目标文件覆写内容
//     // const reqOverwriteFile = new HttpRequest(`http://127.0.0.1:${port}/OverwriteFile`);
//     // reqOverwriteFile.body = JSON.stringify({"fileName":"123.txt","content": "这是一行测试内容" + "\n"})
//     // reqOverwriteFile.method = HttpRequestMethod.POST;
//     // reqOverwriteFile.headers = [
//     //     new HttpHeader("Content-Type", "text/plain"),
//     // ];
//     // http.request(reqOverwriteFile).then((response) => {
//     //     if (response.status == 200 && response.body == "success") {
//     //         console.log("Overwrite file data successfully!")
//     //     } else if (response.status == 200 && response.body != "success") {
//     //         console.error(response.body)
//     //     } else {
//     //         console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
//     //     }
//     // })

// }, 60)

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