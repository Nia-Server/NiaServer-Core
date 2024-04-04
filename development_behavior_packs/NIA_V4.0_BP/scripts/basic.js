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
        // AddScoreboard("UUID","玩家识别码");
        // AddScoreboard("DATA","服务器数据");
        // AddScoreboard("money","能源币");
        // AddScoreboard("time","在线时间");
        // AddScoreboard("menu","§6==NIA服务器==");
        // AddScoreboard("CDK","CDK数据");
        // AddScoreboard("stamina","体力值");
        // log("NIA V4 initialisation was successful!");
        // world.setDynamicProperty("state",true);
        // world.setDynamicProperty("board_state",1);


        world.setDynamicProperty("board_state",1);
        log("The NiaServer-Core has been initialised!");
        try {
            world.scoreboard.removeObjective("menu");
            world.scoreboard.removeObjective("player_death");
            world.scoreboard.removeObjective("player_kill");
        } catch (error) {
            log(error)
        }

        //英文
        world.scoreboard.addObjective("menu","");
        world.scoreboard.addObjective("player_death","死亡总榜");
        world.scoreboard.addObjective("player_kill","击杀总榜");
        RunCmd(`scoreboard objectives setdisplay sidebar menu ascending`);
        world.scoreboard.getObjective("menu").addScore(`§c新年快乐喵~`,1);
        world.scoreboard.getObjective("menu").addScore(`§c玩的开心喵~`,2);
        // world.scoreboard.getObjective("menu").addScore(`§e当前版本：${VERSION}`,1);
        // world.scoreboard.getObjective("menu").addScore("§c上次更新时间：",2);
        // world.scoreboard.getObjective("menu").addScore(`${LAST_UPGRATE}`,3);
        // world.scoreboard.getObjective("menu").addScore(`§7测试版本并不代表`,4);
        // world.scoreboard.getObjective("menu").addScore(`§7最终发布版本`,5);
    }

})

var player_death_data = {};

//读取玩家死亡数据
fs.GetJSONFileData(`player_death.json`).then((result) => {
    if (result === 0) {
        fs.CreateNewJsonFile("player_death.json",{}).then((result) => {
            if (result === "success") {
                log("The player death data file(player_death.json) does not exist and has been successfully created!");
            } else if (result === -1) {
                console.error("[NiaServer-Core] Dependency server connection failed!");
            }
        });
    } else if (result === -1) {
        console.error("[NiaServer-Core] Dependency server connection failed!");
    } else {
        //文件存在且服务器连接成功
        player_death_data = result;
        log("The player death data acquired successfully!");
    }
})



//玩家死亡监听
world.afterEvents.entityDie.subscribe((event) => {
    event.deadEntity.sendMessage("§c 你已经死亡！请注意保护自己！");
    //向击杀者发送消息
    if (event.damageSource.cause == "entityAttack" && event.damageSource.damagingEntity.typeId == "minecraft:player") {
        event.damageSource.damagingEntity.sendMessage(`§a 你成功击杀了玩家 §6${event.deadEntity.nameTag} §a！`);
    }
    //记录玩家死亡次数
    log(player_death_data.hasOwnProperty(event.deadEntity.nameTag))
    if (player_death_data.hasOwnProperty(event.deadEntity.nameTag) == false) {
        let temp_player_death = {};
        temp_player_death.deathnum = 1;
        temp_player_death.killnum = 0;
        player_death_data[event.deadEntity.nameTag] = temp_player_death;
    } else {
        player_death_data[event.deadEntity.nameTag].deathnum += 1;
    }
    // if (player_death_data[event.deadEntity.nameTag] == null) {
    //     player_death_data[event.deadEntity.nameTag] = {};
    //     player_death_data[event.deadEntity.nameTag].deathnum = 1;
    // } else {
    //     player_death_data[event.deadEntity.nameTag].deathnum += 1;
    // }
    //记录玩家击杀次数
    if (event.damageSource.cause == "entityAttack" && event.damageSource.damagingEntity.typeId == "minecraft:player" && player_death_data.hasOwnProperty(event.damageSource.damagingEntity.nameTag) == false) {
        let temp_player_kill = {};
        temp_player_kill.deathnum = 0;
        temp_player_kill.killnum = 1;
        player_death_data[event.damageSource.damagingEntity.nameTag] = temp_player_kill;
    } else if (event.damageSource.cause == "entityAttack") {
        player_death_data[event.damageSource.damagingEntity.nameTag].killnum += 1;
    }
    //写入文件
    fs.OverwriteJsonFile("player_death.json",player_death_data).then((result) => {
        if (result === "success") {
            log("The player death data has been successfully updated!");
        } else if (result === -1) {
            console.error("[NiaServer-Core] Dependency server connection failed!");
            Broadcast("§c 服务器连接失败！请联系管理员！");
        }
    })
},{"entityTypes":["minecraft:player"]})


system.runInterval(() => {
    let board_state = world.getDynamicProperty("board_state");
    //log(board_state);
    switch (board_state) {
        case 1:
            RunCmd(`scoreboard objectives setdisplay sidebar menu ascending`);
            world.setDynamicProperty("board_state",2);
            break;
        case 2:
            //展示玩家击杀数据
            //log(JSON.stringify(player_death_data))
            for (let i in player_death_data) {
                world.scoreboard.getObjective("player_kill").removeParticipant(`§6${i}`);
                world.scoreboard.getObjective("player_kill").addScore(`§6${i}`,player_death_data[i].killnum);
            }
            //设置显示
            RunCmd(`scoreboard objectives setdisplay sidebar player_kill descending`);
            world.setDynamicProperty("board_state",3);
            break;
        case 3:
            //展示玩家死亡数据
            for (let i in player_death_data) {
                world.scoreboard.getObjective("player_death").removeParticipant(`§6${i}`);
                world.scoreboard.getObjective("player_death").addScore(`§6${i}`,player_death_data[i].deathnum);
            }
            //设置显示
            RunCmd(`scoreboard objectives setdisplay sidebar player_death descending`);
            world.setDynamicProperty("board_state",1);
            break;
        default:
            world.setDynamicProperty("board_state",1);
            break;

    }
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

