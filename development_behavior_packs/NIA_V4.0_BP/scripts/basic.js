import { OxygenGUI } from './menu/oxygen.js';
import {system, world} from '@minecraft/server';
import { Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution,log, GetShortTime} from './customFunction.js'
import { cfg } from './config.js';
import { ExternalFS } from './API/filesystem.js';
import { LAST_UPGRATE,VERSION,CODE_BRANCH } from './main.js';

//定义一些常数
const fs = new ExternalFS();

let posData = {}

const equLevelData = {
    "0": {
        "name": "初级呼吸装备Ⅰ",
        "max": 5000,
        "consume": 20,
        "price": 0
    },
    "1": {
        "name": "初级呼吸装备Ⅱ",
        "max": 5300,
        "consume": 19,
        "price": 100
    },
    "2": {
        "name": "初级呼吸装备Ⅲ",
        "max": 5500,
        "consume": 18,
        "price": 300
    },
    "3": {
        "name": "中级呼吸装备Ⅰ",
        "max": 5800,
        "consume": 18,
        "price": 500
    },
    "4": {
        "name": "中级呼吸装备Ⅱ",
        "max": 6000,
        "consume": 17,
        "price": 1000
    },
    "5": {
        "name": "中级呼吸装备Ⅲ",
        "max": 6000,
        "consume": 16,
        "price": 1200
    },
    "6": {
        "name": "高级呼吸装备Ⅰ",
        "max": 6300,
        "consume": 16,
        "price": 1500
    },
    "7": {
        "name": "高级呼吸装备Ⅱ",
        "max": 6500,
        "consume": 15,
        "price": 2000
    },
    "8": {
        "name": "高级呼吸装备Ⅲ",
        "max": 6500,
        "consume": 14,
        "price": 2500
    },
    "9": {
        "name": "X级呼吸装备Ⅰ",
        "max": 7000,
        "consume": 13,
        "price": 5000
    },
    "10": {
        "name": "X级呼吸装备Ⅱ",
        "max": 8000,
        "consume": 13,
        "price": 8000
    },
    "11": {
        "name": "X级呼吸装备Ⅲ",
        "max": 9000,
        "consume": 12,
        "price": 10000
    },
    "12": {
        "name": "X级呼吸装备Ⅳ",
        "max": 10000,
        "consume": 11,
        "price": 10000
    },
    "13": {
        "name": "X级呼吸装备Ⅴ",
        "max": 15000,
        "consume": 10,
        "price": 15000
    },
    "14": {
        "name": "S级呼吸装备Ⅰ",
        "max": 15000,
        "consume": 5,
        "price": 20000
    },
    "15": {
        "name": "S级呼吸装备Ⅱ",
        "max": 15000,
        "consume": 3,
        "price": 30000
    },
    "16": {
        "name": "S级呼吸装备Ⅲ",
        "max": 15000,
        "consume": 2,
        "price": 40000
    },
    "17": {
        "name": "V级呼吸装备",
        "max": 15000,
        "consume": 1,
        "price": 50000
    }
}

system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
    Broadcast(`§c§l[warn] NIA V4运行出现异常，异常原因: ${event.terminateReason}，请及时联系腐竹！`);
    console.error("[watchdog] Abnormal operation, reason for abnormality:" + event.terminateReason);
})

//服务器启动监听
//服务器初始化
world.afterEvents.worldInitialize.subscribe((event) => {
    //检测服务器是否初始化
    //const INIT = new DynamicPropertiesDefinition().defineBoolean("state");
    //event.propertyRegistry.registerWorldDynamicProperties(INIT);
    if (world.getDynamicProperty("state") == null) {
        log("NIA V4.5 is running on this server for the first time to start initialisation!")
        AddScoreboard("UUID","玩家识别码");
        AddScoreboard("DATA","服务器数据");
        AddScoreboard("money","能源币");
        AddScoreboard("oxygen","氧气值");
        AddScoreboard("equLevel","装备等级");
        AddScoreboard("actionbar","标题栏显示样式");
        AddScoreboard("time","在线时间");
        AddScoreboard("menu","§6==NIA服务器==");
        AddScoreboard("AnoxicTime","缺氧时间");
        AddScoreboard("CDK","CDK数据");
        AddScoreboard("stamina","体力值");
        log("NIA V4 initialisation was successful!");
        world.setDynamicProperty("state",true);
    } else if (world.getDynamicProperty("state") == true) {
        log("The NIA V4.5 has been initialised!");
        world.scoreboard.removeObjective("menu");
        //英文
        // world.scoreboard.addObjective("menu","");
        world.scoreboard.addObjective("menu","");
        //world.scoreboard.addObjective("menu","");
        RunCmd(`scoreboard objectives setdisplay sidebar menu ascending`);
        world.scoreboard.getObjective("menu").addScore(`§e当前测试阶段：PRE-2`,0);
        world.scoreboard.getObjective("menu").addScore(`§e当前版本：${VERSION}`,1);
        world.scoreboard.getObjective("menu").addScore("§c上次更新时间：",2);
        world.scoreboard.getObjective("menu").addScore(`${LAST_UPGRATE}`,3);
        world.scoreboard.getObjective("menu").addScore(`§7测试版本并不代表`,4);
        world.scoreboard.getObjective("menu").addScore(`§7最终发布版本`,5);
    }

})

// 玩家死亡后重生的检测
world.afterEvents.playerSpawn.subscribe(event => {
    if (!event.initialSpawn) {
        if (GetScore("equLevel",event.player.nameTag) < 17) {
            RunCmd(`scoreboard players set @a[name="${event.player.nameTag}"] oxygen ${parseInt(GetScore("oxygen",event.player.nameTag) * 0.9)}`)
            event.player.sendMessage(`§c 您由于死亡损失了剩余的10%的氧气值！`)
        }
    }
})

system.runInterval(() => {
    let players = world.getPlayers()
    let playerList = Array.from(players);
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
        Broadcast(`§e 服务器自动备份中！可能出现卡顿，请勿在此时进行较大负载活动！`);
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
    //每秒钟更新一次
    if (TIME.getSeconds() == 0) {
        for (let playername in posData) {
            posData[playername].num = 0
        }
        RunCmd(`scoreboard players add @a time 1`);
        for (let i = 0; i < playerList.length; i++) {
            RunCmd(`scoreboard players add @e[name="${playerList[i].nameTag}",type=player] oxygen -${equLevelData[GetScore("equLevel",playerList[i].nameTag)].consume}`);
            if (playerList[i].dimension.id == "minecraft:nether" && GetScore("equLevel",playerList[i].nameTag) <= 8) {
                RunCmd(`scoreboard players add @e[name="${playerList[i].nameTag}",type=player] oxygen -${equLevelData[GetScore("equLevel",playerList[i].nameTag)].consume}`)
            }
            if (playerList[i].dimension.id == "minecraft:the_end" && GetScore("equLevel",playerList[i].nameTag) <= 13) {
                RunCmd(`scoreboard players add @e[name="${playerList[i].nameTag}",type=player] oxygen -${equLevelData[GetScore("equLevel",playerList[i].nameTag)].consume * 2}`)
            }
            if (playerList[i].hasTag("fly") && GetScore("equLevel",playerList[i].nameTag) >= 13) {
                RunCmd(`scoreboard players add @e[name="${playerList[i].nameTag}",type=player] oxygen -${equLevelData[GetScore("equLevel",playerList[i].nameTag)].consume * 99}`)
            }
        }
    }
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].dimension.id == "minecraft:the_end" || playerList[i].dimension.id == "minecraft:nether") {
            playerList[i].removeTag("fly")
            RunCmd(`ability @a[name="${playerList[i].nameTag}",tag=!op] mayfly false`)
        }
        //这里控制玩家氧气值不超过100%
        if (GetScore("oxygen",playerList[i].nameTag) > equLevelData[GetScore("equLevel",playerList[i].nameTag)].max) {
            RunCmd(`scoreboard players set @a[name="${playerList[i].nameTag}"] oxygen ${equLevelData[GetScore("equLevel",playerList[i].nameTag)].max}`)
        }
        //这里控制玩家氧气值不低于0
        if (GetScore("oxygen",playerList[i].nameTag) < 0) {
            RunCmd(`scoreboard players set @a[name="${playerList[i].nameTag}"] oxygen 0`)
        }
        //生命恢复
        if (GetScore("oxygen",playerList[i].nameTag) > 3500 && GetScore("equLevel",playerList[i].nameTag) < 14) {
            RunCmd(`effect "${playerList[i].nameTag}" regeneration 15 0 true`)
        } else if (GetScore("oxygen",playerList[i].nameTag) > 3500 && GetScore("equLevel",playerList[i].nameTag) >= 14) {
            RunCmd(`effect "${playerList[i].nameTag}" regeneration 15 1 true`)
        }
        //夜视
        if (playerList[i].hasTag("NightVision") && GetScore("equLevel",playerList[i].nameTag) > 16) {
            RunCmd(`effect "${playerList[i].nameTag}" night_vision 15 0 true`)
        }
        //力量
        if (GetScore("oxygen",playerList[i].nameTag) > 4800 && GetScore("equLevel",playerList[i].nameTag) < 16) {
            RunCmd(`effect "${playerList[i].nameTag}" strength 15 0 true`)
        } else if (GetScore("oxygen",playerList[i].nameTag) > 4800 && GetScore("equLevel",playerList[i].nameTag) >= 16) {
            RunCmd(`effect "${playerList[i].nameTag}" strength 15 1 true`)
        }
        if (playerList[i].dimension.id == "minecraft:nether" && GetScore("equLevel",playerList[i].nameTag) <= 8) {
            RunCmd(`effect "${playerList[i].nameTag}" slowness 15 0 true`)
            RunCmd(`effect "${playerList[i].nameTag}" weakness 15 2 true`)
        }
        if (playerList[i].dimension.id == "minecraft:the_end" && GetScore("equLevel",playerList[i].nameTag) <= 13) {
            RunCmd(`effect "${playerList[i].nameTag}" slowness 15 0 true`)
            RunCmd(`effect "${playerList[i].nameTag}" weakness 15 3 true`)
        }
        if ((Math.pow(playerList[i].getVelocity().x,2) + Math.pow(playerList[i].getVelocity().y,2) + Math.pow(playerList[i].getVelocity().z,2)) > 0.07 && GetScore("equLevel",playerList[i].nameTag) <= 10) {
            RunCmd(`scoreboard players add @e[name="${playerList[i].nameTag}",type=player] oxygen -1`);
        }
        if (GetScore("oxygen",playerList[i].nameTag) <= 0) {
            RunCmd(`scoreboard players add @a[name="${playerList[i].nameTag}"] AnoxicTime 1`)
        } else {
            RunCmd(`scoreboard players set @a[name="${playerList[i].nameTag}"] AnoxicTime 0`)
        }
        if (GetScore("AnoxicTime",playerList[i].nameTag) == 1) {
            RunCmd(`title "${playerList[i].nameTag}" title §c您已缺氧！`)
            RunCmd(`title "${playerList[i].nameTag}" subtitle §7请及时补充氧气！`)
            Tell("§c 您已进入缺氧状态！请及时补充氧气，否则会导致死亡！5秒后系统将自动打开氧气购买界面！",playerList[i].nameTag)
        }
        if (GetScore("AnoxicTime",playerList[i].nameTag) == 6) {
            OxygenGUI.OxygenBuy(playerList[i])
        }
        if (GetScore("oxygen",playerList[i].nameTag) <= 200) {
            RunCmd(`effect "${playerList[i].nameTag}" slowness 15 0`)
            RunCmd(`effect "${playerList[i].nameTag}" weakness 15 2`)
        }
        if (GetScore("AnoxicTime",playerList[i].nameTag) >= 60) {
            RunCmd(`effect "${playerList[i].nameTag}" blindness 15 0`)
            RunCmd(`effect "${playerList[i].nameTag}" mining_fatigue 15 2`)
            RunCmd(`effect "${playerList[i].nameTag}" nausea 15 0`)
        }
        //缺氧达到一定时间后直接进行死亡程序
        if (GetScore("AnoxicTime",playerList[i].nameTag) >= 240) {
            RunCmd(`kill "${playerList[i].nameTag}"`)
            Tell("§c 我们很遗憾的通知您，由于您缺氧过长时间，昏倒在家中...幸亏您被巡逻机器人及时发现并送到了医院，才救回一条命...",playerList[i].nameTag)
            RunCmd(`scoreboard players set @a[name="${playerList[i].nameTag}"] oxygen 200`)
            RunCmd(`scoreboard players set @a[name="${playerList[i].nameTag}"] AnoxicTime 0`)
            RunCmd(`scoreboard players add @a[name="${playerList[i].nameTag}"] money -50`)
            Tell("§r======================\n§cNIA服务器医院 账单§r\n======================§c\n氧气费用 --- 20 能源币\n诊疗费用 --- 20 能源币\n转运费用 --- 10 能源币\n合计费用 --- 50 能源币§r\n======================",playerList[i].nameTag)
            Tell("§r===============================\n§cNIA服务器自动扣费通知§r\n===============================§c\n50 能源币 已自动从您账户扣除\n如果您发现账户余额为负请及时补齐\n否则可能影响您的信誉值！§r\n===============================",playerList[i].nameTag)
        }
        ///////////////////////////////////
        let titleActionbar = "";
        if(playerList[i].hasTag("ShowActionbar")) {
            if (playerList[i].hasTag("fly")) {
                titleActionbar = "§c飞行模式§r "
            }
            if (GetScore("oxygen",playerList[i].nameTag) <= 200 && GetScore("oxygen",playerList[i].nameTag) > 0) {
                titleActionbar = titleActionbar + "§r§c§l您即将进入缺氧状态，请及时补充氧气！"
            }
            if (playerList[i].dimension.id == "minecraft:nether" && GetScore("equLevel",playerList[i].nameTag) <= 8) {
                titleActionbar = titleActionbar + "§r§c§l⚠警告！您目前呼吸装备等级过低，氧气消耗速度是原有的1倍！"
            }
            if (playerList[i].dimension.id == "minecraft:the_end" && GetScore("equLevel",playerList[i].nameTag) <= 13) {
                titleActionbar = titleActionbar + "§r§c§l⚠警告！您目前呼吸装备等级过低，氧气消耗速度是原有的2倍！"
            }
            if (GetScore("AnoxicTime",playerList[i].nameTag) > 0) {
                titleActionbar = titleActionbar + "§r§c§l⚠警告！您已经进入缺氧状态 " + GetScore("AnoxicTime",playerList[i].nameTag) + " 秒，请及时补充氧气否则将会死亡！"
            }
            playerList[i].onScreenDisplay.setActionBar(titleActionbar);
        }
    }
},20)

