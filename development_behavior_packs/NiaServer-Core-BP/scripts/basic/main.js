import { system, world } from '@minecraft/server';
import { log, warn, error } from "../API/logger.js";
import { Broadcast, RunCmd, AddScoreboard, GetScore, getNumberInNormalDistribution, GetShortTime} from '../API/game.js';
import { ExternalFS } from '../API/http.js';
import { cfg } from '../config.js';

const fs = new ExternalFS();

//定义一些常数

// system.runInterval(() => {
// log(GetShortTime())
// }, 1)

system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
    Broadcast(`§c§l[warn] NiaServer-Core运行出现异常，异常原因: ${event.terminateReason}，请及时联系腐竹！`);
    error("【watchdog】 NiaServer-Core运行出现异常，异常原因:" + event.terminateReason);
})


//服务器启动监听
//服务器初始化
world.afterEvents.worldLoad.subscribe((event) => {
    //检测服务器是否初始化
    if (world.getDynamicProperty("state") == null) {
        //中文输出
        log("NiaServer-Core 第一次在这个世界上运行，开始初始化...");
        AddScoreboard("UUID","玩家识别码");
        AddScoreboard("DATA","服务器数据");
        AddScoreboard("money",cfg.MoneyShowName);
        AddScoreboard("time","在线时间");
        AddScoreboard("menu","§6==NIA服务器==");
        AddScoreboard("CDK","CDK数据");
        log("NiaServer-Core 初始化完成...");
        world.setDynamicProperty("state",true);
        world.setDynamicProperty("board_state",1);
    } else if (world.getDynamicProperty("state") == true) {
        log("NiaServer-Core 已在这个世界上初始化过...");
    }

})

// world.beforeEvents.explosion.subscribe((event) => {
//     event.cancel = true;
//     world.sendMessage("§7腐竹拼劲全力阻止了一次爆炸...");
// })


system.runInterval(() => {
        //增加在线时间
        RunCmd(`scoreboard players add @a time 1`);
        let player_data_tmp = {};
        for (const player of world.getAllPlayers()) {
            let player_name = player.name;
            let player_time = GetScore("time",player_name);
            let player_money = GetScore("money",player_name);
            player_data_tmp[player_name] = {
                "data": {
                    "time": player_time,
                    "money": player_money
                }
            }
        }
        if (Object.keys(player_data_tmp).length == 0) {
            return;
        }
        fs.GetJSONFileData("player_data.json").then((response) => {
            if (response == -1) {
                Broadcast("§c在与NIAHttpBOT通讯时发生错误，请及时联系管理员");
                return;
            }
            if (response == 0) {
                Broadcast("§c没有在服务器上找到相关文件，请联系管理员");
                return;
            }
            let player_data = response;
            for (const player_qq in player_data) {
                if (player_data_tmp.hasOwnProperty(player_data[player_qq].xboxid)) {
                    player_data[player_qq].data = player_data_tmp[player_data[player_qq].xboxid].data;
                }
            }
            fs.OverwriteJsonFile("player_data.json",player_data).then((response) => {
                if (response == 0) {
                    Broadcast("§c在与NIAHttpBOT通讯时发生错误，请及时联系管理员");
                    return;
                }
                if (response == -1) {
                    Broadcast("§c没有在服务器上找到相关文件，请联系管理员");
                    return;
                }
            })
        })

    // if (TIME.getMinutes() == 0 && TIME.getSeconds() == 0 ) {
    //     let RN = parseInt(getNumberInNormalDistribution(100,20))
    //     //防止物价指数出现极端数值
    //     if (RN <= 20 || RN >= 180) {
    //         RN = 100
    //     }
    //     RunCmd(`scoreboard players set RN DATA ${RN}`);
    //     RunCmd(`title @a title §c物价指数发生变动！`)
    //     RunCmd(`title @a subtitle §7物价指数由 §l§e${GetScore("DATA","RN") / 100} §r§7变为 §l§e${RN / 100}`)
    //     if (TIME.getHours() == 16) {
    //         let ScoreBoards = world.scoreboard.getObjectives()
    //         for (let i = 0; i < ScoreBoards.length; i++) {
    //             if (ScoreBoards[i].id.slice(0,2) == "R:") {
    //                 RunCmd(`scoreboard objectives remove "${ScoreBoards[i].id}"`)
    //             }
    //         }
    //         Broadcast(`§a 服务器时间已更新！`)
    //     }
    // }
},1200)

