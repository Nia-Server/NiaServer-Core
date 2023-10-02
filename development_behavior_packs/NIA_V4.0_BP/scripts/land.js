//圈地系统
//开发中功能请勿使用！

import { system, world, Dimension } from '@minecraft/server';
import { ExternalFS } from './API/filesystem';
import { Broadcast, GetScore, GetTime, RunCmd, log } from './customFunction';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { adler32 } from './API/cipher_system';
import { cfg } from './config';
import { Main } from './menu/main';

//初始化一些变量
var land_index = {};
var land_data = {};
var land_history = {};
var temp_player_money = {};
var taskid = {"actionbar":{},"particle":{}};

//导入文件系统
const fs = new ExternalFS();

//删除所有常加载区块
RunCmd("tickingarea remove_all");

/**
 * 输入坐标范围信息，以及当前的索引值数据，添加索引值,并返回新的索引值
 * @param {Array} pos1
 * @param {Array} pos2
 * @param {String} dimid
 * @param {String} LandUUID
 */
function calculate_index(pos1, pos2, dimid, LandUUID) {
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
            if (!land_index[String(dimid)]) {
                land_index[String(dimid)] = {};
            }
            if (!land_index[String(dimid)][String(XIndex)]) {
                land_index[String(dimid)][String(XIndex)] = {}
            }
            if (!land_index[String(dimid)][String(XIndex)][String(ZIndex)]) {
                land_index[String(dimid)][String(XIndex)][String(ZIndex)] = [];
            }
            land_index[String(dimid)][String(XIndex)][String(ZIndex)].push(LandUUID);
        }
    }
}

/**
 * 判断坐标对应的区块是否有地皮数据
 * @param {Array} pos
 * @param {number} dimid
 * @returns {object} 如果不在返回false，如果在则返回所在的地皮数据
 */
function pos_in_index(pos,dimid) {
    //根据传入的坐标计算出相应的区块编号
    let posX = parseInt(pos[0]);
    let posY = parseInt(pos[1]);
    let posZ = parseInt(pos[2]);
    let posDimid = dimid;
    let XIndex = parseInt(posX / 16);
    let ZIndex = parseInt(posZ / 16);
    //判断该区块内是否有地皮数据，根据数据层层判断
    if(!land_index[posDimid] || !land_index[posDimid][XIndex] || !land_index[posDimid][XIndex][ZIndex]) {
        return false;
    }
    //如果走到了这里说明，该区块编号下有相应的地皮数据存在，然后遍历该区块存在的地皮即可
    let IndexData = land_index[posDimid][XIndex][ZIndex];
    for (let key = 0;key < IndexData.length;key++) {
        //根据相应的地皮类型进行计算
        switch (land_data[IndexData[key]].type) {
            //这里判断的就是相应的坐标是否真在该区块所在的地皮之中
            case "3d":
                //就是一个简简单单的数据判断
                let resultX_3D = ((posX >= land_data[IndexData[key]].pos1[0] && posX <= land_data[IndexData[key]].pos2[0]) || (posX <= land_data[IndexData[key]].pos1[0] && posX >= land_data[IndexData[key]].pos2[0]));
                let resultY = ((posY >= land_data[IndexData[key]].pos1[1] && posY <= land_data[IndexData[key]].pos2[1]) || (posY <= land_data[IndexData[key]].pos1[1] && posY >= land_data[IndexData[key]].pos2[1]));
                let resultZ_3D = ((posZ >= land_data[IndexData[key]].pos1[2] && posZ <= land_data[IndexData[key]].pos2[2]) || (posZ <= land_data[IndexData[key]].pos1[2] && posZ >= land_data[IndexData[key]].pos2[2]));
                if ((posDimid == land_data[IndexData[key]].dimid) && resultX_3D && resultY && resultZ_3D) {
                    return land_data[IndexData[key]];
                }
                break;
            case "2d":
                let resultX = ((posX >= land_data[IndexData[key]].pos1[0] && posX <= land_data[IndexData[key]].pos2[0]) || (posX <= land_data[IndexData[key]].pos1[0] && posX >= land_data[IndexData[key]].pos2[0]));
                let resultZ = ((posZ >= land_data[IndexData[key]].pos1[2] && posZ <= land_data[IndexData[key]].pos2[2]) || (posZ <= land_data[IndexData[key]].pos1[2] && posZ >= land_data[IndexData[key]].pos2[2]));
                if ((posDimid == land_data[IndexData[key]].dimid) && resultX && resultZ) {
                    return land_data[IndexData[key]];
                }
                break;
            //球形圈地系统暂时不做
            case "cylinder":
                //根据两点间的距离进行相应的判断操作
                let distance = Math.pow(posX - land_data[IndexData[key]].pos1[0],2) + Math.pow(posZ - land_data[IndexData[key]].pos1[2],2);
                if (Math.pow(IndexData[key].R,2) >= distance) {
                    return land_data[IndexData[key]];
                }
                break;
        }
    }
    return false;
}

/**
 * 判断玩家坐标对应的区块是否有地皮数据
 * @param {object} player
 */
function player_in_index(player) {
    let land = pos_in_index([player.location.x, player.location.y,player.location.z],player.dimension.id);
    if (land) {
        if (player.id != land.owner) {
            player.onScreenDisplay.setActionBar(`§b您正在 ${land.land_name} §r§b中`);
        } else if (land.setup.ShowActionbar) {
            player.onScreenDisplay.setActionBar(`§a欢迎回到 ${land.land_name} §r§a中！`);
        }
    }
}

/**
 * 根据输入的地皮数据，判断玩家是否在白名单中
 * @param {object} player
 * @returns {boolean}
 */
function in_allowlist(player,target_land) {
    if (target_land.owner == player.id) {
        return true;
    }
    if(target_land.allowlist.hasOwnProperty(player.id)) {
        return true;
    }
    return false;
}

/**
 * 输入坐标范围信息，以及当前的索引值数据，判断地皮有没有重合
 * @param {Array} pos1
 * @param {Array} pos2
 * @param {number} dimid
 */
function have_land(pos1, pos2, dimid) {
    //首先根据输入的地皮坐标构建最大/最小的坐标
    //这里规定最小的坐标为pos1，最大的坐标为pos2
    if (pos1[0] > pos2[0]) {
        let posXMin = pos1[0];
        pos1[0] = pos2[0];
        pos2[0] = posXMin;
    }
    if (pos1[1] > pos2[1]) {
        let posYMin = pos1[1];
        pos1[1] = pos2[1];
        pos2[1] = posYMin;
    }
    if (pos1[2] > pos2[2]) {
        let posZMin = pos1[2];
        pos1[2] = pos2[2];
        pos2[2] = posZMin;
    }
    //根据传入的最小值坐标输出最小
    let XIndexMIN = parseInt(pos1[0] / 16);
    let ZIndexMIN = parseInt(pos1[2] / 16);
    //
    let XIndexMAX = parseInt(pos2[0] / 16);
    let ZIndexMAX = parseInt(pos2[2] / 16);
    //判断该区块内是否有地皮数据，根据数据层层判断
    for (let XIndex = XIndexMIN; XIndex <= XIndexMAX; XIndex++) {
        for (let ZIndex = ZIndexMIN; ZIndex <= ZIndexMAX; ZIndex++) {
            //判断该索引值下地皮是否有地皮数据
            if(land_index[dimid] && land_index[dimid][XIndex] && land_index[dimid][XIndex][ZIndex]) {
                //如果走到了这里说明，该区块编号下有相应的地皮数据存在，然后遍历该区块存在的地皮即可
                let this_index_data = land_index[dimid][XIndex][ZIndex];
                //定义一些变量
                let pos3 = [];
                let pos4 = [];
                let result_x = false;
                let result_y = false;
                let result_z = false;
                for (let key = 0;key < this_index_data.length;key++) {
                    //根据相应的地皮类型进行计算
                    switch (land_data[this_index_data[key]].type) {
                        case "3d":
                            //首先根据输入的地皮坐标构建最大/最小的坐标
                            //这里规定最小的坐标为pos3，最大的坐标为pos4
                            pos3 = land_data[this_index_data[key]].pos1
                            pos4 = land_data[this_index_data[key]].pos2
                            if (pos3[0] > pos4[0]) {
                                let posXMin = pos3[0];
                                pos3[0] = pos4[0];
                                pos4[0] = posXMin;
                            }
                            if (pos3[1] > pos4[1]) {
                                let posYMin = pos3[1];
                                pos3[1] = pos4[1];
                                pos3[1] = posYMin;
                            }
                            if (pos3[2] > pos4[2]) {
                                let posZMin = pos3[2];
                                pos3[2] = pos4[2];
                                pos3[2] = posZMin;
                            }
                            //为保证部分功能正常取消等于情况
                            //x轴方向线段重合结果，没有重合为true，有重合为false
                            result_x = (pos1[0] > pos4[0]) || (pos2[0] < pos3[0]);
                            //y轴方向线段重合结果，没有重合为true，有重合为false
                            result_y = (pos1[1] > pos4[1]) || (pos2[1] < pos3[1]);
                            //z轴方向线段重合结果，没有重合为true，有重合为false
                            result_z = (pos1[2] > pos4[2]) || (pos2[2] < pos3[2]);
                            //如果重合，那么x轴方向和z轴方向投影线段一定有重合，两者缺一不可,并且y轴方向也要重合
                            if (dimid == land_data[this_index_data[key]].dimid && !result_x && !result_y && !result_z) {
                                return true;
                            }
                            break;
                        case "2d":
                            //首先根据输入的地皮坐标构建最大/最小的坐标
                            pos3 = land_data[this_index_data[key]].pos1
                            pos4 = land_data[this_index_data[key]].pos2
                            if (pos3[0] > pos4[0]) {
                                let posXMin = pos3[0];
                                pos3[0] = pos4[0];
                                pos4[0] = posXMin;
                            }
                            if (pos3[2] > pos4[2]) {
                                let posZMin = pos3[2];
                                pos3[2] = pos4[2];
                                pos3[2] = posZMin;
                            }
                            //为保证部分功能正常取消等于情况
                            //x轴方向线段重合结果，没有重合为true，有重合为false
                            result_x = (pos1[0] > pos4[0]) || (pos2[0] < pos3[0]);
                            //z轴方向线段重合结果，没有重合为true，有重合为false
                            result_z = (pos1[2] > pos4[2]) || (pos2[2] < pos3[2]);
                            //如果重合，那么x轴方向和z轴方向投影线段一定有重合，两者缺一不可
                            if (dimid == land_data[this_index_data[key]].dimid && !result_x && !result_z) {
                                return true;
                            }
                            break;
                        case "cylinder":
                            //根据两点间的距离进行相应的判断操作
                    }
                }
            }
        }
    }
    return false;
}

//圈地相关API
const LandAPI = {
    /**
     * 圈地的时候显示的actionbar
     * @param {object} player
     * @param {Array} pos1
     * @param {Array} pos2
     * @param {Array} dimid
     */
    show_actionbar(player,pos1,pos2,dimid) {
        if (pos1.length == 0) {
            pos1 = "未选择相应框选点";
        } else {
            pos1 = `(${pos1[0]},${pos1[1]},${pos1[2]})`;
        }
        if (pos2.length == 0) {
            pos2 = "未选择相应框选点";
        } else {
            pos2 = `(${pos2[0]},${pos2[1]},${pos2[2]})`;
        }

        switch (dimid) {
            case -1:
                dimid = "未选择相关维度";
                break;
            case "minecraft:overworld":
                dimid = "主世界";
                break;
            case "minecraft:nether":
                dimid = "下界";
                break;
            case "minecraft:the_end":
                dimid = "末地";
                break;
        }
        player.onScreenDisplay.setActionBar(`§e当前框选点1： §c${pos1}\n§e当前框选点2： §c${pos2}\n§e当前维度： §c${dimid}`);
    },


     /**
     * 圈地的时候开始显示actionbar
     * @param {object} player
     * @param {Array} pos1
     * @param {Array} pos2
     * @param {Array} dimid
     */
    start_show_actionbar(player,pos1,pos2,dimid) {
        return system.runInterval(() => {
            this.show_actionbar(player,pos1,pos2,dimid);
        },10)
    },

    /**
     * 圈地的时候停止显示actionbar
     * @param {object} player
     */
    stop_show_actionbar(player){
        if (taskid.actionbar.hasOwnProperty(player.id)) {
            system.clearRun(taskid.actionbar[player.id]);
            //删除相应的taskid
            delete taskid.actionbar[player.id];
        }
    },

    show_particle(player,pos1,pos2,dimid) {
        //判断pos1是否为空，如果为空则不显示粒子
        try {
            if (pos1.length != 0) {
                RunCmd(`tickingarea add circle ${pos1[0]} ${pos1[1]} ${pos1[2]} 3 p1_${player.id}`);
                world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:pos1[0],y:pos1[1],z:pos1[2]});
            }
            //判断pos2是否为空，如果为空则不显示粒子
            if (pos2.length != 0) {
                RunCmd(`tickingarea add circle ${pos2[0]} ${pos2[1]} ${pos2[2]} 3 p2_${player.id}`);
                world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:pos2[0],y:pos2[1],z:pos2[2]});
            }
            //如果pos1和pos2都不为空，则显示边框粒子
            if (pos1.length != 0 && pos2.length != 0) {
                //在此之前先对坐标进行处理
                let X1 = pos1[0];
                let Y1 = pos1[1];
                let Z1 = pos1[2];
                let X2 = pos2[0];
                let Y2 = pos2[1];
                let Z2 = pos2[2];
                //重新生成两个变量smallpos和bigpos，用于存储两个坐标中较小的坐标和较大的坐标
                let smallpos = [];
                let bigpos = [];
                //首先判断X坐标
                if (X1 > X2) {
                    smallpos[0] = X2;
                    bigpos[0] = X1;
                } else {
                    smallpos[0] = X1;
                    bigpos[0] = X2;
                }
                //然后判断Y坐标
                if (Y1 > Y2) {
                    smallpos[1] = Y2;
                    bigpos[1] = Y1;
                } else {
                    smallpos[1] = Y1;
                    bigpos[1] = Y2;
                }
                //然后判断Z坐标
                if (Z1 > Z2) {
                    smallpos[2] = Z2;
                    bigpos[2] = Z1;
                } else {
                    smallpos[2] = Z1;
                    bigpos[2] = Z2;
                }
                //从smallpos到bigpos是一个长方体，生成六条边框的粒子
                //每个粒子间距由该长方体边框总长决定的，一共有64个粒子均匀的分布在边框上
                //首先计算出每个边框的长度
                let XLength = bigpos[0] - smallpos[0];
                let YLength = bigpos[1] - smallpos[1];
                let ZLength = bigpos[2] - smallpos[2];
                //然后计算出边框总长
                let Length = XLength * 4 + YLength * 4 + ZLength * 4;
                //然后计算出每个粒子间距
                let Interval = Length / 200;
                //然后生成四个长边框，每个粒子间距为Interval
                for (let i = smallpos[0]; i <= bigpos[0]; i=i+Interval) {
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:i,y:smallpos[1],z:smallpos[2]});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:i,y:smallpos[1],z:bigpos[2]});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:i,y:bigpos[1],z:smallpos[2]});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:i,y:bigpos[1],z:bigpos[2]});
                }
                //然后生成四个高边框，每个粒子间距为Interval
                for (let i = smallpos[1]; i <= bigpos[1]; i=i+Interval) {
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:smallpos[0],y:i,z:smallpos[2]});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:smallpos[0],y:i,z:bigpos[2]});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:bigpos[0],y:i,z:smallpos[2]});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:bigpos[0],y:i,z:bigpos[2]});
                }
                //最后生成四个宽边框，每个粒子间距为Interval
                for (let i = smallpos[2]; i <= bigpos[2]; i=i+Interval) {
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:smallpos[0],y:smallpos[1],z:i});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:smallpos[0],y:bigpos[1],z:i});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:bigpos[0],y:smallpos[1],z:i});
                    world.getDimension(dimid).spawnParticle("minecraft:balloon_gas_particle",{x:bigpos[0],y:bigpos[1],z:i});
                }
            }
        }  catch (error) {
            RunCmd(`title "${player.name}" title §c`);
            RunCmd(`title "${player.name}" subtitle §c§l您选择的圈地范围过大，无法完全显示所有预览框架！`);
        }
    },

    start_show_particle(player,pos1,pos2,dimid) {
        return system.runInterval(() => {
            this.show_particle(player,pos1,pos2,dimid);
        },10)
    },

    stop_show_particle(player){
        if (taskid.particle.hasOwnProperty(player.id)) {
            system.clearRun(taskid.particle[player.id]);
            //删除相应的taskid
            delete taskid.particle[player.id];
            //删除相应的tickingarea
            RunCmd(`tickingarea remove p1_${player.id}`);
            RunCmd(`tickingarea remove p2_${player.id}`);
        }
    }
}

//玩家GUI表现
const GUI = {
    Main(player) {
        const MainForm = new ActionFormData()
        .title("圈地系统")
        .body("§e欢迎使用圈地系统！\n在这里您可以购买、管理您的地皮！")
        .button("管理已有地皮")
        .button("购买出售中地皮")
        .button("开始自由圈地")
        .button("取出下线后收益")
        .button("返回上一级")
        .show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        this.ManageLand(player);
                        break;
                    case 1:
                        this.LandMarket(player);
                        break;
                    case 2:
                        this.CreateLand(player);
                        break;
                    case 3:
                        this.GetOfflineMoney(player);
                        break;
                    case 4:
                        Main(player);
                        break;

                }
            }
        })
    },

    //管理已有地皮
    ManageLand(player) {
        let own_land_data = [];
        const ManageLandForm = new ActionFormData()
        .title("管理地皮")
        .body("§e在这里您可以管理您的地皮！")
        ManageLandForm.button("返回上一级")
        for (let key in land_data) {
            if (land_data[key].owner == player.id) {
                ManageLandForm.button(`[${key}] ${land_data[key].land_name} \n[是否上架市场售卖] ${land_data[key].on_sale} [地皮类型] ${land_data[key].type}`);
                own_land_data.push(key);
            }
        }
        ManageLandForm.show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        this.Main(player);
                        break;
                    default:
                        for (let i = 0; i < own_land_data.length; i++) {
                            if (response.selection == i + 1) {
                                this.ManageLandDetail(player,own_land_data[i]);
                                break;
                            }
                        }
                        break;
                }
            }
        })
    },

    ManageLandDetail(player,LandUUID) {
        const ManageLandDetailForm = new ActionFormData()
        .title(`管理[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .body("§e在这里您可以管理您的地皮！")
        .button("返回上一级")
        .button("地皮管理")
        .button("回收（摧毁）地皮")
        .button("转让地皮至其他玩家")
        .button("管理地皮上架状态")
        .button("(dev)设置地皮传送点")
        .button("管理白名单")
        .show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        this.ManageLand(player);
                        break;
                    case 1:
                        this.ManageLandPermission(player,LandUUID);
                        break;
                    case 2:
                        this.ManageLandRecycle(player,LandUUID);
                        break;
                    case 3:
                        this.ManageLandTransfer(player,LandUUID);
                        break;
                    case 4:
                        this.ManageLandOnSale(player,LandUUID);
                        break;
                    case 5:
                        player.sendMessage("§c>> 该功能正在开发中，敬请期待！");
                        //this.ManageLandSetTeleport(player,LandUUID);
                        break;
                    case 6:
                        this.ManageLandAllowlist(player,LandUUID);
                        break;
                }
            }
        })
    },

    ManageLandPermission(player,LandUUID) {
        const ManageLandPermissionForm = new ModalFormData()
        .title(`权限管理[${LandUUID}] ${land_data[LandUUID].land_name}`)
            .textField("地皮名称","请尽量简短！",land_data[LandUUID].land_name)
            .toggle("其他玩家可以摧毁方块",land_data[LandUUID].setup.DestroyBlock)
            .toggle("其他玩家可以放置方块",land_data[LandUUID].setup.PlaceBlock)
            .toggle("其他玩家可以使用物品",land_data[LandUUID].setup.UseItem)
            .toggle("（暂时没用）",land_data[LandUUID].setup.AttackEntity)
            .toggle("其他玩家可以打开箱子",land_data[LandUUID].setup.OpenChest)
            .toggle("自己处于地皮内时显示标题",land_data[LandUUID].setup.ShowActionbar)
            .show(player).then((response) => {
                if (!response.canceled) {
                    //先判断地皮名称是否为空
                    if (response.formValues[0] == "") {
                        player.sendMessage("§c>> 地皮名称不能为空！");
                        return;
                    }
                    let old_land_data = JSON.parse(JSON.stringify(land_data));
                    land_data[LandUUID].land_name = response.formValues[0];
                    land_data[LandUUID].setup.DestroyBlock = response.formValues[1];
                    land_data[LandUUID].setup.PlaceBlock = response.formValues[2];
                    land_data[LandUUID].setup.UseItem = response.formValues[3];
                    land_data[LandUUID].setup.AttackEntity = response.formValues[4];
                    land_data[LandUUID].setup.OpenChest = response.formValues[5];
                    land_data[LandUUID].setup.ShowActionbar = response.formValues[6];
                    //开始覆写文件land.json
                    fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                        if (result === "success") {
                            player.sendMessage("§a>> 地皮权限修改成功！");
                        } else if (result === "-1") {
                            player.sendMessage("§c>> 服务器连接失败，请联系在线管理员！");
                            land_data = old_land_data;
                        } else {
                            player.sendMessage("§c>> 未知错误，请联系在线管理员！");
                            land_data = old_land_data;
                        }
                    })

                } else {
                    this.ManageLandDetail(player,LandUUID);
                }
            })
    },

    ManageLandRecycle(player,LandUUID) {
        const ManageLandRecycleForm = new MessageFormData()
        .title(`回收地皮[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .body(`§c您确定要以 §l${parseInt(land_data[LandUUID].purchase_price * 0.6)} §r§c回收该地皮吗？\n§e回收地皮后将无法恢复！`)
        .button1("§a确定回收")
        .button2("§c取消回收")
        .show(player).then((response) => {
            if (!response.canceled) {
                if (response.selection == 0) {
                    //开始回收地皮
                    let old_land_data = JSON.parse(JSON.stringify(land_data));
                    delete land_data[LandUUID];
                    //开始覆写文件land.json
                    fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                        if (result === "success") {
                            player.sendMessage("§a>> 地皮回收成功！");
                            //开始退款
                            world.scoreboard.getObjective("money").addScore(player,parseInt(land_data[LandUUID].purchase_price * 0.6));
                        } else if (result === "-1") {
                            player.sendMessage("§c>> 服务器连接失败，请联系在线管理员！");
                            land_data = old_land_data;
                        } else {
                            player.sendMessage("§c>> 未知错误，请联系在线管理员！");
                            land_data = old_land_data;
                        }
                    })
                } else if (response.selection == 1) {
                    player.sendMessage("§c>> 您已取消回收地皮！");
                }
            } else {
                this.ManageLandDetail(player,LandUUID);
            }
        })
    },

    ManageLandTransfer(player,LandUUID) {
        //首先获取所有在线玩家的对象
        let players = world.getPlayers();
        //然后获取所有在线玩家的名称
        let players_name = ["-未选择任何玩家-"];
        for (let i = 0; i < players.length; i++) {
            players_name.push(players[i].name);
        }
        const ManageLandTransferForm = new ModalFormData()
        .title(`转让地皮[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .dropdown("请选择要转让的玩家",players_name)
        .show(player).then((response) => {
            if (!response.canceled) {
                if (response.formValues[0] == 0) {
                    player.sendMessage("§c>> 您未选择任何玩家！");
                    return;
                }
                //开始转让地皮
                let old_land_data = JSON.parse(JSON.stringify(land_data));
                //首先获取要转让的玩家对象
                land_data[LandUUID].owner = players[response.formValues[0] - 1].id;
                land_data[LandUUID].owner_name = players[response.formValues[0] - 1].name;
                //开始覆写文件land.json
                fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                    if (result === "success") {
                        player.sendMessage("§a>> 地皮转让成功！");
                    } else if (result === "-1") {
                        player.sendMessage("§c>> 服务器连接失败，请联系在线管理员！");
                        land_data = old_land_data;
                    } else {
                        player.sendMessage("§c>> 未知错误，请联系在线管理员！");
                        land_data = old_land_data;
                    }
                })
            } else {
                this.ManageLandDetail(player,LandUUID);
            }
        })
    },

    ManageLandOnSale(player,LandUUID) {
        const ManageLandOnSaleForm = new ModalFormData()
        .title(`上架地皮 [${LandUUID}] ${land_data[LandUUID].land_name} 至市场`)
        .toggle("是否上架",land_data[LandUUID].on_sale)
        .textField("上架价格","请输入一个正整数",(land_data[LandUUID].sale_price || land_data[LandUUID].purchase_price).toString())
        .textField("地皮名字","请尽量简短！",land_data[LandUUID].land_name)
        .textField("地皮描述","请尽量简短！",(land_data[LandUUID].land_description || "这是一块地皮..."))
        .show(player).then((response) => {
            if (!response.canceled) {
                //判断价格是否为空
                if (response.formValues[1] == "") {
                    player.sendMessage("§c>> 价格不能为空！");
                    return;
                }
                //再判断价格是否为数字
                if (isNaN(parseInt(response.formValues[1]))) {
                    player.sendMessage("§c>> 价格必须为正整数！");
                    return;
                }
                //判断地皮名称是否为空
                if (response.formValues[2] == "") {
                    player.sendMessage("§c>> 地皮名称不能为空！");
                    return;
                }
                //判断地皮描述是否为空
                if (response.formValues[3] == "") {
                    player.sendMessage("§c>> 地皮描述不能为空！");
                    return;
                }
                //开始上架地皮
                let old_land_data = JSON.parse(JSON.stringify(land_data));
                land_data[LandUUID].on_sale = response.formValues[0];
                land_data[LandUUID].sale_price = Math.abs(parseInt(response.formValues[1]));
                land_data[LandUUID].land_name = response.formValues[2];
                land_data[LandUUID].land_description = response.formValues[3];
                //开始覆写文件land.json
                fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                    if (result === "success") {
                        if (land_data[LandUUID].on_sale) {
                            player.sendMessage(`§a>> 地皮上架成功！您的地皮已上架至市场，售价为 §l${land_data[LandUUID].sale_price} §r§a金币！在地皮售出前权限不会发生任何变化！`);
                        } else {
                            player.sendMessage("§a>> 地皮下架成功！您的地皮已下架！");
                        }
                    } else if (result === "-1") {
                        player.sendMessage("§c>> 服务器连接失败，请联系在线管理员！");
                        land_data = old_land_data;
                    } else {
                        player.sendMessage("§c>> 未知错误，请联系在线管理员！");
                        land_data = old_land_data;
                    }
                })
            } else {
                this.ManageLandDetail(player,LandUUID);
            }
        })
    },

    ManageLandSetTeleport(player,LandUUID) {

    },

    ManageLandAllowlist(player,LandUUID) {
        //首先获取所有白名单玩家的对象
        let allowlist_players = [];
        for (let key in land_data[LandUUID].allowlist) {
            allowlist_players.push(allowlist_players[key]);
        }
        const ManageLandAllowlistForm = new ActionFormData()
        .title(`白名单管理[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .body(`§e在这里您可以管理您的地皮白名单！\n${"您当前地皮的白名单玩家有：\n" + allowlist_players.join("、")}`)
        .button("返回上一级")
        .button("添加白名单")
        .button("删除白名单")
        .show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        this.ManageLandDetail(player,LandUUID);
                        break;
                    case 1:
                        this.ManageLandAllowlistAdd(player,LandUUID);
                        break;
                    case 2:
                        this.ManageLandAllowlistDelete(player,LandUUID);
                        break;
                }
            } else {
                this.ManageLandDetail(player,LandUUID);
            }
        })
    },

    ManageLandAllowlistAdd(player,LandUUID) {
        //首先获取所有在线玩家的对象
        let players = world.getPlayers();
        //然后获取所有在线玩家的名称
        let players_name = ["-未选择任何玩家-"];
        for (let i = 0; i < players.length; i++) {
            players_name.push(players[i].name);
        }
        const ManageLandAllowlistAddForm = new ModalFormData()
        .title(`添加白名单[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .dropdown("请选择要添加的玩家",players_name)
        .show(player).then((response) => {
            if (!response.canceled) {
                if (response.formValues[0] == 0) {
                    player.sendMessage("§c>> 您未选择任何玩家！");
                    return;
                }
                //开始添加白名单
                let old_land_data = JSON.parse(JSON.stringify(land_data));
                //首先获取要添加的玩家对象
                land_data[LandUUID].allowlist[players[response.formValues[0] - 1].id] = players[response.formValues[0] - 1].name;
                //开始覆写文件land.json
                fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                    if (result === "success") {
                        player.sendMessage(`§a>> 您已将玩家 §l§e${players[response.formValues[0] - 1].name} §r§a成功添加至地皮§e ${land_data[LandUUID].land_name} §a的白名单！`);
                    } else if (result === "-1") {
                        player.sendMessage("§c>> 服务器连接失败，请联系在线管理员！");
                        land_data = old_land_data;
                    } else {
                        player.sendMessage("§c>> 未知错误，请联系在线管理员！");
                        land_data = old_land_data;
                    }
                })
            } else {
                this.ManageLandAllowlist(player,LandUUID);
            }
        })
    },

    ManageLandAllowlistDelete(player,LandUUID) {
        //首先获取所有在线玩家的对象
        let players = world.getPlayers();
        //然后获取所有在线玩家的名称
        let players_name = ["-未选择任何玩家-"];
        for (let i = 0; i < players.length; i++) {
            players_name.push(players[i].name);
        }
        const ManageLandAllowlistDeleteForm = new ModalFormData()
        .title(`删除白名单[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .dropdown("请选择要删除的玩家",players_name)
        .show(player).then((response) => {
            if (!response.canceled) {
                if (response.formValues[0] == 0) {
                    player.sendMessage("§c>> 您未选择任何玩家！");
                    return;
                }
                //开始删除白名单
                let old_land_data = JSON.parse(JSON.stringify(land_data));
                //首先获取要删除的玩家对象
                delete land_data[LandUUID].allowlist[players[response.formValues[0] - 1].id];
                //开始覆写文件land.json
                fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                    if (result === "success") {
                        player.sendMessage(`§a>> 您已将玩家 §l§e${players[response.formValues[0] - 1].name} §r§a成功从地皮§e ${land_data[LandUUID].land_name} §a的白名单中删除！`);
                    } else if (result === "-1") {
                        player.sendMessage("§c>> 服务器连接失败，请联系在线管理员！");
                        land_data = old_land_data;
                    } else {
                        player.sendMessage("§c>> 未知错误，请联系在线管理员！");
                        land_data = old_land_data;
                    }
                })
            } else {
                this.ManageLandAllowlist(player,LandUUID);
            }
        })
    },

    //购买出售中地皮
    LandMarket(player) {
        let on_sale_land_data = [];
        const LandMarketForm = new ActionFormData()
        .title("购买出售中地皮")
        .body("§e在这里您可以购买出售中的地皮！")
        LandMarketForm.button("返回上一级")
        for (let key in land_data) {
            if (land_data[key].on_sale == true) {
                LandMarketForm.button(`[${key}] ${land_data[key].land_name} \n价格：${land_data[key].sale_price} 金币`);
                on_sale_land_data.push(key);
            }
        }
        LandMarketForm.show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        this.Main(player);
                        break;
                    default:
                        for (let i = 0; i < on_sale_land_data.length; i++) {
                            if (response.selection == i + 1) {
                                this.LandMarketDetail(player,on_sale_land_data[i]);
                                break;
                            }
                        }
                        break;
                }
            } else {
                this.Main(player);
            }
        })
    },

    LandMarketDetail(player,LandUUID) {
        const LandMarketDetailForm = new ActionFormData()
        .title(`购买[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .body(`§e地皮类型：${land_data[LandUUID].type}\n地皮描述：${land_data[LandUUID].land_description}\n地皮拥有者：${land_data[LandUUID].owner_name}\n地皮价格：${land_data[LandUUID].sale_price} 金币\n地皮坐标：(${land_data[LandUUID].pos1[0]},${land_data[LandUUID].pos1[1]},${land_data[LandUUID].pos1[2]}) - (${land_data[LandUUID].pos2[0]},${land_data[LandUUID].pos2[1]},${land_data[LandUUID].pos2[2]})\n§c购买地皮后将无法退款！`)
        .button("返回上一级")
        .button("购买地皮")
        .show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        this.LandMarket(player);
                        break;
                    case 1:
                        this.LandMarketBuy(player,LandUUID);
                        break;
                }
            } else {
                this.LandMarket(player);
            }
        })
    },

    LandMarketBuy(player,LandUUID) {
        const LandMarketBuyForm = new MessageFormData()
        .title(`购买[${LandUUID}] ${land_data[LandUUID].land_name}`)
        .body(`§c您确定要以 §l${land_data[LandUUID].sale_price} §r§c购买该地皮吗？\n§e购买地皮后将无法退款！`)
        .button1("§a确定购买")
        .button2("§c取消购买")
        .show(player).then((response) => {
            if (!response.canceled) {
                if (response.selection == 0) {
                    //开始购买地皮
                    let old_land_data = JSON.parse(JSON.stringify(land_data));
                    land_data[LandUUID].owner = player.id;
                    land_data[LandUUID].owner_name = player.name;
                    land_data[LandUUID].on_sale = false;
                    //首先判断玩家余额是否足够
                    if (world.scoreboard.getObjective("money").getScore(player) < land_data[LandUUID].sale_price) {
                        player.sendMessage(`§c>> 您的余额不足！您当前余额为：${world.scoreboard.getObjective("money").getScore(player)}，而该地皮的价格为：${land_data[LandUUID].sale_price}`);
                        return;
                    }
                    //开始覆写文件land.json
                    fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                        if (result === "success") {
                            //开始给予地皮拥有者金币
                            let old_temp_player_money = JSON.parse(JSON.stringify(temp_player_money));
                            temp_player_money[old_land_data[LandUUID].owner] = land_data[LandUUID].sale_price;
                            fs.OverwriteJsonFile("land_temp_player_money.json",temp_player_money).then((result) => {
                                if (result === "success") {
                                    player.sendMessage("§a>> 地皮购买成功！");
                                    //开始扣款
                                    world.scoreboard.getObjective("money").addScore(player,-land_data[LandUUID].sale_price);
                                } else {
                                    this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","MainfForm");
                                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                                    temp_player_money = old_temp_player_money;
                                }
                            })
                        } else if (result === "-1") {
                            player.sendMessage("§c>> 服务器连接失败，请联系在线管理员！");
                            land_data = old_land_data;
                        } else {
                            player.sendMessage("§c>> 未知错误，请联系在线管理员！");
                            land_data = old_land_data;
                        }
                    })
                } else if (response.selection == 1) {
                    player.sendMessage("§c>> 您已取消购买地皮！");
                }
            } else {
                this.LandMarketDetail(player,LandUUID);
            }
        })
    },

    //开始自由圈地
    CreateLand(player) {
        const CreateLandForm = new ActionFormData()
        .title("创建地皮")
        .body("§c地皮维度将为您设置的最后一个框选点坐标所在维度作为地皮维度")
        .button("设置框选点1")
        .button("设置框选点2")
        .button("手动改变圈地坐标")
        .button("确认圈地范围")
        .button("退出圈地系统")
        .show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        //首先取消当前的actionbar
                        LandAPI.stop_show_actionbar(player);
                        LandAPI.stop_show_particle(player);
                        //首先检查有没有历史数据
                        if (land_history.hasOwnProperty(player.id)) {
                            //开始写入历史数据
                            land_history[player.id].pos1 = [parseInt(player.location.x),parseInt(player.location.y),parseInt(player.location.z)];
                            land_history[player.id].dimid = player.dimension.id;
                            //有历史数据则恢复
                            taskid.actionbar[player.id] = LandAPI.start_show_actionbar(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                            taskid.particle[player.id] = LandAPI.start_show_particle(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                        } else {
                            //没有历史数据则开始初始化历史数据
                            let player_land_history = {};
                            player_land_history.pos1 = [parseInt(player.location.x),parseInt(player.location.y),parseInt(player.location.z)];
                            player_land_history.pos2 = [];
                            player_land_history.type = "";
                            player_land_history.dimid = player.dimension.id;
                            land_history[player.id] = player_land_history;
                            //开始显示actionbar
                            taskid.actionbar[player.id] = LandAPI.start_show_actionbar(player,player_land_history.pos1,player_land_history.pos2,player_land_history.dimid);
                            taskid.particle[player.id] = LandAPI.start_show_particle(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                        }
                        break;
                    case 1:
                        //首先取消当前的actionbar
                        LandAPI.stop_show_actionbar(player);
                        LandAPI.stop_show_particle(player);
                        //首先检查有没有历史数据
                        if (land_history.hasOwnProperty(player.id)) {
                            //开始写入历史数据
                            land_history[player.id].pos2 = [parseInt(player.location.x),parseInt(player.location.y),parseInt(player.location.z)];
                            land_history[player.id].dimid = player.dimension.id;
                            //有历史数据则恢复
                            taskid.actionbar[player.id] = LandAPI.start_show_actionbar(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                            taskid.particle[player.id] = LandAPI.start_show_particle(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                        } else {
                            //没有历史数据则开始初始化历史数据
                            let player_land_history = {};
                            player_land_history.pos1 = [];
                            player_land_history.pos2 = [parseInt(player.location.x),parseInt(player.location.y),parseInt(player.location.z)];
                            player_land_history.type = "";
                            player_land_history.dimid = player.dimension.id;
                            land_history[player.id] = player_land_history;
                            //开始显示actionbar
                            taskid.actionbar[player.id] = LandAPI.start_show_actionbar(player,player_land_history.pos1,player_land_history.pos2,player_land_history.dimid);
                            taskid.particle[player.id] = LandAPI.start_show_particle(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                        }
                        break;
                    case 2:
                        //首先取消当前的actionbar
                        LandAPI.stop_show_actionbar(player);
                        LandAPI.stop_show_particle(player);
                        //首先检查有没有历史数据
                        if (land_history.hasOwnProperty(player.id)) {
                            //有历史数据
                            this.ChangePOS(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                        } else {
                            //没有历史数据则开始初始化历史数据
                            let player_land_history = {};
                            player_land_history.pos1 = [];
                            player_land_history.pos2 = [];
                            player_land_history.type = "";
                            player_land_history.dimid = player.dimension.id;
                            land_history[player.id] = player_land_history;
                            this.ChangePOS(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                        }
                        break;
                    case 3:
                        //首先取消当前的actionbar
                        LandAPI.stop_show_actionbar(player);
                        LandAPI.stop_show_particle(player);
                        this.ChoseLandType(player);
                        break;
                    case 4:
                        LandAPI.stop_show_actionbar(player);
                        LandAPI.stop_show_particle(player);
                        this.Main(player);
                        break;
                }
            } else {
                //取消的时候清除actionbar
                LandAPI.stop_show_actionbar(player);
                LandAPI.stop_show_particle(player);
                player.onScreenDisplay.setActionBar(`§c圈地系统已退出！`);
            }
        })
    },

    //手动改变圈地坐标
    ChangePOS(player,pos1,pos2,dimid) {
        let id = 0;
        //定义表单
        switch (dimid) {
            case "minecraft:overworld":
                id = 0;
                break;
            case "minecraft:nether":
                id = 1;
                break;
            case "minecraft:the_end":
                id = 2;
                break;
        }
        const ChangePOSForm = new ModalFormData()
        ChangePOSForm.title("手动改变圈地坐标")
        ChangePOSForm.dropdown("请选择圈地所在维度",["主世界","下界","末地"],id)
        //这里判断一下pos1和pos2是否为空，如果为空则不显示预置数据
        if (pos1.length == 0) {
            ChangePOSForm.textField("请输入框选点坐标1的X坐标","只能输入数字！");
            ChangePOSForm.textField("请输入框选点坐标1的Y坐标","只能输入数字！");
            ChangePOSForm.textField("请输入框选点坐标1的Z坐标","只能输入数字！");
        } else {
            ChangePOSForm.textField("请输入框选点坐标1的X坐标","只能输入数字！",pos1[0].toString());
            ChangePOSForm.textField("请输入框选点坐标1的Y坐标","只能输入数字！",pos1[1].toString());
            ChangePOSForm.textField("请输入框选点坐标1的Z坐标","只能输入数字！",pos1[2].toString());
        }
        if (pos2.length == 0) {
            ChangePOSForm.textField("请输入框选点坐标2的X坐标","只能输入数字！");
            ChangePOSForm.textField("请输入框选点坐标2的Y坐标","只能输入数字！");
            ChangePOSForm.textField("请输入框选点坐标2的Z坐标","只能输入数字！");
        } else {
            ChangePOSForm.textField("请输入框选点坐标2的X坐标","只能输入数字！",pos2[0].toString());
            ChangePOSForm.textField("请输入框选点坐标2的Y坐标","只能输入数字！",pos2[1].toString());
            ChangePOSForm.textField("请输入框选点坐标2的Z坐标","只能输入数字！",pos2[2].toString());
        }
        ChangePOSForm.show(player).then((response) => {
            if (response.canceled) {
                this.CreateLand(player);
            } else {
                //判断是否输入了坐标
                if (response.formValues[1] == "" || response.formValues[2] == "" || response.formValues[3] == "" || response.formValues[4] == "" || response.formValues[5] == "" || response.formValues[6] == "") {
                    player.sendMessage("§c您输入的坐标不完整！请重新输入！");
                    this.ChangePOS(player,pos1,pos2,dimid);
                    return;
                }
                //判断输入的坐标是否为数字
                if (isNaN(response.formValues[1]) || isNaN(response.formValues[2]) || isNaN(response.formValues[3]) || isNaN(response.formValues[4]) || isNaN(response.formValues[5]) || isNaN(response.formValues[6])) {
                    player.sendMessage("§c您输入的坐标不是数字！请重新输入！");
                    this.ChangePOS(player,pos1,pos2,dimid);
                    return;
                }
                //根据输入的坐标写入历史数据，并将坐标化为整数
                land_history[player.id].pos1 = [parseInt(response.formValues[1]),parseInt(response.formValues[2]),parseInt(response.formValues[3])];
                land_history[player.id].pos2 = [parseInt(response.formValues[4]),parseInt(response.formValues[5]),parseInt(response.formValues[6])];
                //再次改变维度id
                switch (response.formValues[0]) {
                    case 0:
                        land_history[player.id].dimid = "minecraft:overworld";
                        break;
                    case 1:
                        land_history[player.id].dimid = "minecraft:nether";
                        break;
                    case 2:
                        land_history[player.id].dimid = "minecraft:the_end";
                        break;
                }
                //开始显示actionbar
                taskid.actionbar[player.id] = LandAPI.start_show_actionbar(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
                taskid.particle[player.id] = LandAPI.start_show_particle(player,land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid);
            }
        })
    },

    //选择地皮类型
    ChoseLandType(player) {
        const CreateLandForm = new ActionFormData()
        .title("选择地皮类型")
        .button("2D类型地皮\n§9直上直下的地皮，最安全")
        .button("3D类型地皮\n§9按照提供的坐标，最实惠")
        .show(player).then((response) => {
            if (!response.canceled) {
                switch (response.selection) {
                    case 0:
                        this.Create2DLand(player);
                        break;
                    case 1:
                        this.Create3DLand(player);
                        break;
                }
            }
        })
    },

    Create2DLand(player) {
        //首先计算面积是否符合规定
        //2d类型只计算xz面积
        let XLength = Math.abs(land_history[player.id].pos1[0] - land_history[player.id].pos2[0]);
        let ZLength = Math.abs(land_history[player.id].pos1[2] - land_history[player.id].pos2[2]);
        //如果地皮过小
        if (XLength * ZLength < 64) {
            player.sendMessage("§c您选择的地皮面积过小！请重新选择！");
            return;
        }
        //如果地皮过大
        if (XLength * ZLength > 1024) {
            player.sendMessage("§c您选择的地皮面积过大！请重新选择！");
            return;
        }
        //如果地皮坐标不在限制的坐标范围内
        if (land_history[player.id].pos1[0] < -5000 || land_history[player.id].pos1[0] > 5000 || land_history[player.id].pos1[2] < -5000 || land_history[player.id].pos1[2] > 5000 || land_history[player.id].pos2[0] < -5000 || land_history[player.id].pos2[0] > 5000 || land_history[player.id].pos2[2] < -5000 || land_history[player.id].pos2[2] > 5000) {
            player.sendMessage("§c您选择的地皮坐标不在限制的坐标范围内！请重新选择！");
            return;
        }
        //开始判断地皮是否重合
        if (have_land(land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid)) {
            player.sendMessage("§c您选择的地皮与已有地皮重合！请重新选择！");
            return;
        }
        //开始计算价格
        let purchase_price = XLength * ZLength * 30;
        //弹出购买确认表单
        const CreateLandForm = new MessageFormData()
        .title("确认购买")
        .body(`§e您选择的地皮面积为：§c${XLength * ZLength}§e方块\n§e您选择的地皮价格为：§c${purchase_price}§e金币\n§e您的金币余额为：§c${GetScore("money",player.nameTag)}§e金币\n§e请确认您的购买！`)
        .button1(`§a确认购买`)
        .button2(`§c取消购买`)
        .show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("§c您已取消购买！");
            } else if (response.selection == 0) {
                //首先判断余额是否足够
                if (GetScore("money",player.nameTag) < purchase_price) {
                    player.sendMessage("§c您的金币余额不足！请充值后再购买！");
                    return;
                }
                //再判断该玩家已经拥有了几块地皮，如果超出5块则不允许购买
                let land_num = 0;
                for (let Land in land_data) {
                    if (land_data[Land].owner == player.id) {
                        land_num++;
                    }
                }
                if (land_num >= 5) {
                    player.sendMessage("§c您已经拥有了5块地皮！请先出售一些地皮后再购买！");
                    return;
                }
                //开始连接服务器
                let old_land_data = JSON.parse(JSON.stringify(land_data));
                //开始初始化新的地皮数据
                let new_land_data = {};
                new_land_data.owner = player.id;
                new_land_data.owner_name = player.nameTag;
                new_land_data.pos1 = land_history[player.id].pos1;
                new_land_data.pos2 = land_history[player.id].pos2;
                new_land_data.dimid = land_history[player.id].dimid;
                new_land_data.type = "2d";
                new_land_data.purchase_price = purchase_price;
                new_land_data.on_sale = false;
                new_land_data.get_time = GetTime();
                new_land_data.land_name = player.nameTag + "的地皮";
                new_land_data.allowlist = {};
                new_land_data.banlist = [];
                new_land_data.teleport = [];
                new_land_data.setup = {
                    "DestroyBlock":false,
                    "PlaceBlock":false,
                    "UseItem":false,
                    "AttackEntity":false,
                    "OpenChest":false,
                    "Expoplosion": false,
                    "ShowActionbar":true
                }
                land_data[adler32(GetTime() + player.id + purchase_price)] = new_land_data;
                //开始写入数据
                fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                    if (result === "success") {
                        player.sendMessage("§e>> 购买成功！您已经拥有该地皮,该地皮id为：§c" + adler32(GetTime() + player.id + purchase_price) + "§e！");
                        RunCmd(`title ${player.nameTag} title §e§l购买圈地成功！`);
                        RunCmd(`title ${player.nameTag} subtitle §a您还可以购买 §c${5 - land_num - 1}§a 块地皮！`);
                        //扣除玩家金币
                        world.scoreboard.getObjective("money").addScore(player,-purchase_price);
                        //计算索引值
                        calculate_index(land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid,adler32(GetTime() + player.id + purchase_price));
                    } else if (result === -1) {
                        //服务器连接超时提醒
                        player.sendMessage("§c>> 服务器连接失败！请联系在线管理员！");
                        console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                        land_data = old_land_data;
                    } else {
                        //未知错误提醒
                        player.sendMessage("§c>> 未知错误！请联系在线管理员！");
                        land_data = old_land_data;
                    }
                })
            } else {
                player.sendMessage("§c>> 购买失败！您已取消购买！");
            }
        })



    },

    //创建3d地皮
    Create3DLand(player) {
        //首先计算面积是否符合规定
        //3d类型计算xyz面积
        let XLength = Math.abs(land_history[player.id].pos1[0] - land_history[player.id].pos2[0]);
        let YLength = Math.abs(land_history[player.id].pos1[1] - land_history[player.id].pos2[1]);
        let ZLength = Math.abs(land_history[player.id].pos1[2] - land_history[player.id].pos2[2]);
        //如果地皮过小
        if (XLength * YLength * ZLength < 64) {
            player.sendMessage("§c您选择的地皮体积过小！请重新选择！");
            return;
        }
        //如果地皮过大
        if (XLength * YLength * ZLength > 1000000) {
            player.sendMessage("§c您选择的地皮体积过大！请重新选择！");
            return;
        }
        //如果地皮坐标不在限制的坐标范围内
        if (land_history[player.id].pos1[0] < -5000 || land_history[player.id].pos1[0] > 5000 || land_history[player.id].pos1[2] < -5000 || land_history[player.id].pos1[2] > 5000 || land_history[player.id].pos2[0] < -5000 || land_history[player.id].pos2[0] > 5000 || land_history[player.id].pos2[2] < -5000 || land_history[player.id].pos2[2] > 5000) {
            player.sendMessage("§c您选择的地皮坐标不在限制的坐标范围内！请重新选择！");
            return;
        }
        //开始判断地皮是否重合
        if (have_land(land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid)) {
            player.sendMessage("§c您选择的地皮与已有地皮重合！请重新选择！");
            return;
        }
        //开始计算价格
        let purchase_price = XLength * YLength * ZLength * 3;
        //弹出购买确认表单
        const CreateLandForm = new MessageFormData()
        .title("确认购买")
        .body(`§e您选择的地皮体积为：§c${XLength * YLength * ZLength}§e方块\n§e您选择的地皮价格为：§c${purchase_price}§e金币\n§e您的金币余额为：§c${GetScore("money",player.nameTag)}§e金币\n§e请确认您的购买！`)
        .button1(`§a确认购买`)
        .button2(`§c取消购买`)
        .show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("§c您已取消购买！");
            } else if (response.selection == 0) {
                //首先判断余额是否足够
                if (GetScore("money",player.nameTag) < purchase_price) {
                    player.sendMessage("§c您的金币余额不足！请充值后再购买！");
                    return;
                }
                //再判断该玩家已经拥有了几块地皮，如果超出5块则不允许购买
                let land_num = 0;
                for (let Land in land_data) {
                    if (land_data[Land].owner == player.id) {
                        land_num++;
                    }
                }
                if (land_num >= 5) {
                    player.sendMessage("§c您已经拥有了5块地皮！请先出售一些地皮后再购买！");
                    return;
                }
                //开始连接服务器
                let old_land_data = JSON.parse(JSON.stringify(land_data));
                //开始初始化新的地皮数据
                let new_land_data = {};
                new_land_data.owner = player.id;
                new_land_data.owner_name = player.nameTag;
                new_land_data.pos1 = land_history[player.id].pos1;
                new_land_data.pos2 = land_history[player.id].pos2;
                new_land_data.dimid = land_history[player.id].dimid;
                new_land_data.type = "3d";
                new_land_data.purchase_price = purchase_price;
                new_land_data.on_sale = false;
                new_land_data.get_time = GetTime();
                new_land_data.land_name = player.nameTag + "的地皮";
                new_land_data.allowlist = {};
                new_land_data.banlist = [];
                new_land_data.teleport = [];
                new_land_data.setup = {
                    "DestroyBlock":false,
                    "PlaceBlock":false,
                    "UseItem":false,
                    "AttackEntity":false,
                    "OpenChest":false,
                    "Expoplosion": false,
                    "ShowActionbar":true
                }
                land_data[adler32(GetTime() + player.id + purchase_price)] = new_land_data;
                //开始写入数据
                fs.OverwriteJsonFile("land.json",land_data).then((result) => {
                    if (result === "success") {
                        player.sendMessage("§e>> 购买成功！您已经拥有该地皮,该地皮id为：§c" + adler32(GetTime() + player.id + purchase_price) + "§e！");
                        RunCmd(`title ${player.nameTag} title §e§l购买圈地成功！`);
                        RunCmd(`title ${player.nameTag} subtitle §a您还可以购买 §c${5 - land_num - 1}§a 块地皮！`);
                        //扣除玩家金币
                        world.scoreboard.getObjective("money").addScore(player,-purchase_price);
                        //计算索引值
                        calculate_index(land_history[player.id].pos1,land_history[player.id].pos2,land_history[player.id].dimid,adler32(GetTime() + player.id + purchase_price));
                    } else if (result === -1) {
                        //服务器连接超时提醒
                        player.sendMessage("§c>> 服务器连接失败！请联系在线管理员！");
                        console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                        land_data = old_land_data;
                    } else {
                        //未知错误提醒
                        player.sendMessage("§c>> 未知错误！请联系在线管理员！");
                        land_data = old_land_data;
                    }
                })
            } else {
                player.sendMessage("§c>> 购买失败！您已取消购买！");
            }
        })
    },

    //取出下线后收益
    GetOfflineMoney(player) {
        //首先检查玩家金币缓存是否存在
        if (temp_player_money.hasOwnProperty(player.id)) {
            let old_temp_player_money = JSON.parse(JSON.stringify(temp_player_money));
            //重置缓存
            temp_player_money[player.id] = 0;
            //连接服务器覆写文件
            fs.OverwriteJsonFile("land_temp_player_money.json",temp_player_money).then((result) => {
                if (result === "success") {
                    //存在，给钱
                    if (old_temp_player_money[player.id] != 0) {
                        world.scoreboard.getObjective("money").addScore(player,old_temp_player_money[player.id])
                        player.sendMessage("§e>> 您有一笔来自圈地系统的 " + old_temp_player_money[player.id] + " 金币已到账！请注意查收！");
                    } else {
                        player.sendMessage("§e>> 您目前没有任何圈地收益，尝试售卖地皮来获得收益！");
                    }
                } else {
                    this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","MainfForm");
                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                    temp_player_money = old_temp_player_money;
                }
            })
        } else {
            player.sendMessage("§e>> 您目前没有任何圈地收益，尝试售卖地皮来获得收益！");
        }
    },



}


system.runInterval(() => {
    let players = world.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        player_in_index(players[i]);
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
                    land_data = {};
                    log("玩家市场文件不存在，已成功创建！");
                } else if (result === -1) {
                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                }
            });
        } else if (result === -1) {
            console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
        } else {
            //文件存在且服务器连接成功
            land_data = result;
            let LandNum = 0;
            for (let Land in land_data) {
                calculate_index(land_data[Land].pos1, land_data[Land].pos2, land_data[Land].dimid, Land);
                LandNum++;
            }
            log("圈地数据获取成功，本次读取用时：" + (Date.now() - start) + "ms，共加载 " + LandNum + " 块地皮数据！" );
        }
    })

    fs.GetJSONFileData("land_temp_player_money.json").then((result) => {
        if (result === 0) {
            fs.CreateNewJsonFile("land_temp_player_money.json",{}).then((result) => {
                if (result === "success") {
                    log("玩家金币数据文件不存在，已成功创建！");
                } else if (result === -1) {
                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                }
            });
        } else if (result === -1) {
            console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
        } else {
            //文件存在且服务器连接成功
            temp_player_money = result;
            log("(land)玩家金币数据获取成功，本次读取用时：" + (Date.now() - start) + "ms");
        }
    })

})

//
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    let land = pos_in_index([event.block.x,event.block.y,event.block.z],event.block.dimension.id);
    if (land) {
        if (!event.player.hasTag(cfg.OPTAG) && !in_allowlist(event.player,land) && !land.setup.DestroyBlock) {
            event.cancel = true;
            event.player.sendMessage("§c您没有相关权限在此处破坏方块！");
        }
    }
})

world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    let land = pos_in_index([event.block.x,event.block.y,event.block.z],event.block.dimension.id);
    if (land) {
        if (!event.player.hasTag(cfg.OPTAG) && !in_allowlist(event.player,land) && !land.setup.PlaceBlock) {
            event.cancel = true;
            event.player.sendMessage("§c您没有相关权限在此处放置方块！");
        }
    }
})



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
        "minecraft:lever","minecraft:unpowered_repeater","minecraft:unpowered_comparator","minecraft:wooden_button"
    ]
    let land = pos_in_index([event.block.x,event.block.y,event.block.z],event.block.dimension.id);
    if (land && !event.source.hasTag(cfg.OPTAG) && !in_allowlist(event.source,land) && !land.setup.UseItem) {
        if (tools.includes(event.itemStack.typeId) || blocks.includes(event.block.typeId)) {
            event.cancel = true;
            event.source.sendMessage("§c您没有相关权限在此处使用物品！");
        }
    }
})

// 玩家使用物品
world.beforeEvents.itemUseOn.subscribe((event) => {
    //定义一些可以被改变状态的方块
    const blocks = [
        "minecraft:chest","minecraft:trapped_chest","minecraft:ender_chest","minecraft:barrel","minecraft:frame","minecraft:anvil","minecraft:enchanting_table","minecraft:cartography_table","minecraft:smithing_table",
        "minecraft:black_shulker_box","minecraft:blue_shulker_box","minecraft:brown_shulker_box","minecraft:cyan_shulker_box","minecraft:gray_shulker_box","minecraft:green_shulker_box","minecraft:light_blue_shulker_box","minecraft:lime_shulker_box","minecraft:orange_shulker_box",
        "minecraft:pink_shulker_box","minecraft:purple_shulker_box","minecraft:red_shulker_box","minecraft:undyed_shulker_box","minecraft:white_shulker_box","minecraft:yellow_shulker_box"
    ]
    let land = pos_in_index([event.block.x,event.block.y,event.block.z],event.block.dimension.id);
    if (land && !event.source.hasTag(cfg.OPTAG) && !in_allowlist(event.source,land) && !land.setup.OpenChest) {
        if (blocks.includes(event.block.typeId)) {
            event.cancel = true;
            event.source.sendMessage("§c您没有相关权限在此处进行相关交互动作！");
        }
    }
})

//对于物品使用的检测
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick" && event.itemStack.nameTag == "圈地主菜单") {
        GUI.Main(event.source)
    }
    if (event.itemStack.typeId == "minecraft:stick" && event.itemStack.nameTag == "圈地") {
        GUI.CreateLand(event.source);
    }
})

//玩家退出服务器
world.afterEvents.playerLeave.subscribe((player) => {
    //玩家退出服务器的时候清除actionbar
    if (taskid.actionbar.hasOwnProperty(player.playerId)) {
        system.clearRun(taskid.actionbar[player.playerId]);
        //删除相应的taskid
        delete taskid.actionbar[player.playerId];
    }
    //玩家退出服务器的时候清除粒子
    if (taskid.particle.hasOwnProperty(player.playerId)) {
        system.clearRun(taskid.particle[player.playerId]);
        //删除相应的taskid
        delete taskid.particle[player.playerId];
        //删除相应的tickingarea
        RunCmd(`tickingarea remove p1_${player.playerId}`);
        RunCmd(`tickingarea remove p2_${player.playerId}`);
    }
    //玩家退出服务器的时候清除历史数据
    if (land_history.hasOwnProperty(player.playerId)) {
        delete land_history[player.playerId];
    }
})



