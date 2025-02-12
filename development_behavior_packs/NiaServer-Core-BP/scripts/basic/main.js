import { system, world } from '@minecraft/server';
import { log, warn, error } from "../API/logger.js";
import { Broadcast, RunCmd, AddScoreboard, GetScore, getNumberInNormalDistribution, GetShortTime} from '../API/game.js';
import { ExternalFS } from '../API/http.js';
import { cfg } from '../config.js';

const fs = new ExternalFS();

//定义一些常数

system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
    Broadcast(`§c§l[warn] NiaServer-Core运行出现异常，异常原因: ${event.terminateReason}，请及时联系腐竹！`);
    error("【watchdog】 NiaServer-Core运行出现异常，异常原因:" + event.terminateReason);
})


//服务器启动监听
//服务器初始化
world.afterEvents.worldInitialize.subscribe((event) => {
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


system.runInterval(() => {
        //增加在线时间
        RunCmd(`scoreboard players add @a time 1`);
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

