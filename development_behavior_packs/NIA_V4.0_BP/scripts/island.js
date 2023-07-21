import {world,system} from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {Tell,RunCmd,GetScore, Broadcast} from './customFunction.js'
import { cfg } from './config.js'

const CX = cfg.islandCfg.CX
const CY = cfg.islandCfg.CY
const CZ = cfg.islandCfg.CZ
const R = cfg.islandCfg.R

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
            } while (num > AllNum);
            let pos = parseInt(2 * Math.PI * r / R) - AllNum + num
            let posX = parseInt(Math.cos(pos * 2 * Math.PI / (parseInt(2 * Math.PI * r / R))) * r) + cX;
            let posZ = -parseInt(Math.sin(pos * 2 * Math.PI / (parseInt(2 * Math.PI * r / R))) * r) + cZ;
            RunCmd(`tp @a[name=${playerName}] ${posX + dX} ${cY + dY + 20} ${posZ + dZ}`);
            return [posX, posZ]
        }
    }
}

/**
 * 根据空岛编号计算相关空岛坐标并生成空岛
 */
function SpawnIsland(playerName,posX,cY,posZ,structureName,dX,dY,dZ) {
    let minX = posX
    let minY = cY
    let minZ = posZ
    let maxX = posX + 20
    let maxY = cY + 20
    let maxZ = posZ + 20
    let AllAir = true
    try {
        Broadcast("test2")
        let block = world.getDimension("overworld").getBlock({x:minX, y:minY, z:minZ})
        Broadcast("test")
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    block = world.getDimension("overworld").getBlock({x:x, y:y, z:z})

                    if (block.typeid != "minecraft:air") {
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

const GUI = {
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

//每个时间刻检查有没有人在创建空岛
system.runInterval(() => {
    CheckCringPlayer()
},1)

//给特定的玩家打开gui界面
system.runInterval(() => {
    let players = world.getPlayers()
    let playerList = Array.from(players);
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].hasTag("GetIsland")) {
            GUI.CreIsland(playerList[i])
            RunCmd(`tag ${playerList[i].nameTag} remove GetIsland`)
        }
    }
},20)
