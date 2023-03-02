////////////////////////////////////////////////////////////////////////////
//关于本脚本声明
//作者：NIANIANKNIA
//版权声明：本插件完全由NIANIANKNIA自己全程独自开发，版权归属于NIA服务器所有
//本脚本仅仅用于学习用途
//严禁任何个人、组织严禁在未经授权的情况下使用本脚本盈利
//脚本名称：NIA服务器V4运行核心脚本
//脚本版本：v4.2.11（BETA）
////////////////////////////////////////////////////////////////////////////


import {world,BlockLocation,DynamicPropertiesDefinition,system} from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {ShopGUI} from './shop.js'
import {Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution} from './customFunction.js'
import './chat.js'
import { OxygenGUI } from './oxygen.js';
import { cfg } from './config.js';



//定义一些常数
const R = 1000;  //空岛间距/初始半径
const CX = 402;
const CY = 100;
const CZ = 547
let posData = {}

//呼吸装备等级
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

//空岛数据
const IslandData = {
    "mystructure:forest" : {
        "name": "丛林岛",
        "pos" : [10,16,8],
        "description": "丛林风格的空岛，拥有较大的空间以及资源，岛上甚至还有两只羊！是萌新开始空岛生存的不二之选！\n作者@lonely"
    },
    "mystructure:island1" : {
        "name" : "多种群落小岛",
        "pos": [8,15,7],
        "description": "多种群落杂糅在一起的一个小岛，空间较为紧凑，同样没有奖励箱，但也是很美观的一个小岛\n作者@lonely"
    },
    "mystructure:bamboo" : {
        "name" : "竹游",
        "pos": [4,9,6],
        "description": "竹园小岛，遍布竹子，有一个小亭子，溪流，场景十分安详！\n作者@mitulong"
    },
    "mystructure:catcoffee" : {
        "name" : "猫猫咖啡厅",
        "pos": [8,10,3],
        "description": "一个猫猫样式的屋子！猛男生存必备...作者这样说道...\n作者@Samcrybut"
    },
    "mystructure:ore" : {
        "name" : "矿工最爱",
        "pos": [5,8,6],
        "description": "一个“破败的”小岛，布满蜘蛛网，但是有奖励箱子，甚至还有一个村民蛋？\n作者@AiLaZuiKeAi"
    },
    "mystructure:island2" : {
        "name" : "“破败”小岛",
        "pos": [7,10,7],
        "description": "一个“破败的”小岛，布满蜘蛛网，但是有奖励箱子，甚至还有一个村民蛋？\n作者@JunFish2722"
    },
    "mystructure:hell1" : {
        "name": "地狱小岛",
        "pos" : [7,10,6],
        "description": "下界风格的小空岛，资源比较匮乏，生存难度较高，适合以下界为主建筑风格的玩家\n作者@lonely"
    },
    "mystructure:poorisland" : {
        "name" : "石头岛",
        "pos": [8,8,7],
        "description": "一个主体由石头构成的岛，资源比较贫瘠，可能在上面生存比较困难吧。\n作者@JunFish2722"
    },
    "mystructure:bottle" : {
        "name" : "瓶子岛",
        "pos": [5,4,5],
        "description": "一个小小的玻璃瓶里承载了小岛的全部物质~\n作者@NIANIANKNIA"
    }
}




/**
 * 检查有没有要创建空岛的玩家
 */
function CheckCringPlayer() {
    let players = world.getPlayers()
    let playerList = Array.from(players);
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].hasTag("CringIsland") && GetScore("c_time",playerList[i].nameTag) == 10) {
            //计算相关坐标，传送
            let Tags = playerList[i].getTags()
            let StructureName = ""
            let k = 1
            for (let j = 0; j < Tags.length; j++) {
                if (Tags[j].slice(0,6) == "ISLAND") {
                    for (let structure in IslandData) {
                        if (k == parseInt(Tags[j].slice(6))) {
                            StructureName = structure
                            break
                        }
                        k++
                    }
                }
            }
            CalculatePos(playerList[i].nameTag,CX,CY,CZ,IslandData[StructureName].pos[0],IslandData[StructureName].pos[1],IslandData[StructureName].pos[2])
        }
        if (playerList[i].hasTag("CringIsland") && GetScore("c_time",playerList[i].nameTag) == 190) {
            //计算相关坐标，传送
            let Tags = playerList[i].getTags()
            let StructureName = ""
            let k = 1
            for (let j = 0; j < Tags.length; j++) {
                if (Tags[j].slice(0,6) == "ISLAND") {
                    for (let structure in IslandData) {
                        if (k == parseInt(Tags[j].slice(6))) {
                            StructureName = structure
                            break
                        }
                        k++
                    }
                }
            }
            let POSDATA = CalculatePos(playerList[i].nameTag,CX,CY,CZ)
            SpawnIsland(playerList[i].nameTag,POSDATA[0],CY,POSDATA[1],StructureName,IslandData[StructureName].pos[0],IslandData[StructureName].pos[1],IslandData[StructureName].pos[2])
        }
    }
}

function CalculatePos(playerName,cX,cY,cZ,dX,dY,dZ) {
    let Participants = world.scoreboard.getObjective("IslandData").getParticipants()
    for (let i = 0; i < Participants.length; i++) {
        if (Participants[i].displayName == "num") {
            let num = world.scoreboard.getObjective("IslandData").getScore(Participants[i]);
            let AllNum = 0;
            let r = 0;
            do {
                r = r + R;
                AllNum = parseInt(2 * Math.PI * r / R) + AllNum;
                // 调试语句
                // if (num <= AllNum){
                //     Broadcast(`§7AllNum：${AllNum} 此时的半径：${r}`);
                // }
            } while (num > AllNum);
            let pos = parseInt(2 * Math.PI * r / R) - AllNum + num
            let posX = parseInt(Math.cos(pos * 2 * Math.PI / (parseInt(2 * Math.PI * r / R))) * r) + cX;
            let posZ = -parseInt(Math.sin(pos * 2 * Math.PI / (parseInt(2 * Math.PI * r / R))) * r) + cZ;
            // 调试语句
            // Broadcast(`§7num的值为：${num} pos的值为：${pos} posX的值为：${posX} posZ的值为：${posZ}`);
            // 开始检查相关区域是否全部为空气
            RunCmd(`tp @a[name=${playerName}] ${posX + dX} ${cY + dY + 20} ${posZ + dZ}`);
            return [posX, posZ]
        }
    }
}

/**
 * 根据空岛编号计算相关空岛坐标并生成空岛
 */
function SpawnIsland(playerName,posX,cY,posZ,structureName,dX,dY,dZ) {
    // Broadcast(`§7YYYYYYYYYYYY`);
    let minX = posX
    let minY = cY
    let minZ = posZ
    let maxX = posX + 20
    let maxY = cY + 20
    let maxZ = posZ + 20
    let AllAir = true
    try {
        let block = world.getDimension("overworld").getBlock(new BlockLocation(minX, minY, minZ))
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    block = world.getDimension("overworld").getBlock(new BlockLocation(x, y, z))
                    if (block.typeId != "minecraft:air") {
                        AllAir = false
                        break;
                    }
                }
                if (!AllAir) {break}
            }
            if (!AllAir) {break}
        }
        if (AllAir) {
            Tell(`§a>> 位置检查完毕！可以正常生成空岛，已经自动生成空岛`,playerName)
            RunCmd(`structure load ${structureName} ${posX} ${cY} ${posZ}`);
            RunCmd(`tp @a[name=${playerName}] ${posX + dX} ${cY + dY} ${posZ + dZ}`);
            RunCmd(`scoreboard players set @a[name=${playerName}] posX ${posX + dX}`)
            RunCmd(`scoreboard players set @a[name=${playerName}] posY ${cY + dY}`)
            RunCmd(`scoreboard players set @a[name=${playerName}] posZ ${posZ + dZ}`)
            RunCmd(`spawnpoint @a[name=${playerName}] ${posX + dX} ${cY + dY} ${posZ + dZ}`)
            RunCmd(`tag ${playerName} add HaveIsland`)
            RunCmd(`title ${playerName} title §a空岛生成成功！`);
            RunCmd(`title ${playerName} subtitle §7重生点、主岛坐标已自动更新！`);
            RunCmd("scoreboard players add num IslandData 1");
        } else {
            Tell(`§c>> 位置检查完毕！目标位置有方块阻挡，正在尝试重新生成...`,playerName)
            RunCmd("scoreboard players add num IslandData 1");
            RunCmd(`scoreboard players set @a[name=${playerName}] c_time 1`);
        }
    } catch (e) {
        if (e) {
            Tell(`§c>> 本次空岛生成失败，请手动尝试重新生成！如果多次生成失败请联系服主！`,playerName)
            RunCmd(`tp "${playerName}" 702 82 554`);
        }
    }
}

// world.events.worldInitialize.subscribe((event) => {
//     //定义动态属性数据
//     let def = new DynamicPropertiesDefinition();
//     def.defineString("CDKData", 5000);
//     def.defineNumber("tps");
//     event.propertyRegistry.registerWorldDynamicProperties(def);
//     // let test = new DynamicPropertiesDefinition().defineString("TESTData", 9991);
//     // event.propertyRegistry.registerWorldDynamicProperties(test);
// });

// world.events.worldInitialize.subscribe((event) => {
//     //定义动态属性数据
//     let test = new DynamicPropertiesDefinition().defineString("TESTData", 9991);
//     event.propertyRegistry.registerWorldDynamicProperties(test);
// });






//统一GUI的API
const guiAPI = {

    Main(player) {
         //定义服务器主菜单
        const MainForm = new ActionFormData()
        .body(`§l===========================\n§eHi! §l§6${player.nameTag} §r§e欢迎回来！\n§e您目前能源币余额： §6§l${GetScore("money",player.nameTag)}\n§r§e您目前剩余氧气值为： §6§l${GetScore("oxygen",player.nameTag)}\n§r§e您目前剩余体力值为： §6§l${GetScore("stamina",player.nameTag)}\n§r§e您目前在线总时长为： §6§l${GetScore("time",player.nameTag)}\n§r§e当前物价指数为： §6§l${GetScore("DATA","RN")/100}\n§r§l===========================\n§r§c§l游玩中有问题找腐竹反馈！\n祝您游玩愉快！\n§r§l===========================`)
        .title("服务器菜单")
        .button("立即回城","textures/blocks/chest_front")
        .button("返回主岛","textures/ui/backup_replace")
        .button("个人传送点","textures/ui/icon_new")
        .button("调节生存模式","textures/ui/controller_glyph_color")
        .button("标题栏设置","textures/ui/automation_glyph_color")
        .button("商店系统","textures/ui/icon_blackfriday")
        .button("玩家传送系统","textures/ui/dressing_room_skins")
        .button("兑换码系统","textures/ui/gift_square")
        .button("飞行系统","textures/ui/levitation_effect")
        .button("转账系统","textures/ui/icon_best3")
        if (player.hasTag("op")) {
            MainForm.button("管理员面板","textures/ui/op")
        }
        MainForm.show(player).then((response) => {
            switch (response.selection) {
                case 0:
                    Tell(`§e>> 您已被传送至服务器主城！`,player.nameTag);
                    RunCmd(`tp @a[name=${player.nameTag}] 702 82 554`)
                    break;
                case 1:
                    if (GetScore("posX",player.nameTag) == 0 && GetScore("posY",player.nameTag) == 0 && GetScore("posZ",player.nameTag) == 0) {
                        Tell(`§c>> 未找到相应的主岛数据！请在领取空岛后使用本功能！`,player.nameTag)
                    } else {
                        RunCmd(`tp @a[name=${player.nameTag}] ${GetScore("posX",player.nameTag)} ${GetScore("posY",player.nameTag)} ${GetScore("posZ",player.nameTag)}`)
                        Tell(`§a>> 已经将您传送至主岛！`,player.nameTag)
                    }
                    break;
                case 2:
                    RunCmd(`openhomegui ${player.nameTag}`)
                    break;
                case 3:
                    RunCmd(`gamemode s ${player.nameTag}`)
                    break;
                case 4:
                    this.ActionBar(player);
                    break;
                case 5:
                    ShopGUI.ShopMain(player);
                    break;
                case 6:
                    this.TpaMain(player);
                    break;
                case 7:
                    this.CDK(player);
                    break;
                case 8:
                    this.Fly(player);
                    break;
                case 9:
                    this.Transfer(player);
                    break;
                case 10:
                    this.CheckOP(player);
                    break;
            }
        });
    },

    ActionBar(player) {
        const ActionBarForm = new ModalFormData()
        ActionBarForm.title("§c§l设置标题栏")
        if (player.hasTag("ShowActionbar")) {
            ActionBarForm.toggle("标题栏显示",true);
        } else {
            ActionBarForm.toggle("标题栏显示",false);
        }
        if (player.hasTag("ShowOxygenName")) {
            ActionBarForm.toggle("“氧气值”提示字样",true);
        } else {
            ActionBarForm.toggle("“氧气值”提示字样",false);
        }
        if (player.hasTag("ShowOxygen1")) {
            ActionBarForm.dropdown("氧气值显示方式",["不显示","样式1（进度条-百分比在内）","样式2（进度条-百分比在外）","样式3（数字显示）","样式4（纯百分比显示）"],1)
        } else if (player.hasTag("ShowOxygen2")) {
            ActionBarForm.dropdown("氧气值显示方式",["不显示","样式1（进度条-百分比在内）","样式2（进度条-百分比在外）","样式3（数字显示）","样式4（纯百分比显示）"],2)
        } else if (player.hasTag("ShowOxygen3")) {
            ActionBarForm.dropdown("氧气值显示方式",["不显示","样式1（进度条-百分比在内）","样式2（进度条-百分比在外）","样式3（数字显示）","样式4（纯百分比显示）"],3)
        } else if (player.hasTag("ShowOxygen4")) {
            ActionBarForm.dropdown("氧气值显示方式",["不显示","样式1（进度条-百分比在内）","样式2（进度条-百分比在外）","样式3（数字显示）","样式4（纯百分比显示）"],4)
        } else {
            ActionBarForm.dropdown("氧气值显示方式",["不显示","样式1（进度条-百分比在内）","样式2（进度条-百分比在外）","样式3（数字显示）","样式4（纯百分比显示）"],0)
        }
        if (player.hasTag("ShowMoney")) {
            ActionBarForm.dropdown("货币余额显示方式",["不显示","显示"],1)
        } else {
            ActionBarForm.dropdown("货币余额显示方式",["不显示","显示"],0)
        }
        if (player.hasTag("ShowTime")) {
            ActionBarForm.dropdown("在线时间显示方式",["不显示","显示"],1)
        } else {
            ActionBarForm.dropdown("在线时间显示方式",["不显示","显示"],0)
        }
        if (player.hasTag("ShowRN")) {
            ActionBarForm.dropdown("物价指数显示方式",["不显示","显示"],1)
        } else {
            ActionBarForm.dropdown("物价指数显示方式",["不显示","显示"],0)
        }
        if (player.hasTag("ShowStamina")) {
            ActionBarForm.dropdown("体力值显示方式",["不显示","显示"],1)
        } else {
            ActionBarForm.dropdown("体力值显示方式",["不显示","显示"],0)
        }
        //
        ActionBarForm.show(player).then((result) => {
            if (!result.canceled) {
                let Tags = ["ShowActionbar","ShowOxygenName","ShowOxygen1","ShowOxygen2","ShowOxygen3","ShowOxygen4","ShowMoney","ShowTime","ShowRN","ShowStamina"]
                for (let i = 0; i < Tags.length; i++) {
                    RunCmd(`tag "${player.nameTag}" remove ${Tags[i]}`)
                }
                if (result.formValues[0] == 1) {
                    RunCmd(`tag "${player.nameTag}" add ShowActionbar`)
                }
                if (result.formValues[1] == 1) {
                    RunCmd(`tag "${player.nameTag}" add ShowOxygenName`)
                }
                if (result.formValues[2] >=1 && result.formValues[2] <=4) {
                    RunCmd(`tag "${player.nameTag}" add ShowOxygen${result.formValues[2]}`)
                }
                if (result.formValues[3] == 1) {
                    RunCmd(`tag "${player.nameTag}" add ShowMoney`)
                }
                if (result.formValues[4] == 1) {
                    RunCmd(`tag "${player.nameTag}" add ShowTime`)
                }
                if (result.formValues[5] == 1) {
                    RunCmd(`tag "${player.nameTag}" add ShowRN`)
                }
                if (result.formValues[6] == 1) {
                    RunCmd(`tag "${player.nameTag}" add ShowStamina`)
                }
                Tell("§e>> 标题栏设置更改成功！",player.nameTag)
            }
        })
    },

    TpaMain(player) {
        const TpaMainForm = new ActionFormData()
        .title("传送系统")
        .body("§r§l===========================" + "\n§c欢迎使用传送系统！" + "\n§r§l===========================")
        .button("开始传送")
        .button("传送设置")
        TpaMainForm.show(player).then(result => {
            if (result.selection == 0) {
                this.TpaSub(player)
            } else if (result.selection == 1) {
                this.TpaSetup(player)
            }
        })
    },

    TpaSub(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = []
        for (let i = 0; i < playerList.length; i++) {
            playersName.push(playerList[i].nameTag)
        }

        const TpaSubForm = new ModalFormData()
            .title("传送系统")
            .dropdown("请选择本次传送的模式：",["将自己传送至目标玩家","将目标玩家传送至自己这里"],0)
            .dropdown("请选择要传送的玩家：",playersName,0)
            TpaSubForm.show(player).then(result => {
                if (result.canceled) {
                    this.TpaMain(player)
                }
                if (result.formValues[0] == 0) {
                    this.ApplyTpa1(playerList[result.formValues[1]],player)
                } else if (result.formValues[0] == 1) {
                    this.ApplyTpa2(playerList[result.formValues[1]],player)
                }
            })
    },

    ApplyTpa1(AcceptPlayer,ApplyPlayer) {
        //检查对方是否在黑名单中
        let BanList = [];
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "T:" + AcceptPlayer.nameTag.slice(0,10)) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    BanList.push(ScoreBoards[i].getParticipants()[j].displayName.slice(1))
                    break;
                }
                break;
            }
        }
        if (AcceptPlayer.hasTag("BanTpa") || BanList.includes(ApplyPlayer.nameTag)) {
            const ErrorTpaForm = new MessageFormData()
                .title("§c§l传送申请异常提醒")
                .body("§e玩家 §l§6" + AcceptPlayer.nameTag + " \n§r§e无法正常接收传送申请！\n可能是因为对方关闭了传送系统！")
                .button1("§c退出传送系统")
                .button2("§a返回传送系统")
            ErrorTpaForm.show(ApplyPlayer).then(result => {
                if (result.selection == 0) {
                    this.TpaMain(ApplyPlayer)
                }
            })
        } else {
            const ApplyTpa1Form = new MessageFormData()
                .title("§c§l传送申请")
                .body("§e玩家 §l§6" + ApplyPlayer.nameTag + " \n§r§e申请传送到您这里！请问您是否同意呢？")
                .button1("§c不同意")
                .button2("§a同意")
            ApplyTpa1Form.show(AcceptPlayer).then(result => {
                if (result.selection == 1) {
                    Tell(`§c>> 对方拒绝了您的传送申请！请尝试稍后重试！（请勿短时间内多次发起申请，否则可能被对方加入黑名单！）`,ApplyPlayer.nameTag)
                } else if (result.selection == 0) {
                    Tell(`§a>> 对方同意了您的申请，已把您传送过去！`,ApplyPlayer.nameTag)
                    Tell(`§a>> 您已同意对方的传送申请！`,AcceptPlayer.nameTag)
                    RunCmd(`tp "${ApplyPlayer.nameTag}" "${AcceptPlayer.nameTag}"`)
                }
            })
        }
    },

    ApplyTpa2(AcceptPlayer,ApplyPlayer) {
        //检查对方是否在黑名单中
        let BanList = [];
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "T:" + AcceptPlayer.nameTag.slice(0,10)) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    BanList.push(ScoreBoards[i].getParticipants()[j].displayName.slice(1))
                    break;
                }
                break;
            }
        }
        if (AcceptPlayer.hasTag("BanTpa") || BanList.includes(ApplyPlayer.nameTag)) {
            const ErrorTpaForm = new MessageFormData()
                .title("§c§l传送申请异常提醒")
                .body("§e玩家 §l§6" + AcceptPlayer.nameTag + " \n§r§e无法正常接收传送申请！\n可能是因为对方关闭了传送系统！")
                .button1("§c退出传送系统")
                .button2("§a返回传送系统")
            ErrorTpaForm.show(ApplyPlayer).then(result => {
                if (result.selection == 0) {
                    this.TpaMain(ApplyPlayer)
                }
            })
        } else {
            const ApplyTpa2Form = new MessageFormData()
                .title("§c§l传送申请")
                .body("§e玩家 §l§6" + ApplyPlayer.nameTag + " \n§r§e申请将您传送到他那里！请问您是否同意呢？")
                .button1("§c不同意")
                .button2("§a同意")
            ApplyTpa2Form.show(AcceptPlayer).then(result => {
                if (result.selection == 1) {
                    Tell(`§c>> 对方拒绝了您的传送申请！请尝试稍后重试！（请勿短时间内多次发起申请，否则可能被对方加入黑名单！）`,ApplyPlayer.nameTag)
                } else if (result.selection == 0) {
                    Tell(`§a>> 对方同意了您的申请，已把对方传送过来！`,ApplyPlayer.nameTag)
                    Tell(`§a>> 您已同意对方的传送申请，已把您传送至对方的地方`,AcceptPlayer.nameTag)
                    RunCmd(`tp "${AcceptPlayer.nameTag}" "${ApplyPlayer.nameTag}"`)
                }
            })
        }
    },

    TpaSetup(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = ["请选择在线玩家后提交"]
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].nameTag != player.nameTag) {
                playersName.push(playerList[i].nameTag)
            }
        }

        let HaveData = false;
        let BanList = ["选择下拉列表玩家后提交"];
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "T:" + player.nameTag.slice(0,10)) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    BanList.push(ScoreBoards[i].getParticipants()[j].displayName.slice(1))
                    HaveData = true;
                    break;
                }
                break;
            }
        }
        if (!HaveData) {
            if (world.scoreboard.getObjective(`T:${player.nameTag.slice(0,10)}`) == null) {
                world.scoreboard.addObjective(`T:${player.nameTag.slice(0,10)}`,`T:${player.nameTag.slice(0,10)}`);
            }
        }
        const TpaSetupForm = new ModalFormData()
            .title("传送系统设置")
            if (player.hasTag("BanTpa")) {
                TpaSetupForm.toggle("禁止别人向你发送传送申请",true)
            } else {
                TpaSetupForm.toggle("禁止别人向你发送传送申请",false)
            }
            TpaSetupForm.dropdown("添加传送黑名单",playersName,0)
            TpaSetupForm.dropdown("删除传送黑名单",BanList,0)
            TpaSetupForm.show(player).then(result => {
                RunCmd(`tag "${player.nameTag}" remove BanTpa`);
                if (result.formValues[0] == 1) {
                    RunCmd(`tag "${player.nameTag}" add BanTpa`);
                }
                if (result.formValues[1] != 0) {
                    Tell(`§c>> 已把玩家 ${playersName[result.formValues[1]]} 成功加入传送黑名单！`,player.nameTag)
                    RunCmd(`scoreboard players set "@${playersName[result.formValues[1]]}" T:${player.nameTag.slice(0,10)} 0`)
                }
                if (result.formValues[2] != 0) {
                    Tell(`§a>> 已把玩家 ${playersName[result.formValues[2]]} 成功从传送黑名单移除！`,player.nameTag)
                    RunCmd(`scoreboard players reset "@${playersName[result.formValues[2]]}" T:${player.nameTag.slice(0,10)}`);
                }
            })
    },

    /////////////////////////////////////////////
    //CDK格式：
    //S!CDK@money#500
    //I!CDK@apple#1$0
    ////////////////////////////////////////////
    CDK(player) {
        const CDKForm = new ModalFormData()
        .title("兑换码系统")
        .dropdown("请选择CDK码类型",["计分板形式","物品形式"])
        .textField("请输入CDK码","CDK码输入时请注意大小写！")
        CDKForm.show(player).then(result => {
            let CDK = result.formValues[1]
            if (result.canceled) {
                this.Main(player)
            } else {
                let HaveCDK = false;
                let CDKD = false;
                if (CDK == "") {
                    Tell(`§c>> CDK码为空兑换失败`,player.nameTag)
                } else if (result.formValues[0] == 0) {
                    let ScoreBoards = world.scoreboard.getObjectives()
                    for (let k = 0; k < ScoreBoards.length; k++) {
                        if (ScoreBoards[k].id == "C:" + CDK) {
                            for (let l = 0; l < ScoreBoards[k].getParticipants().length; l++) {
                                if (ScoreBoards[k].getParticipants()[l].displayName == player.nameTag) {
                                    CDKD = true;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    for (let i = 0; i < ScoreBoards.length; i++) {
                        if (ScoreBoards[i].id == "CDK") {
                            for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                                if (!CDKD && ScoreBoards[i].getParticipants()[j].displayName.slice(0,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == "S!" + CDK) {
                                    RunCmd(`scoreboard players add @a[name="${player.nameTag}"] ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1)}`)
                                    RunCmd(`scoreboard players add "${ScoreBoards[i].getParticipants()[j].displayName}" CDK -1`)
                                    RunCmd(`scoreboard players set "${player.nameTag}" "C:${CDK}" 0`)
                                    Tell("§a>> 兑换成功！",player.nameTag)
                                    HaveCDK = true
                                    if (GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName) == 1) {
                                        RunCmd(`scoreboard players reset "${ScoreBoards[i].getParticipants()[j].displayName}" CDK`)
                                        RunCmd(`scoreboard objectives remove "C:${CDK}"`)
                                    }
                                    break;
                                } else if (CDKD) {
                                    Tell("§c>> 您已兑换过此CDK!",player.nameTag)
                                    break;
                                }
                            }
                            break;
                        }
                    }
                } else if (result.formValues[0] == 1) {
                    let ScoreBoards = world.scoreboard.getObjectives()
                    for (let k = 0; k < ScoreBoards.length; k++) {
                        if (ScoreBoards[k].id == "C:" + CDK) {
                            for (let l = 0; l < ScoreBoards[k].getParticipants().length; l++) {
                                if (ScoreBoards[k].getParticipants()[l].displayName == player.nameTag) {
                                    CDKD = true;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    for (let i = 0; i < ScoreBoards.length; i++) {
                        if (ScoreBoards[i].id == "CDK") {
                            for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                                if (!CDKD && ScoreBoards[i].getParticipants()[j].displayName.slice(0,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == "I!" + CDK) {
                                    RunCmd(`give @a[name="${player.nameTag}"] ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("$"))} ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("$") + 1)}`)
                                    RunCmd(`scoreboard players add "${ScoreBoards[i].getParticipants()[j].displayName}" CDK -1`)
                                    RunCmd(`scoreboard players set "${player.nameTag}" "C:${CDK}" 0`)
                                    Tell("§a>> 兑换成功！",player.nameTag)
                                    HaveCDK = true
                                    if (GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName) == 1) {
                                        RunCmd(`scoreboard players reset "${ScoreBoards[i].getParticipants()[j].displayName}" CDK`)
                                        RunCmd(`scoreboard objectives remove "C:${CDK}"`)
                                    }
                                    break;
                                } else if (CDKD) {
                                    Tell("§c>> 您已兑换过此CDK!",player.nameTag)
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                if (!HaveCDK && !CDKD) {
                    Tell(`§c>> 无效的CDK兑换码，可能是输错、兑换码类型选择错误、兑换数量达到上限！您可以重新检查后再次尝试！具体情况请联系腐竹！`,player.nameTag)
                }
            }
        })
    },
    /////////////////////////////////////////////
    //FLY{"NIA":{x:0,y:0,z:0}}
    Fly(player) {
        if (player.hasTag("CanFly")) {
            const FlyForm = new ActionFormData()
            .title("飞行系统")
            .body("§r§l===========================" + "§r\n§e欢迎使用飞行系统!\n您已经是授权玩家，请自行遵守飞行系统准则！否则会被永远取消飞行系统使用资格！\n飞行系统在使用期间氧气消耗为原有消耗速度的15倍，请注意氧气消耗" + "\n§r§l===========================")
            .button("开启飞行模式")
            .button("关闭飞行模式")
            .button("返回上一级菜单")
            FlyForm.show(player).then(result => {
                switch (result.selection) {
                    case 0:
                        player.addTag("fly")
                        RunCmd(`ability "${player.nameTag}" mayfly true`)
                        RunCmd(`title "${player.nameTag}" title §a飞行模式 开启`)
                        RunCmd(`title "${player.nameTag}" subtitle §7注意氧气值消耗哦！ 退出服务器记得关闭哦`)
                        break
                    case 1:
                        player.removeTag("fly")
                        RunCmd(`title "${player.nameTag}" title §c飞行模式 关闭`)
                        RunCmd(`title "${player.nameTag}" subtitle §7今天有好好遵守使用规则嘛？`)
                        player.kill()
                        RunCmd(`ability @a[name="${player.nameTag}",m=!c] mayfly false`)
                        break
                    case 2:
                        this.Main(player)
                        break
                }
            })
        } else {
            RunCmd(`scoreboard players add @a UUID 0`)
            if (GetScore("equLevel",player.nameTag) >= 13 && GetScore("UUID",player.nameTag) == 0) {
                const FlyForm = new ActionFormData()
                .title("申请使用飞行系统")
                .body("§r§l===========================" + "§r\n§e欢迎使用飞行系统!\n您暂时不是授权玩家，无法使用飞行系统\n您可以尝试使用5000能源币购买使用资格后申请使用飞行系统\n§c§l但值得注意的是，在您购买使用资格后我们运营团队会对申请玩家进行申请人工复核，如果您原来在服务器有不利的记录，您仍有概率无法获得飞行系统使用资格，即使审核不通过，服务器也不会退掉您购买的使用资格费用，介意者请不要购买！\n§r§e请在购买后将UUID发给服主获取对应的激活码！" + "\n§r§l===========================")
                .button("购买使用资格")
                .button("返回上一层")
                .show(player).then(result => {
                    if (result.selection == 0) {
                        if (GetScore("money",player.nameTag) >= 5000) {
                            RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -5000`)
                            RunCmd(`scoreboard players add @a UUID 0`)
                            let Participants = world.scoreboard.getObjective("UUID").getParticipants();
                            let UUID = 0
                            for (let i = 0; i < Participants.length; i++) {
                                if (Participants[i].displayName == player.nameTag) {
                                    UUID = world.scoreboard.getObjective("UUID").getScore(Participants[i]);
                                    if (UUID == 0) {
                                        UUID = 100000 + Math.floor(Math.random() * 100000);
                                        RunCmd(`scoreboard players set @a[name=${player.nameTag}] UUID ${UUID}`);
                                        Tell(`§c>> 您第一次获取UUID，已经为您获取的UUID为：§a${UUID}§c，请发给腐竹获取飞行系统激活码！`,player.nameTag);
                                    } else {
                                        Tell(`§c>> 您的UUID为：§a${UUID}§c，请发给腐竹获取飞行系统验证码！`,player.nameTag);
                                    }
                                    break;
                                }
                            }
                        } else {
                            Tell(`§c>> 余额不足，请尝试攒够5000能源币后再次尝试购买！`)
                        }
                    } else if (result.selection == 1) {
                        this.Main(player)
                    }
                })
            } else if (GetScore("equLevel",player.nameTag) >= 13 && GetScore("UUID",player.nameTag) != 0) {
                let UUID = GetScore("UUID",player.nameTag)
                const FlyForm = new ModalFormData()
                .title("§c§l您的UUID为 " + UUID)
                .textField("请输入飞行系统激活码","请不要尝试破解（")
                .show(player).then(result => {
                    let password = result.formValues[0];
                    if (!isNaN(parseInt(Number(result.formValues[0])))) {
                        if (password == parseInt(((UUID * 12345) + 65432) / 9876 + 100000)) {
                            Tell(`§a>> 验证码正确！您已获得相关权限！`,player.nameTag);
                            RunCmd(`tag "${player.nameTag}" add CanFly`)
                        } else {
                            Tell(`§c>> 您输入的激活码不正确，请再次重试！如果您还未获得激活码，请将您的UUID§a${UUID}§c发给腐竹获取飞行系统激活码！`,player.nameTag);
                            this.Fly(player)
                        }
                    } else {
                        Tell(`§c>> 您输入的激活码不正确，请再次重试！如果您还未获得激活码，请将您的UUID§a${UUID}§c发给腐竹获取飞行系统激活码！`,player.nameTag);
                        this.Fly(player)
                    }
                })
            } else {
                const FlyForm = new ActionFormData()
                .title("申请使用飞行系统")
                .body("§r§l===========================" + "§r\n§c欢迎使用飞行系统!\n您暂时不是授权玩家，无法使用飞行系统\n飞行系统仅支持X级呼吸装备Ⅴ以上的玩家使用,您暂时无法申请使用飞行系统！\n请在尝试升级到足够等级的呼吸装备后尝试申请！" + "\n§r§l===========================")
                .button("返回上一层界面")
                .show(player).then(result => {
                    if (result.selection == 0) {
                        this.Main(player)
                    }
                })
            }
            // RunCmd(`scoreboard players add @a UUID 0`)
            // let Participants = world.scoreboard.getObjective("UUID").getParticipants();
            // let UUID = 0
            // for (let i = 0; i < Participants.length; i++) {
            //     if (Participants[i].displayName == t.sender.nameTag) {
            //         UUID = world.scoreboard.getObjective("UUID").getScore(Participants[i]);
            //         if (UUID == 0) {
            //             UUID = 100000 + Math.floor(Math.random() * 100000);
            //             RunCmd(`scoreboard players set @a[name=${t.sender.nameTag}] UUID ${UUID}`);
            //             Tell(`§c>> 您第一次获取UUID，已经为您获取的UUID为：§a${UUID}§c，请发给腐竹获取飞行验证码！`,t.sender.nameTag);
            //         } else {
            //             Tell(`§c>> 您的UUID为：§a${UUID}§c，请发给腐竹获取飞行验证码！`,t.sender.nameTag);
            //         }
            //         break;
            //     }
            // }
        }
    },

    /////////////////////////////////////////////

    Transfer(player) {
        const TransferForm = new ActionFormData()
        .title("转账系统")
        .body("§r§l===========================" + "\n§r§e欢迎使用转账系统！\n§c所有转账请在提前告知对方的前提下转账\n否则如果因为对方下线造成转账失败后果自负\n所有转账均不可逆，请慎重考虑后使用" + "\n§r§l===========================" + "\n§r§e能源币转账单笔10000以下不收取费用\n单笔转账超出10000货币的收取百分之0.5的服务费\n能源币单笔转账最大数量为100000能源币\n氧气值转账每次将随机失去百分之5-50的氧气值\n请谨慎考虑！" + "\n§r§l===========================")
        .button("能源币转账")
        .button("氧气值转账")
        .button("返回上一级页面")
        TransferForm.show(player).then(result => {
            if (result.selection == 0) {
                this.TFmoney(player)
            } else if (result.selection == 1) {
                this.TFoxygen(player)
            } else if (result.selection == 2) {
                this.Main(player)
            }
        })
    },

    TFmoney(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = ["请选择在线玩家后提交"]
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].nameTag != player.nameTag) {
                playersName.push(playerList[i].nameTag)
            }
            // playersName.push(playerList[i].nameTag)
        }
        const TFmoney = new ModalFormData()
            .title("能源币转账系统")
            .dropdown("请选择转账目标玩家",playersName)
            .textField("请输入转账数目","只能输入正整数！")
            // if (GetScore("money",player.nameTag) >= 100000) {
            //     TFmoney.slider("请选择转账数目",1,100000,10)
            // } else {
            //     TFmoney.slider("请选择转账数目",1,GetScore("money",player.nameTag),1,1)
            // }
        TFmoney.show(player).then(result => {
            if (result.canceled) {
                this.Transfer(player)
            }
            if (result.formValues[0] == 0) {
                Tell(`§c>> 请选择有效的玩家对象！`,player.nameTag)
            } else {
                //开始判断数据
                if (parseInt(result.formValues[1]) <= 0 || isNaN(parseInt(Number(result.formValues[1])))) {
                    Tell(`§c>> 错误的转账数字格式，请重新输入！`,player.nameTag)
                } else if (parseInt(result.formValues[1]) >= GetScore("money",player.nameTag)) {
                    Tell(`§c>> 您输入的转账数额过大，您的余额不足，请重新输入！`,player.nameTag)
                } else {
                    RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -${parseInt(result.formValues[1])}`)
                    if (result.formValues[1] <= 10000) {
                        RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] money ${parseInt(result.formValues[1])}`)
                        Tell(`§a>> 转账成功！您已经成功向玩家 §6${playersName[result.formValues[0]]} §a转账§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作免手续费）`,player.nameTag)
                        Tell(`§a>> 您有一笔转账到账！您已收到玩家§6 ${player.nameTag} §a向您转账的§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作免手续费）`,playersName[result.formValues[0]])
                    } else {
                        RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] money ${parseInt(result.formValues[1] * 0.995)}`)
                        Tell(`§a>> 转账成功！您已经成功向玩家§6 ${playersName[result.formValues[0]]} §a转账§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作收取§6 ${parseInt(result.formValues[1] * 0.005)} §a手续费）`,player.nameTag)
                        Tell(`§a>> 您有一笔转账到账！您已收到玩家§6 ${player.nameTag} §a向您转账的§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作收取§6 ${parseInt(result.formValues[1] * 0.005)} §a手续费，故您实际收到§6 ${parseInt(result.formValues[1] * 0.995)} §a能源币）`,playersName[result.formValues[0]])
                    }
                }
            }
        })

    },

    TFoxygen(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = ["请选择在线玩家后提交"]
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].nameTag != player.nameTag) {
                playersName.push(playerList[i].nameTag)
            }
        }
        const TFmoney = new ModalFormData()
            .title("氧气转移系统")
            .dropdown("请选择氧气转移目标玩家",playersName)
            TFmoney.slider("请选择转账数目",1,GetScore("oxygen",player.nameTag),1,1)
        TFmoney.show(player).then(result => {
            if (result.canceled) {
                this.Transfer(player)
            }
            if (result.formValues[0] == 0) {
                Tell(`§c>> 请选择有效的玩家对象！`,player.nameTag)
            } else {
                RunCmd(`scoreboard players add @a[name="${player.nameTag}"] oxygen -${parseInt(result.formValues[1])}`)
                let ReciveOxygen = Math.round(result.formValues[1] * ((Math.random() * 45 + 50) / 100))
                RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] oxygen ${ReciveOxygen}`)
                Tell(`§a>> 氧气转移成功！您已经成功向玩家§6 ${playersName[result.formValues[0]]} §a转移§6 ${parseInt(result.formValues[1])} §a氧气值！（本次操作损失§6 ${parseInt(result.formValues[1]) - ReciveOxygen} §a氧气值）`,player.nameTag)
                Tell(`§a>> 氧气转移成功！您已收到玩家§6 ${player.nameTag} §a向您转移的§6 ${parseInt(result.formValues[1])} §a氧气值！（本次操作损失§6 ${parseInt(result.formValues[1]) - ReciveOxygen} §a氧气值，故您实际收到§6 ${ReciveOxygen} §a氧气值）`,playersName[result.formValues[0]])
            }
        })

    },

    /////////////////////////////////////////////

    CheckOP(player) {
        const CheckOPForm = new ModalFormData()
        .title("管理员身份验证")
        .textField("请输入管理员面板授权码","不知道找腐竹索要！")
        CheckOPForm.show(player).then(result => {
            if (result.canceled) {
                this.Main(player)
            } else if (result.formValues[0] == "NIA") {
                this.OpMain(player)
            } else {
                Tell("§c>> 未经授权的访问！您的本次访问已被服务器记录！",player.nameTag)
            }
        })
    },

    OpMain(player) {
        const OpMainForm = new ActionFormData()
        .title("管理员操作系统")
        .body("§r§l===========================" + "\n§eHi！ " + player.nameTag + " 欢迎使用！" + "\n§r§l===========================")
        .button("封禁玩家")
        .button("解封玩家")
        .button("添加CDK码")
        .button("管理CDK码")
        .button("调节玩家游戏数值")
        .button("调节物价指数")
        .button("§c紧急预案Ⅰ")
        .show(player).then(result => {
            switch (result.selection) {
                case 0:
                    Tell("§c>> 开发中内容！",player.nameTag)
                    break;
                case 1:
                    Tell("§c>> 开发中内容！",player.nameTag)
                    break;
                case 2:
                    this.AddCDKMain(player)
                    break;
                case 3:
                    this.SetCDK(player)
                    break;
                case 4:
                    Tell("§c>> 开发中内容！",player.nameTag)
                    break;
                case 5:
                    Tell("§c>> 开发中内容！",player.nameTag)
                    break;
                case 6:
                    Tell("§c>> 开发中内容！",player.nameTag)
                    break;
            }
        })
    },

    AddCDKMain(player) {
        const AddCDKMainForm = new ActionFormData()
            .title("请选择CDK的形式")
            .body("请根据需求按照技术标准添加CDK\n请勿擅自添加CDK！\n请在仔细阅读技术规范后使用本系统！")
            .button("计分板形式")
            .button("物品形式")
            .button("返回上一层界面")
        AddCDKMainForm.show(player).then(result => {
            switch (result.selection) {
                case 0:
                    this.AddCDKSub1(player)
                    break;
                case 1:
                    this.AddCDKSub2(player)
                    break;
                case 2:
                    this.OpMain(player)
                    break;

            }
        })
    },

    AddCDKSub1(player) {
        let ScoreNames = ["money","oxygen",]
        const AddCDKSub1Form = new ModalFormData()
            .title("添加计分板形式CDK")
            .textField("请输入自定义CDK码","请勿重复、过长！")
            .dropdown("请选择要改变分数的计分板",["自定义计分板名称","能源币(money)","氧气值(oxygen)"])
            .textField("自定义计分板名称","请在上方选择自定义后填写")
            .textField("增加目标计分板的值","只能输入阿拉伯数字！")
            .textField("CDK可兑换的最大数量","只能输入阿拉伯数字！")
        AddCDKSub1Form.show(player).then(result => {
            //首先判断数据格式是否正确
            if (result.formValues[0] == "" || result.formValues[3] == "" || result.formValues[4] == "") {
                Tell("§c>> 错误的数据格式！请重新检查后再次填写！",player.nameTag)
            } else if (result.formValues[1] == 0 && result.formValues[2] == "") {
                Tell("§c>> 错误的数据格式！请重新检查后再次填写！",player.nameTag)
            } else {
                //判断CDK是否重复？
                let ScoreBoards = world.scoreboard.getObjectives()
                let HaveCDK = false;
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id == "CDK") {
                        for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                            if (ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == result.formValues[0]) {
                                HaveCDK = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                if (HaveCDK) {
                    Tell("§c>> 重复的CDK！请重新检查后再次填写！",player.nameTag)
                } else if (result.formValues[1] != 0) {
                    RunCmd(`scoreboard players set "S!${result.formValues[0]}@${ScoreNames[result.formValues[1] - 1]}#${parseInt(result.formValues[3])}" CDK ${parseInt(result.formValues[4])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    Tell("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：S!" + result.formValues[0] + "@" + ScoreNames[result.formValues[1] - 1] + "#" + parseInt(result.formValues[3]) + " NUM: " + parseInt(result.formValues[4]),player.nameTag)
                } else if (result.formValues[1] == 0) {
                    RunCmd(`scoreboard players set "S!${result.formValues[0]}@${result.formValues[2]}#${parseInt(result.formValues[3])}" CDK ${parseInt(result.formValues[4])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    Tell("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：S!" + result.formValues[0] + "@" + result.formValues[2] + "#" + parseInt(result.formValues[3]) + " NUM: " + parseInt(result.formValues[4]),player.nameTag)
                }
            }
        })
    },

    AddCDKSub2(player) {
        let ScoreNames = ["diamond","gold_ore",]
        const AddCDKSub2Form = new ModalFormData()
            .title("添加物品形式CDK")
            .textField("请输入自定义CDK码","请勿重复、过长！")
            .dropdown("请选择要赠与的物品ID",["自定义物品ID","钻石(diamond)","黄金锭(gold_ore)"])
            .textField("自定义物品ID","请在上方选择自定义后填写")
            .textField("给予数量","只能输入阿拉伯数字！","1")
            .textField("给予物品的特殊值","只能输入阿拉伯数字！","0")
            .textField("CDK可兑换的最大数量","只能输入阿拉伯数字！")
        AddCDKSub2Form.show(player).then(result => {
            //首先判断数据格式是否正确
            if (result.formValues[0] == "" || result.formValues[3] == "" || result.formValues[4] == "" || result.formValues[5] == "") {
                Tell("§c>> 错误的数据格式！请重新检查后再次填写！",player.nameTag)
            } else if (result.formValues[1] == 0 && result.formValues[2] == "") {
                Tell("§c>> 错误的数据格式！请重新检查后再次填写！",player.nameTag)
            } else {
                //判断CDK是否重复？
                let ScoreBoards = world.scoreboard.getObjectives()
                let HaveCDK = false;
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id == "CDK") {
                        for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                            if (ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == result.formValues[0]) {
                                HaveCDK = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                if (HaveCDK) {
                    Tell("§c>> 重复的CDK！请重新检查后再次填写！",player.nameTag)
                } else if (result.formValues[1] != 0) {
                    RunCmd(`scoreboard players set "I!${result.formValues[0]}@${ScoreNames[result.formValues[1] - 1]}#${parseInt(result.formValues[3])}$${parseInt(result.formValues[4])}" CDK ${parseInt(result.formValues[5])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    Tell("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：I!" + result.formValues[0] + "@" + ScoreNames[result.formValues[1] - 1] + "#" + parseInt(result.formValues[3]) + "$" + parseInt(result.formValues[4]) + " NUM: " + parseInt(result.formValues[5]),player.nameTag)
                } else if (result.formValues[1] == 0) {
                    RunCmd(`scoreboard players set "I!${result.formValues[0]}@${result.formValues[2]}#${parseInt(result.formValues[3])}$${parseInt(result.formValues[4])}" CDK ${parseInt(result.formValues[5])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    Tell("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：I!" + result.formValues[0] + "@" + result.formValues[2] + "#" + parseInt(result.formValues[3]) + "$" + parseInt(result.formValues[4]) + " NUM: " + parseInt(result.formValues[5]),player.nameTag)
                }
            }
        })
    },

    SetCDK(player) {
        const SetCDKForm = new ActionFormData()
            .title("设置CDK码")
            .body("§c服主提醒：\n请勿擅自更改CDK数据\n特别是已经发行的CDK\n防止同一CDK出现奖励不同的后果！")
            .button("§c返回上一层")
            let ScoreBoards = world.scoreboard.getObjectives()
            let i = 0
            for (i = 0; i < ScoreBoards.length; i++) {
                if (ScoreBoards[i].id == "CDK") {
                    for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                        if (ScoreBoards[i].getParticipants()[j].displayName.slice(0,1) == "S") {
                            SetCDKForm.button(`§c[计分板形式] CDK:§r§l${ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@"))}\n§r§c计分板：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} §c增加数值：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1)} §c余量：§r${GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName)}`)
                        } else if (ScoreBoards[i].getParticipants()[j].displayName.slice(0,1) == "I") {
                            SetCDKForm.button(`§c[物品形式] CDK:§r§l${ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@"))}\n§r§c物品：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} §c数量：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("$"))} §c特殊值：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("$") + 1)} §c余量：§r${GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName)}`)
                        }
                    }
                    break;
                }
            }
        SetCDKForm.show(player).then(result => {
            if (result.selection == 0) {
                this.OpMain(player)
            } else {
                this.SetCDKSub(player,ScoreBoards[i].getParticipants()[result.selection - 1].displayName)
            }
        })
    },

    SetCDKSub(player,CDKData) {
        let Str = "§c服主提醒：\n已创建的CDK不支持更改CDK码\n如果想要更改CDK码请删除该CDK后再次创建！\n§r§e已经兑换过本CDK的玩家ID：\n§6"
        const SetCDKSubForm = new ActionFormData()
        SetCDKSubForm.title("修改CDK-" + CDKData.slice(2,CDKData.indexOf("@")))
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "C:" + CDKData.slice(2,CDKData.indexOf("@"))) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    Str = Str + ScoreBoards[i].getParticipants()[j].displayName + "\n"
                }
                break;
            }
        }
        SetCDKSubForm.body(Str)
        SetCDKSubForm.button("返回上一级页面")
        SetCDKSubForm.button("编辑CDK信息")
        SetCDKSubForm.button("§c删除CDK")
        SetCDKSubForm.show(player).then(result => {
            if (result.selection == 0) {
                this.SetCDK(player);
            } else if (result.selection == 1) {
                this.ChangeCDK(player,CDKData)
            } else if (result.selection == 2) {
                this.RemoveCDK(player,CDKData)
            }
        })
    },

    ChangeCDK(player, CDKData) {
        const ChangeCDKForm = new ModalFormData()
        ChangeCDKForm.title("修改CDK-" + CDKData.slice(2,CDKData.indexOf("@")))
        if (CDKData.slice(0,1) == "S") {
            ChangeCDKForm.textField("计分板名称","请仔细检查后填写！",CDKData.slice(CDKData.indexOf("@") + 1,CDKData.indexOf("#")))
            ChangeCDKForm.textField("增加目标计分板的值","只能输入阿拉伯数字！",CDKData.slice(CDKData.indexOf("#") + 1))
            ChangeCDKForm.textField("CDK可兑换的最大数量","只能输入阿拉伯数字！",GetScore("CDK",CDKData).toString())
        } else if (CDKData.slice(0,1) == "I") {
            ChangeCDKForm.textField("物品名称（ID）","请仔细检查后填写！",CDKData.slice(CDKData.indexOf("@") + 1,CDKData.indexOf("#")))
            ChangeCDKForm.textField("物品数量","只能输入阿拉伯数字！",CDKData.slice(CDKData.indexOf("#") + 1,CDKData.indexOf("$")))
            ChangeCDKForm.textField("物品特殊值","只能输入阿拉伯数字！",CDKData.slice(CDKData.indexOf("$") + 1))
            ChangeCDKForm.textField("CDK可兑换的最大数量","只能输入阿拉伯数字！",GetScore("CDK",CDKData).toString())
        }
        ChangeCDKForm.show(player).then(result => {
            if (result.canceled) {
                this.SetCDKSub(player,CDKData)
            }
            if (CDKData.slice(0,1) == "S") {
                if (result.formValues[0] == "" || result.formValues[1] == "" || result.formValues[2] == "") {
                    Tell(`§C>> 错误的CDK数据格式！请重新检查后重新输入！`)
                } else {
                    RunCmd(`scoreboard players set "S!${CDKData.slice(2,CDKData.indexOf("@"))}@${result.formValues[0]}#${parseInt(result.formValues[1])}" CDK ${parseInt(result.formValues[2])}`)
                    Tell("§a>> CDK码 " + CDKData.slice(2,CDKData.indexOf("@")) + " 修改成功！校验值：S!" + CDKData.slice(2,CDKData.indexOf("@")) + "@" + result.formValues[0] + "#" + parseInt(result.formValues[1]) + " NUM: " + parseInt(result.formValues[2]),player.nameTag)
                }
            } else if (CDKData.slice(0,1) == "I") {
                if (result.formValues[0] == "" || result.formValues[1] == "" || result.formValues[2] == "" || result.formValues[3] == "") {
                    Tell(`§C>> 错误的CDK数据格式！请重新检查后重新输入！`)
                } else {
                    RunCmd(`scoreboard players set "I!${CDKData.slice(2,CDKData.indexOf("@"))}@${result.formValues[0]}#${parseInt(result.formValues[1])}$${parseInt(result.formValues[2])}" CDK ${parseInt(result.formValues[3])}`)
                    Tell("§a>> CDK码 " + CDKData.slice(2,CDKData.indexOf("@")) + " 修改成功！校验值：I!" + CDKData.slice(2,CDKData.indexOf("@")) + "@" + result.formValues[0] + "#" + parseInt(result.formValues[1]) + "$" + parseInt(result.formValues[2]) + " NUM: " + parseInt(result.formValues[3]),player.nameTag)
                }
            }
        })
    },

    RemoveCDK(player, CDKData) {
        const RemoveCDKForm = new MessageFormData()
        .title("§c§l删除CDK-" + CDKData.slice(2,CDKData.indexOf("@")))
        .body("§e是否§c删除§eCDK §l§6 " + CDKData.slice(2,CDKData.indexOf("@")) + " §r§e？ \n§r§e一旦删除数据将无法恢复！请谨慎操作！")
        .button1("§c§l>>删除CDK<<")
        .button2("§a返回上一级页面")
        RemoveCDKForm.show(player).then(result => {
            if (result.selection == 0) {
                this.SetCDKSub(player,CDKData)
            } else if (result.selection == 1) {
                RunCmd(`scoreboard players reset "${CDKData}" CDK`)
                RunCmd(`scoreboard objectives remove "C:${CDKData.slice(2,CDKData.indexOf("@"))}"`)
                Tell(`§a>> CDK ${CDKData.slice(2,CDKData.indexOf("@"))} 删除成功！校验值： ${CDKData} §c如果误删请将本条信息截图发给服主！`,player.nameTag)
            }
        })

    },

    /////////////////////////////////////////////
    CreIsland(player) {
        let i = 1
        const CreIslandForm = new ActionFormData()
        .title("创建空岛")
        if (player.hasTag("HaveIsland")) {
            CreIslandForm.body("§l===========================" + "\n§r§c您已经拥有相关空岛\n您可以点击主页面“返回主岛”按钮\n快速返回主岛\n如果你没有创建空岛却出现了本界面请及时联系服主！\n如果您想废弃您原有的空岛，重新领取空岛，可以联系服主支付6666手续费后重新领取！" + "\n§r§l===========================")
            CreIslandForm.button("§c退出创建空岛！")
            CreIslandForm.show(player)
        } else {
            let Str = "§r§l===========================\n§r§6欢迎使用空岛创建系统\n§c请务必认真阅读以下的说明：§6\n以下是各种空岛的描述，您可以根据自己的喜好选择自己想要的空岛！\n在选择好相应的空岛后您可以点击下方的§c“开始创建”§6按钮运行下面的程序！\n同时您也可以选择不创建空岛,选择和其他玩家一起在一个空岛(别人创建的)生存\n选择本种玩法请点击§c“和其他玩家一同游玩”§6按钮\n§r§l==========================="
            for (let structure in IslandData) {
                Str = Str + "\n§r§e空岛名称：§6 #" + i + " " + IslandData[structure].name + "\n§r§e描述：§6" + IslandData[structure].description + "\n§r§l==========================="
                i++
            }
            // Str = Str + "\n§r§l==========================="
            CreIslandForm.body(Str)
            CreIslandForm.button("§a开始创建")
            CreIslandForm.button("§c和其他玩家一同游玩")
            CreIslandForm.show(player).then(result => {
                if (result.selection == 0) {
                    this.ChooseIsland(player)
                } else if (result.selection == 1) {
                    Tell("§c>> 开发中内容，敬请期待！",player.nameTag)
                }
            })
        }
    },

    ChooseIsland(player) {
        let i = 1
        const ChooseIslandForm = new ActionFormData()
        .title("创建空岛")
        .body("请谨慎选择自己的空岛哦！")
        .button("返回上一级菜单")
        for (let structure in IslandData) {
            ChooseIslandForm.button("§c空岛样式编号：#" + i + " 空岛名称：" + IslandData[structure].name)
            i++
        }
        ChooseIslandForm.show(player).then(result => {
            if (result.selection == 0) {
                this.CreIsland(player)
            } else {
                this.ChooseIslandSub(player, result.selection)
            }
        })
    },

    ChooseIslandSub(player,key) {
        const ChooseIslandSubForm = new MessageFormData()
        .title("确认空岛选择")
        let i = 1
        for (let structure in IslandData) {
            if (i == key) {
                ChooseIslandSubForm.body("§e您确认要以 §6" + IslandData[structure].name + " §e样式创建空岛嘛？\n§c一旦确定无法更改哦！请谨慎考虑！")
                break;
            }
            i++
        }
        ChooseIslandSubForm.button1("§a确认创建空岛")
        ChooseIslandSubForm.button2("§c重新选择样式")
        ChooseIslandSubForm.show(player).then(result => {
            if (result.selection == 1) {
                RunCmd(`tag ${player.nameTag} add ISLAND${i}`)
                RunCmd(`tag ${player.nameTag} add CringIsland`)
            } else if (result.selection == 0) {
                this.ChooseIsland(player)
            }
        })
    }
}

//对于钟表使用的检测
world.events.beforeItemUse.subscribe(event => {
    // Tell(`§c>> ${event.item.typeId} ${event.source.nameTag}`,`NIANIANKNIA`);
    if (event.item.typeId == "minecraft:clock") {
        // Tell(`§c>> 你使用钟表!`,event.source.nameTag);
        let player = event.source;
        //调用服务器主菜单
        guiAPI.Main(player);
    }
})



// 玩家死亡后重生的检测
world.events.playerSpawn.subscribe(event => {
    if (!event.initialSpawn) {
        if (GetScore("equLevel",event.player.nameTag) < 17) {
            RunCmd(`scoreboard players set @a[name="${event.player.nameTag}"] oxygen ${parseInt(GetScore("oxygen",event.player.nameTag) * 0.9)}`)
            event.player.tell(`§c>> 您由于死亡损失了剩余的10%的氧气值！`)
        }
    }
})

// world.events.beforeExplosion.subscribe(event => {
//     Broadcast(event.source.typeId)
//     if (event.source.typeId == "minecraft:creeper") {
//         event.cancel = true
//     }
// })



//控制每时每刻执行的事件！
world.events.tick.subscribe(t => {
    // let run_time = Date.now()
    // run_time = Date.now() - run_time
    // world.setDynamicProperty("tps", world.getDynamicProperty("tps") + 1);
    // if (t.currentTick % 200 == 0) {
    //     Broadcast((world.getDynamicProperty("tps")/10).toString())
    //     world.setDynamicProperty("tps", 0);
    // }
    //Broadcast(world.getDynamicProperty("CDKData").toString())
    RunCmd(`gamemode a @a[tag=!op,tag=!mining,m=!a,x=559,y=67,z=562,r=700]`)
    RunCmd(`tag @a remove mining`)
    RunCmd(`tag @a[x=725,y=3,z=539,dx=89,dy=69,dz=30] add mining`)
    RunCmd(`scoreboard players add @a[x=725,y=3,z=539,dx=89,dy=71,dz=30,tag=mining] miningTime -1`)
    RunCmd(`title @a[x=725,y=3,z=539,dx=89,dy=71,dz=30,scores={miningTime = ..0}] title §c矿场使用时间已到！`)
    RunCmd(`title @a[x=725,y=3,z=539,dx=89,dy=71,dz=30,scores={miningTime = ..0}] subtitle §7请重新花费体力进入！`)
    RunCmd(`tp @a[x=725,y=3,z=539,dx=89,dy=71,dz=30,scores={miningTime = ..0}] 702 82 554`)
    CheckCringPlayer()
    // RunCmd(`scoreboard players add @a oxygen 0`)
    // RunCmd(`scoreboard players add @a equLevel 0`)
    // RunCmd(`scoreboard players add @a actionbar 0`)
    // RunCmd(`scoreboard players add @a time 0`)
    // RunCmd(`scoreboard players add @a money 0`)
    // RunCmd(`scoreboard players add @a AnoxicTime 0`)
    let players = world.getPlayers()
    let playerList = Array.from(players);
    //每秒钟执行的事件
    if (t.currentTick % 20 == 0) {
        let TIME = new Date();
        // Broadcast(TIME.toLocaleString())
        if (TIME.getMinutes() == 0 && TIME.getSeconds() == 0 ) {
            let RN = parseInt(getNumberInNormalDistribution(100,20))
            //防止物价指数出现极端数值
            if (RN <= 20 || RN >= 180) {
                RN = 100
            }
            RunCmd(`scoreboard players set RN DATA ${RN}`);
            RunCmd(`title @a title §c物价指数发生变动！`)
            RunCmd(`title @a subtitle §7物价指数由 §l§e${GetScore("DATA","RN") / 100} §r§7变为 §l§e${RN / 100}`)
            RunCmd(`backup`);
            Broadcast(`§a>> 服务器自动备份中！可能出现卡顿，请勿在此时进行较大负载活动！`)
            if (TIME.getHours() == 16) {
                //每天更新数据文件
                RunCmd(`tite @a[x=725,y=3,z=539,dx=89,dy=69,dz=30] title §c矿场已更新！`)
                RunCmd(`tite @a[x=725,y=3,z=539,dx=89,dy=69,dz=30] subtitle §7请重新花费体力进入！`)
                RunCmd(`tp @a[x=725,y=3,z=539,dx=89,dy=69,dz=30] 702 82 554`)
                RunCmd(`scoreboard objectives remove miningTime`)
                RunCmd(`scoreboard objectives add miningTime dummy 采矿时间`)
                RunCmd(`spawnores OreChunk1 813 3 568 725 68 539`)
                let ScoreBoards = world.scoreboard.getObjectives()
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id.slice(0,2) == "R:") {
                        RunCmd(`scoreboard objectives remove "${ScoreBoards[i].id}"`)
                    }
                }
                Broadcast(`§a>> 服务器时间已更新！矿场已更新！`)
            }
        }
        if (TIME.getSeconds() == 0) {
            for (let playername in posData) {
                posData[playername].num = 0
            }
            RunCmd(`scoreboard players add @a time 1`);
            RunCmd(`scoreboard players add @a[scores={stamina=..159}] stamina 1`);
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
            if (!playerList[i].hasTag("shown")) {
                playerList[i].addTag("showing")
                // RunCmd(`tag "${playerList[i].nameTag}" add showing`)
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
            if (GetScore("equLevel",playerList[i].nameTag) > 16) {
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
            if (playerList[i].hasTag("GetIsland")) {
                guiAPI.CreIsland(playerList[i])
                RunCmd(`tag ${playerList[i].nameTag} remove GetIsland`)
            }
            // Broadcast(`§c[NKillHacker]§r\nspeed:${((Math.pow(playerList[i].velocity.x,2) + Math.pow(playerList[i].velocity.y,2) + Math.pow(playerList[i].velocity.z,2))).toFixed(5)} \npos:${playerList[i].location.x.toFixed(4)} ${playerList[i].location.y.toFixed(4)} ${playerList[i].location.z.toFixed(4)}`)
            let pos = {}
            if (posData[playerList[i].nameTag]) {
                //Broadcast((Math.pow(playerList[i].location.x.toFixed(4) - posData[playerList[i].nameTag].x,2) + Math.pow(playerList[i].location.y.toFixed(4) - posData[playerList[i].nameTag].y,2) + Math.pow(playerList[i].location.z.toFixed(4) - posData[playerList[i].nameTag].z,2)).toString())
                if (((Math.pow(playerList[i].velocity.x,2) + Math.pow(playerList[i].velocity.y,2) + Math.pow(playerList[i].velocity.z,2))) >= 0.045 && (Math.pow(playerList[i].location.x.toFixed(4) - posData[playerList[i].nameTag].x,2) + Math.pow(playerList[i].location.y.toFixed(4) - posData[playerList[i].nameTag].y,2) + Math.pow(playerList[i].location.z.toFixed(4) - posData[playerList[i].nameTag].z,2)) <= 0.5) {
                    world.getDimension("overworld").runCommandAsync(`tellraw @a[tag=op] {\"rawtext\":[{\"text\":\"§c>> 疑似 §e${playerList[i].nameTag} §c正在使用自由视角，如果本消息短期多次出现建议前往查看！注意：本消息可能是个误判！以下为该玩家的异常数据§r\nspeed:${((Math.pow(playerList[i].velocity.x,2) + Math.pow(playerList[i].velocity.y,2) + Math.pow(playerList[i].velocity.z,2))).toFixed(3)} \npos:${playerList[i].location.x.toFixed(3)} ${playerList[i].location.y.toFixed(3)} ${playerList[i].location.z.toFixed(3)}\ndistance:${(Math.pow(playerList[i].location.x.toFixed(4) - posData[playerList[i].nameTag].x,2) + Math.pow(playerList[i].location.y.toFixed(4) - posData[playerList[i].nameTag].y,2) + Math.pow(playerList[i].location.z.toFixed(4) - posData[playerList[i].nameTag].z,2)).toFixed(3).toString()}\"}]}`);
                    posData[playerList[i].nameTag].num++
                    if (posData[playerList[i].nameTag].num >= 8) {
                        posData[playerList[i].nameTag].num = 0
                        RunCmd(`ban ${playerList[i].nameTag} 1 违规使用自由视角(灵魂出窍)`)
                    }
                    //RunCmd(`ban ${playerList[i].nameTag} 1 违规使用自由视角(灵魂出窍)`)
                }
                posData[playerList[i].nameTag].x = playerList[i].location.x.toFixed(4)
                posData[playerList[i].nameTag].y = playerList[i].location.y.toFixed(4)
                posData[playerList[i].nameTag].z = playerList[i].location.z.toFixed(4)
            } else {
                //Broadcast("1")
                pos.num = 0
                pos.x = playerList[i].location.x.toFixed(4)
                pos.y = playerList[i].location.y.toFixed(4)
                pos.z = playerList[i].location.z.toFixed(4)
                posData[playerList[i].nameTag] = pos
            }
            if ((Math.pow(playerList[i].velocity.x,2) + Math.pow(playerList[i].velocity.y,2) + Math.pow(playerList[i].velocity.z,2)) > 0.07 && GetScore("equLevel",playerList[i].nameTag) <= 10) {
                RunCmd(`scoreboard players add @e[name="${playerList[i].nameTag}",type=player] oxygen -1`);
            }
            //  Broadcast(`${Math.pow(playerList[i].velocity.x,2) + Math.pow(playerList[i].velocity.y,2) + Math.pow(playerList[i].velocity.z,2)}`)
            if (GetScore("oxygen",playerList[i].nameTag) <= 0) {
                RunCmd(`scoreboard players add @a[name="${playerList[i].nameTag}"] AnoxicTime 1`)
            } else {
                RunCmd(`scoreboard players set @a[name="${playerList[i].nameTag}"] AnoxicTime 0`)
            }
            if (GetScore("AnoxicTime",playerList[i].nameTag) == 1) {
                RunCmd(`title "${playerList[i].nameTag}" title §c您已缺氧！`)
                RunCmd(`title "${playerList[i].nameTag}" subtitle §7请及时补充氧气！`)
                Tell("§c>> 您已进入缺氧状态！请及时补充氧气，否则会导致死亡！5秒后系统将自动打开氧气购买界面！",playerList[i].nameTag)
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
                Tell("§c>> 我们很遗憾的通知您，由于您缺氧过长时间，昏倒在家中...幸亏您被巡逻机器人及时发现并送到了医院，才救回一条命...",playerList[i].nameTag)
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
                //
                if (playerList[i].hasTag("ShowOxygenName")) {
                    titleActionbar = titleActionbar + "氧气值："
                }
                //
                if (playerList[i].hasTag("ShowOxygen1") || playerList[i].hasTag("ShowOxygen2") || playerList[i].hasTag("ShowOxygen3") || playerList[i].hasTag("ShowOxygen4")) {
                    let percent = (GetScore("oxygen",playerList[i].nameTag) / equLevelData[GetScore("equLevel",playerList[i].nameTag)].max)
                    if (playerList[i].hasTag("ShowOxygen1")) {
                        switch (true) {
                            case percent >= 1:
                                titleActionbar = titleActionbar + "§e[§a||||||||||||||||||||§6100.00%§e]"
                                break;
                            case percent >= 0.95:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||||||||§6${(percent * 100).toFixed(2)}%§7§e]`
                                break;
                            case percent >= 0.9:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||||||||§6${(percent * 100).toFixed(2)}%§7|§e]`
                                break;
                            case percent >= 0.85:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||||||§6${(percent * 100).toFixed(2)}%§7||§e]`
                                break;
                            case percent >= 0.8:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||||||§6${(percent * 100).toFixed(2)}%§7|||§e]`
                                break;
                            case percent >= 0.75:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||||§6${(percent * 100).toFixed(2)}%§7||||§e]`
                                break;
                            case percent >= 0.7:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||||§6${(percent * 100).toFixed(2)}%§7|||||§e]`
                                break;
                            case percent >= 0.65:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||§6${(percent * 100).toFixed(2)}%§7||||||§e]`
                                break;
                            case percent >= 0.6:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||§6${(percent * 100).toFixed(2)}%§7|||||||§e]`
                                break;
                            case percent >= 0.55:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||§6${(percent * 100).toFixed(2)}%§7||||||||§e]`
                                break;
                            case percent >= 0.5:
                                titleActionbar = titleActionbar + `§e[§a||||||||||§6${(percent * 100).toFixed(2)}%§7|||||||||§e]`
                                break;
                            case percent >= 0.45:
                                titleActionbar = titleActionbar + `§e[§a|||||||||§6${(percent * 100).toFixed(2)}%§7||||||||||§e]`
                                break;
                            case percent >= 0.4:
                                titleActionbar = titleActionbar + `§e[§a||||||||§6${(percent * 100).toFixed(2)}%§7|||||||||||§e]`
                                break;
                            case percent >= 0.35:
                                titleActionbar = titleActionbar + `§e[§a|||||||§6${(percent * 100).toFixed(2)}%§7||||||||||||§e]`
                                break;
                            case percent >= 0.3:
                                titleActionbar = titleActionbar + `§e[§a||||||§6${(percent * 100).toFixed(2)}%§7|||||||||||||§e]`
                                break;
                            case percent >= 0.25:
                                titleActionbar = titleActionbar + `§e[§a|||||§6${(percent * 100).toFixed(2)}%§7||||||||||||||§e]`
                                break;
                            case percent >= 0.2:
                                titleActionbar = titleActionbar + `§e[§c||||§c${(percent * 100).toFixed(2)}%§7|||||||||||||||§e]`
                                break;
                            case percent >= 0.15:
                                titleActionbar = titleActionbar + `§e[§c|||§c${(percent * 100).toFixed(2)}%§7||||||||||||||||§e]`
                                break;
                            case percent >= 0.1:
                                titleActionbar = titleActionbar + `§e[§c||§c${(percent * 100).toFixed(2)}%§7|||||||||||||||||§e]`
                                break;
                            case percent >= 0.05:
                                titleActionbar = titleActionbar + `§e[§c|§c${(percent * 100).toFixed(2)}%§7||||||||||||||||||§e]`
                                break;
                            case percent >= 0:
                                titleActionbar = titleActionbar + `§e[§c${(percent * 100).toFixed(2)}%§7|||||||||||||||||||§e]`
                                break;
                            case percent < 0:
                                titleActionbar = titleActionbar + `§e[§c0.00%§7|||||||||||||||||||§e]`
                                break;
                        }
                    } else if (playerList[i].hasTag("ShowOxygen2")) {
                        switch (true) {
                            case percent >= 1:
                                titleActionbar = titleActionbar + "§e[§a||||||||||||||||||||§e] §6100.00%"
                                break;
                            case percent >= 0.95:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||||||||§6|§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.9:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||||||||§6|§7|§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.85:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||||||§6|§7||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.8:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||||||§6|§7|||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.75:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||||§6|§7||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.7:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||||§6|§7|||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.65:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||||§6|§7||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.6:
                                titleActionbar = titleActionbar + `§e[§a||||||||||||§6|§7|||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.55:
                                titleActionbar = titleActionbar + `§e[§a|||||||||||§6|§7||||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.5:
                                titleActionbar = titleActionbar + `§e[§a||||||||||§6|§7|||||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.45:
                                titleActionbar = titleActionbar + `§e[§a|||||||||§6|§7||||||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.4:
                                titleActionbar = titleActionbar + `§e[§a||||||||§6|§7|||||||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.35:
                                titleActionbar = titleActionbar + `§e[§a|||||||§6|§7||||||||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.3:
                                titleActionbar = titleActionbar + `§e[§a||||||§6|§7|||||||||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.25:
                                titleActionbar = titleActionbar + `§e[§a|||||§6|§7||||||||||||||§e] §6${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.2:
                                titleActionbar = titleActionbar + `§e[§c||||§6|§7|||||||||||||||§e] §c${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.15:
                                titleActionbar = titleActionbar + `§e[§c|||§6|§7||||||||||||||||§e] §c${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.1:
                                titleActionbar = titleActionbar + `§e[§c||§6|§7|||||||||||||||||§e] §c${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0.05:
                                titleActionbar = titleActionbar + `§e[§c|§6|§7||||||||||||||||||§e] §c${(percent * 100).toFixed(2)}%`
                                break;
                            case percent >= 0:
                                titleActionbar = titleActionbar + `§e[§6|§7|||||||||||||||||||§e] §c${(percent * 100).toFixed(2)}%`
                                break;
                            case percent < 0:
                                titleActionbar = titleActionbar + `§e[§7||||||||||||||||||||§e] §c0.00%`
                                break;
                        }
                    } else if (playerList[i].hasTag("ShowOxygen3")) {
                        titleActionbar = titleActionbar + `§l§e${GetScore("oxygen",playerList[i].nameTag)}/${equLevelData[GetScore("equLevel",playerList[i].nameTag)].max}`
                    } else if (playerList[i].hasTag("ShowOxygen4")) {
                        titleActionbar = titleActionbar + `§l§e${(percent * 100).toFixed(2)}%`
                    }
                }
                if (playerList[i].hasTag("ShowMoney")) {
                    titleActionbar = titleActionbar + "§r §f能源币：§e§l" + GetScore("money",playerList[i].nameTag)
                }
                if (playerList[i].hasTag("ShowTime")) {
                    titleActionbar = titleActionbar + "§r §f在线时间：§e§l" + GetScore("time",playerList[i].nameTag)
                }
                if (playerList[i].hasTag("ShowRN")) {
                    titleActionbar = titleActionbar + "§r §f物价指数：§e§l" + GetScore("DATA","RN") / 100
                }
                if (playerList[i].hasTag("ShowStamina")) {
                    titleActionbar = titleActionbar + "§r §f体力值：§e§l" + GetScore("stamina",playerList[i].nameTag)
                }
                if (GetScore("oxygen",playerList[i].nameTag) <= 200 && GetScore("oxygen",playerList[i].nameTag) > 0) {
                    titleActionbar = titleActionbar + "§r\n§c§l您即将进入缺氧状态，请及时补充氧气！"
                }
                if (playerList[i].dimension.id == "minecraft:nether" && GetScore("equLevel",playerList[i].nameTag) <= 8) {
                    titleActionbar = titleActionbar + "§r\n§c§l⚠警告！您目前呼吸装备等级过低，氧气消耗速度是原有的1倍！"
                }
                if (playerList[i].dimension.id == "minecraft:the_end" && GetScore("equLevel",playerList[i].nameTag) <= 13) {
                    titleActionbar = titleActionbar + "§r\n§c§l⚠警告！您目前呼吸装备等级过低，氧气消耗速度是原有的2倍！"
                }
                if (GetScore("AnoxicTime",playerList[i].nameTag) > 0) {
                    titleActionbar = titleActionbar + "§r\n§c§l⚠警告！您已经进入缺氧状态 " + GetScore("AnoxicTime",playerList[i].nameTag) + " 秒，请及时补充氧气否则将会死亡！"
                }
                RunCmd(`title @a[name=${playerList[i].nameTag}] actionbar ${titleActionbar}`)
            }
        }
    }
})


