//圈地系统
//开发中功能请勿使用！

import {system, world} from '@minecraft/server';
import { ExternalFS } from './API/filesystem';
import { Broadcast, log } from './customFunction';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
//初始化LandIndex
var LandIndex = {};

let LandData = {};

const fs = new ExternalFS();


/**
 * 输入坐标范围信息，以及当前的索引值数据，添加索引值,并返回新的索引值
 * @param {Array} pos1
 * @param {Array} pos2
 * @param {String} dimid
 * @param {String} LandUUID
 * @param {object} LandIndex
 * @return {object} newLandIndex
 */
function calculateIndex(pos1, pos2, dimid, LandUUID) {
    let X1Index = parseInt(pos1[0] / 16);
    let Z1Index = parseInt(pos1[2] / 16);
    let X2Index = parseInt(pos2[0] / 16);
    let Z2Index = parseInt(pos2[2] / 16);
    //将最小的转化为相应索引值
    if (X1Index > X2Index) {
        let IndexXMIN = X1Index;
        X1Index = X2Index;
        X2Index = IndexXMIN;
    }
    if (Z1Index > Z2Index) {
        let IndexZMIN = Z1Index;
        Z1Index = Z2Index;
        Z2Index = IndexZMIN;
    }
    //开始写入索引值
    for (let XIndex = X1Index; XIndex <= X2Index; XIndex++) {
        for (let ZIndex = Z1Index; ZIndex <= Z2Index; ZIndex++) {
            if (!LandIndex[String(dimid)]) {
                LandIndex[String(dimid)] = {};
            }
            if (!LandIndex[String(dimid)][String(XIndex)]) {
                LandIndex[String(dimid)][String(XIndex)] = {}
            }
            if (!LandIndex[String(dimid)][String(XIndex)][String(ZIndex)]) {
                LandIndex[String(dimid)][String(XIndex)][String(ZIndex)] = [];
            }
            LandIndex[String(dimid)][String(XIndex)][String(ZIndex)].push(LandUUID);
        }
    }
}

/**
 * 判断坐标对应的区块是否有地皮数据
 * @param {Array} pos
 * @param {number} dimid
 * @returns {object} 如果不在返回false，如果在则返回所在的地皮数据
 */
function PosInIndex(pos,dimid) {
    //根据传入的坐标计算出相应的区块编号
    let posX = parseInt(pos[0]);
    let posY = parseInt(pos[1]);
    let posZ = parseInt(pos[2]);
    let posDimid = dimid;
    let XIndex = parseInt(posX / 16);
    let ZIndex = parseInt(posZ / 16);
    //判断该区块内是否有地皮数据，根据数据层层判断
    if(!LandIndex[posDimid] || !LandIndex[posDimid][XIndex] || !LandIndex[posDimid][XIndex][ZIndex]) {
        return false;
    }
    //如果走到了这里说明，该区块编号下有相应的地皮数据存在，然后遍历该区块存在的地皮即可
    let IndexData = LandIndex[posDimid][XIndex][ZIndex];
    for (let key = 0;key < IndexData.length;key++) {
        //根据相应的地皮类型进行计算
        switch (LandData[IndexData[key]].type) {
            //这里判断的就是相应的坐标是否真在该区块所在的地皮之中
            case "3D":
                //就是一个简简单单的数据判断
                let resultX_3D = ((posX >= LandData[IndexData[key]].pos1[0] && posX <= LandData[IndexData[key]].pos2[0]) || (posX <= LandData[IndexData[key]].pos1[0] && posX >= LandData[IndexData[key]].pos2[0]));
                let resultY = ((posY >= LandData[IndexData[key]].pos1[1] && posY <= LandData[IndexData[key]].pos2[1]) || (posY <= LandData[IndexData[key]].pos1[1] && posY >= LandData[IndexData[key]].pos2[1]));
                let resultZ_3D = ((posZ >= LandData[IndexData[key]].pos1[2] && posZ <= LandData[IndexData[key]].pos2[2]) || (posZ <= LandData[IndexData[key]].pos1[2] && posZ >= LandData[IndexData[key]].pos2[2]));
                //Broadcast("result " + resultX_3D + " " + resultY + " " + resultZ_3D)
                if ((posDimid == LandData[IndexData[key]].dimid) && resultX_3D && resultY && resultZ_3D) {
                    return LandData[IndexData[key]];
                }
                break;
            case "2D":
                let resultX = ((posX >= LandData[IndexData[key]].pos1[0] && posX <= LandData[IndexData[key]].pos2[0]) || (posX <= LandData[IndexData[key]].pos1[0] && posX >= LandData[IndexData[key]].pos2[0]));
                let resultZ = ((posZ >= LandData[IndexData[key]].pos1[2] && posZ <= LandData[IndexData[key]].pos2[2]) || (posZ <= LandData[IndexData[key]].pos1[2] && posZ >= LandData[IndexData[key]].pos2[2]));
                if ((posDimid == LandData[IndexData[key]].dimid) && resultX && resultZ) {
                    return LandData[IndexData[key]];
                }
                break;
            case "cylinder":
                //根据两点间的距离进行相应的判断操作
                let distance = Math.pow(posX - LandData[IndexData[key]].pos1[0],2) + Math.pow(posZ - LandData[IndexData[key]].pos1[2],2);
                if (Math.pow(IndexData[key].R,2) >= distance) {
                    return LandData[IndexData[key]];
                }
                break;
        }
    }
    return false;
}

/**
 * 判断玩家坐标对应的区块是否有地皮数据
 * @param {object} player
 * @returns {boolean}
 */
function PlayerInIndex(player) {
    let land = PosInIndex([player.location.x, player.location.y,player.location.z],player.dimension.id);
    if (land) {
        player.onScreenDisplay.setActionBar("§b您正在 " + land.landName + " 中");
    }
    //player.sendMessage(land)
}

system.runInterval(() => {
    let players = world.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        PlayerInIndex(players[i]);
    }
},1)

const start = Date.now();

//服务器启动监听&&获得玩家市场数据
world.afterEvents.worldInitialize.subscribe(() => {
    fs.GetJSONFileData("land.json").then((result) => {
        //文件不存在
        if (result === 0) {
            fs.CreateNewJsonFile("land.json",{}).then((result) => {
                if (result === "success") {
                    LandData = {};
                    log("玩家市场文件不存在，已成功创建！");
                } else if (result === -1) {
                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                }
            });
        } else if (result === -1) {
            console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
        } else {
            //文件存在且服务器连接成功
            LandData = result;
            let LandNum = 0;
            for (let Land in LandData) {
                calculateIndex(LandData[Land].pos1, LandData[Land].pos2, LandData[Land].dimid, Land);
                LandNum++;
            }
            log("圈地数据获取成功，本次读取用时：" + (Date.now() - start) + "ms，共加载 " + LandNum + " 块地皮数据！" );
        }
    })
})

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    let land = PosInIndex([event.block.x,event.block.y,event.block.z],event.block.dimension.id);
    if (land) {
        if (!event.player.hasTag("op") && land.owner != event.player.id) {
            event.cancel = true;
            event.player.sendMessage("§c您没有相关权限在此处破坏方块！");
        }
    }
})

world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    let land = PosInIndex([event.block.x,event.block.y,event.block.z],event.block.dimension.id);
    if (land) {
        if (!event.player.hasTag("op") && land.owner != event.player.id) {
            event.cancel = true;
            event.player.sendMessage("§c您没有相关权限在此处放置方块！");
        }
    }
})

//玩家GUI表现
const GUI = {
    Main(player) {
        const MainForm = new ActionFormData()
        .title("圈地系统")
        .body("§e欢迎使用圈地系统！\n在这里您可以购买、管理您的地皮！")
        .button("管理已有地皮")
        .button("购买出售中地皮")
        .button("开始自由圈地")
        .show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        this.ChoseLandType(player);
                        break;
                }
            }
        })
    },

    ChoseLandType(player) {
        const CreateLandForm = new ActionFormData()
        .title("请选择圈地类型")
        .button("2D类型地皮\n§9直上直下的地皮，最安全")
        .button("3D类型地皮\n§9按照提供的坐标，最实惠")
    }



}

// 玩家使用物品
world.beforeEvents.itemUseOn.subscribe((event) => {
    //定义一些可以改变物品地形的工具
    const tools = [
        "minecraft:wooden_hoe","minecraft:stone_hoe","minecraft:iron_hoe","minecraft:golden_hoe","minecraft:diamond_hoe","minecraft:netherite_hoe",
        "minecraft:wooden_shovel","minecraft:stone_shovel","minecraft:iron_shovel","minecraft:golden_shovel","minecraft:diamond_shovel","minecraft:netherite_shovel",
        "minecraft:water_bucket","minecraft:lava_bucket","minecraft:cod_bucket","minecraft:salmon_bucket","minecraft:tropical_fish_bucket","minecraft:pufferfish_bucket","minecraft:powder_snow_bucket","minecraft:axolotl_bucket","minecraft:tadpole_bucket",
        "minecraft:flint_and_steel","minecraft:shears","minecraft:hopper"
    ]
    //定义一些可以被改变状态的方块
    const blocks = [
        "minecraft:wooden_door","minecraft:spruce_door","minecraft:mangrove_door","minecraft:birch_door","minecraft:jungle_door","minecraft:acacia_door","minecraft:dark_oak_door","minecraft:crimson_door","minecraft:iron_door","minecraft:warped_door",
        "minecraft:trapdoor","minecraft:spruce_trapdoor","minecraft:birch_trapdoor","minecraft:jungle_trapdoor","minecraft:acacia_trapdoor","minecraft:dark_oak_trapdoor","minecraft:mangrove_trapdoor","minecraft:iron_trapdoor","minecraft:crimson_trapdoor","minecraft:warped_trapdoor",
        "minecraft:fence_gate","minecraft:spruce_fence_gate","minecraft:birch_fence_gate","minecraft:jungle_fence_gate","minecraft:acacia_fence_gate","minecraft:dark_oak_fence_gate","minecraft:mangrove_fence_gate","minecraft:crimson_fence_gate","minecraft:warped_fence_gate",
        "minecraft:lever","minecraft:unpowered_repeater","minecraft:unpowered_comparator","minecraft:wooden_button",
        "minecraft:chest","minecraft:trapped_chest","minecraft:ender_chest","minecraft:barrel","minecraft:frame","minecraft:anvil","minecraft:enchanting_table","minecraft:cartography_table","minecraft:smithing_table",
        "minecraft:black_shulker_box","minecraft:blue_shulker_box","minecraft:brown_shulker_box","minecraft:cyan_shulker_box","minecraft:gray_shulker_box","minecraft:green_shulker_box","minecraft:light_blue_shulker_box","minecraft:lime_shulker_box","minecraft:orange_shulker_box",
        "minecraft:pink_shulker_box","minecraft:purple_shulker_box","minecraft:red_shulker_box","minecraft:undyed_shulker_box","minecraft:white_shulker_box","minecraft:yellow_shulker_box"
    ]
    let land = PosInIndex([event.block.x,event.block.y,event.block.z],event.block.dimension.id);
    //log("测试" + land + event.block.x + " " + event.block.y + " " + event.block.z + " " + event.block.dimension.id)
    if (land && !event.source.hasTag("op") && land.owner != event.source.id) {
        if (tools.includes(event.itemStack.typeId) || blocks.includes(event.block.typeId)) {
            event.cancel = true;
            event.source.sendMessage("§c您没有相关权限在此处进行相关交互动作！");
        }
    }
})

//对于物品使用的检测
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick") {
        GUI.Main(event.source)
    }
})




