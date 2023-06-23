import {world,system} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution} from './customFunction.js'
//import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';


//与服务器通信获取群聊消息
// system.runInterval(() => {
//     const reqCheckChat = new HttpRequest("http://127.0.0.1:3000/CheckGrounpChat");
//     reqCheckChat.body = JSON.stringify({
//         score: 22,
//     });
//     reqCheckChat.method = HttpRequestMethod.POST;
//     reqCheckChat.headers = [
//         new HttpHeader("Content-Type", "application/json"),
//     ];
//     http.request(reqCheckChat).then((response) => {
//         if (response.status == 200) {
//             let msgBoxs = JSON.parse(response.body)
//             //Broadcast("body:" + response.body)
//             if (!msgBoxs  == {}) {
//                 for (let name in msgBoxs) {
//                     world.sendMessage("§6[群聊]§r <"+ name + "§r> " + msgBoxs[name])
//                 }
//             }
//         } else {
//             Broadcast("§c>> 依赖服务器连接失败，如果你看到此提示请联系腐竹！")
//         }
//     })
// },60)


//对一些指令的检测
world.afterEvents.chatSend.subscribe(t => {
    //对于指令前缀"-"的检测以及相关权限的检测
    if (t.message.slice(0,1) == "-") {
        //取消有自定义指令前缀的消息输出
        t.cancel = true;
        //检查玩家是否拥有相关权限
        if(t.sender.hasTag("op")) {
            //在拥有权限之后再次检测玩家消息
            let hasCommand = false;
            switch (t.message) {
                //install 指令
                case "-install":
                    hasCommand = true;
                    Broadcast("§c>> NIA V4初始化安装已开始！\n§a===============================");
                    //IslandData存储空岛数据计分板
                    AddScoreboard("IslandData","空岛数据");
                    //IslandID要获得的空岛坐标的空岛编号计分板
                    AddScoreboard("IslandID","空岛编号");
                    //posX坐标计分板
                    AddScoreboard("posX","x坐标");
                    //posX坐标计分板
                    AddScoreboard("posY","y坐标");
                    //posZ坐标计分板
                    AddScoreboard("posZ","z坐标");
                    //UUID分板
                    AddScoreboard("UUID","玩家识别码");
                    //数据计分板
                    AddScoreboard("DATA","服务器数据");
                    AddScoreboard("money","能源币");
                    AddScoreboard("oxygen","氧气值");
                    AddScoreboard("equLevel","装备等级");
                    AddScoreboard("actionbar","标题栏显示样式");
                    AddScoreboard("time","在线时间");
                    AddScoreboard("menu","§6==NIA服务器==");
                    AddScoreboard("AnoxicTime","缺氧时间");
                    AddScoreboard("CDK","CDK数据");
                    AddScoreboard("show_time","展示时间");
                    AddScoreboard("c_time","创建空岛时间");
                    AddScoreboard("stamina","体力值")
                    AddScoreboard("miningTime","采矿时间")
                    RunCmd(`scoreboard players set num IslandData 1`)
                    Broadcast("§a===============================\n§c>> NIA V4初始化安装已完成！");
                    break;
                case "-c":
                    hasCommand = true;
                    t.sender.sendMessage("§c>> 注意本指令为调试指令");
                    // const req = new HttpRequest("http://127.0.0.1:3000");
                    // req.method = HttpRequestMethod.POST;
                    // req.body = JSON.stringify({score: 22});
                    // req.headers = [
                    //     new HttpHeader("Content-Type", "application/json"),
                    // ];
                    // http.request(req)
                    const req = new HttpRequest("http://127.0.0.1:3000/test");
                    req.body = JSON.stringify({
                      score: 22,
                    });
                    req.method = HttpRequestMethod.POST;
                    req.headers = [
                      new HttpHeader("Content-Type", "application/json"),
                    ];
                    http.request(req).then((response) => {
                        Broadcast("body:" + response.body)
                    })
                    // http.get("http://127.0.0.1:3000").then((response) => {
                    //     t.sender.sendMessage("status" + response.status)
                    // })
                    // http.request(req).then((response) => {
                    //     t.sender.sendMessage(response.status)
                    // })
                    t.sender.sendMessage("§c>> 注意本指令为调试指令，不要在正式生产环境中使用本指令！");
                    break;
                case "-h":
                    hasCommand = true;
                    // set dynamic property
                    world.setDynamicProperty("CDKData", "这是一个测试字符串！");
                    Broadcast(world.getDynamicProperty("CDKData").toString())
                    Tell("§c>> 注意本指令为调试指令，不要在正式生产环境中使用本指令！",t.sender.nameTag);
                    break;
                case "-a":
                    hasCommand = true;
                    // set dynamic property
                    Tell("§c>> 注意本指令为调试指令，不要在正式生产环境中使用本指令！" + cfg.test,t.sender.nameTag);
                    break;
                case "-RN":
                    hasCommand = true;
                    let RN = parseInt(getNumberInNormalDistribution(100,20))
                    //防止物价指数出现极端数值
                    if (RN <= 20 || RN >= 180) {
                        RN = 100
                    }
                    RunCmd(`scoreboard players set RN DATA ${RN}`);
                    RunCmd(`title @a title §c物价指数触发手动更新！`)
                    RunCmd(`title @a subtitle §7物价指数由 §l§e${GetScore("DATA","RN") / 100} §r§7变为 §l§e${RN / 100}`)
                    RunCmd(`backup`);
                    Tell("§c>> 注意本指令为调试指令，不要在正式生产环境中使用本指令！",t.sender.nameTag);
                    break;
                case "-spawnores":
                    break;
            }
            if (!hasCommand) {
                Tell(`§c>> 未知的指令 ${t.message} ！请检查相关指令格式！`,t.sender.nameTag);
            }
        } else {
            Tell("§c>> 你没有相关权限!",t.sender.nameTag);
        }
    }
    //对于指令前缀"+"的检测
    if (t.message.slice(0,1) == "+") {
        //取消有自定义指令前缀的消息输出
        t.cancel = true;
        let hasCommand = false;
        switch (t.message) {
            //help 指令
            case "+help":
                hasCommand = true;
                Tell("§c暂无相关帮助",t.sender.nameTag);
                break;
            // case "+get":
            //     hasCommand = true;
                // RunCmd(`scoreboard players add @a UUID 0`)
                // let Participants = world.scoreboard.getObjective("UUID").getParticipants();
                // for (let i = 0; i < Participants.length; i++) {
                //     if (Participants[i].displayName == t.sender.nameTag) {
                //         let UUID = world.scoreboard.getObjective("UUID").getScore(Participants[i]);
                //         if (UUID == 0) {
                //             UUID = 100000 + Math.floor(Math.random() * 100000);
                //             RunCmd(`scoreboard players set @a[name=${t.sender.nameTag}] UUID ${UUID}`);
                //             Tell(`§c>> 您第一次获取UUID，已经为您获取的UUID为：§a${UUID}§c，请发给腐竹获取创造验证码！`,t.sender.nameTag);
                //         } else {
                //             Tell(`§c>> 您的UUID为：§a${UUID}§c，请发给腐竹获取创造验证码！`,t.sender.nameTag);
                //         }
                //         break;
                //     }
                // }
            //     break;
            case "+zc":
                hasCommand = true;
                RunCmd(`tp "${t.sender.nameTag}" 702 82 554`);
                break;
            case "+clock":
                hasCommand = true;
                RunCmd(`give "${t.sender.nameTag}" clock`);
                Tell(`§e>> 钟表已经成功发放！`,t.sender.nameTag)
                break;
        }
        if (!hasCommand) {
            Tell(`§c>> 未知的指令 ${t.message} ！请检查相关指令格式或输入+help获取帮助！`,t.sender.nameTag)
        }
    }

    //对于指令前缀"#"的检测
    // if (t.message.slice(0,1) == "#") {
    //     //取消有自定义指令前缀的消息输出
    //     t.cancel = true;
    //     RunCmd(`scoreboard players add @a UUID 0`)
    //     let Participants = world.scoreboard.getObjective("UUID").getParticipants();
    //     for (let i = 0; i < Participants.length; i++) {
    //         if (Participants[i].displayName == t.sender.nameTag) {
    //             let UUID = world.scoreboard.getObjective("UUID").getScore(Participants[i]);
    //             if (UUID == 0) {
    //                 Tell(`§c>> 您还没有UUID，请输入+get来获取！`,t.sender.nameTag);
    //             } else {
    //                 let password = parseInt(t.message.slice(1));
    //                 if (password == parseInt(((UUID * 12345) + 65432) / 9876 + 100000)) {
    //                     Tell(`§c>> 验证码正确！您已获得相关权限！`,t.sender.nameTag);
    //                     RunCmd(`gamemode c ${t.sender.nameTag}`);
    //                 } else {
    //                     Tell(`§c>> 您输入的验证码不正确，请再次重试！如果您还未获得验证码，请将您的UUID§a${UUID}§c发给腐竹获取创造验证码！`,t.sender.nameTag);
    //                 }
    //             }
    //             break;
    //         }
    //     }
    // }

    //对于指令前缀"*"的检测
    if (t.message.slice(0,1) == "*") {
        //取消有自定义指令前缀的消息输出
        t.cancel = true;
        if (t.sender.nameTag == "NIANIANKNIA") {
            Tell(`§c>> 密码为§a${parseInt(((t.message.slice(1) * 12345) + 65432) / 9876 + 100000)}`,t.sender.nameTag);
        }
    }

    //玩家说话转发群聊
    // const reqPlayerChat = new HttpRequest("http://127.0.0.1:3000/PlayerChat");
    // let msg = {}
    // msg.name = t.sender.nameTag
    // msg.message = t.message
    // reqPlayerChat.body = JSON.stringify(msg);
    // reqPlayerChat.method = HttpRequestMethod.POST;
    // reqPlayerChat.headers = [
    //     new HttpHeader("Content-Type", "application/json"),
    // ];
    // http.request(reqPlayerChat).then((response) => {
    //     if (!response.status == 200) {
    //         Broadcast("§c>> 依赖服务器连接失败，如果你看到此提示请联系腐竹！")
    //     }
    // })
})