import {system, world} from '@minecraft/server';
import { Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution,log, GetShortTime} from './customFunction.js'
import { ExternalFS } from './API/filesystem.js';
import { LAST_UPGRATE,VERSION,CODE_BRANCH } from './main.js';

const fs = new ExternalFS();

//定义一些常数

system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
    Broadcast(`§c§l[warn] NIA V4运行出现异常，异常原因: ${event.terminateReason}，请及时联系腐竹！`);
    console.error("[watchdog] Abnormal operation, reason for abnormality:" + event.terminateReason);
})

//服务器启动监听
//服务器初始化
world.afterEvents.worldInitialize.subscribe((event) => {
    //检测服务器是否初始化
    if (world.getDynamicProperty("state") == null) {
        //中文输出
        log("NiaServer-Core is running on this server for the first time to start initialisation!")
        AddScoreboard("UUID","玩家识别码");
        AddScoreboard("DATA","服务器数据");
        AddScoreboard("money","能源币");
        AddScoreboard("time","在线时间");
        AddScoreboard("menu","§6==NIA服务器==");
        AddScoreboard("CDK","CDK数据");
        AddScoreboard("stamina","体力值");
        log("NIA V4 initialisation was successful!");
        world.setDynamicProperty("state",true);
        world.setDynamicProperty("board_state",1);
    } else if (world.getDynamicProperty("state") == true) {
        log("NiaServer-Core is running on this server for the first time to start initialisation!")
    }

})


system.runInterval(() => {
    let TIME = new Date();
    //每分钟更新一次
    if (TIME.getMinutes() == 0 && TIME.getSeconds() == 0 ) {
        let RN = parseInt(getNumberInNormalDistribution(100,20))
        //防止物价指数出现极端数值
        if (RN <= 20 || RN >= 180) {
            RN = 100
        }
        RunCmd(`scoreboard players set RN DATA ${RN}`);
        RunCmd(`title @a title §c物价指数发生变动！`)
        RunCmd(`title @a subtitle §7物价指数由 §l§e${GetScore("DATA","RN") / 100} §r§7变为 §l§e${RN / 100}`)
        //自动备份
        //Broadcast(`§e 服务器自动备份中！可能出现卡顿，请勿在此时进行较大负载活动！`);
        //暂时不可用
        // fs.Backup(`${cfg.MapFolder}`,`.${cfg.BackupFolder}\\${GetShortTime()}`).then((result) => {
        //     if (result === "success") {
        //         Broadcast(`§a 服务器自动备份成功！备份存档校验码：${GetShortTime()}`)
        //     } else {
        //         Broadcast("§c 服务器备份失败！失败错误码：" + result + " 请联系管理员！")
        //     }
        // })
        if (TIME.getHours() == 16) {
            let ScoreBoards = world.scoreboard.getObjectives()
            for (let i = 0; i < ScoreBoards.length; i++) {
                if (ScoreBoards[i].id.slice(0,2) == "R:") {
                    RunCmd(`scoreboard objectives remove "${ScoreBoards[i].id}"`)
                }
            }
            Broadcast(`§a 服务器时间已更新！`)
        }
    }
},40)

