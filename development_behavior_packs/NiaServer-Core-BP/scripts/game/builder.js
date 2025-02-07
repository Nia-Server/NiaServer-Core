import { world,system,MolangVariableMap } from '@minecraft/server'
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'

import { ExternalFS } from '../API/http.js';
const fs = new ExternalFS();

let buid_task = {
    "task_id": `73982739123`,
    "task_name": `建筑测试任务`,
    "pos": ["minecraft:overworld", 0, 0, 0],
    "block_nums": 100,
    "block_data": [
        ["minecraft:stone", 0, 0, 0],
        ["minecraft:stone", 0, 0, 1],
        ["minecraft:stone", 0, 0, 2],
        ["minecraft:stone", 0, 0, 3],
        ["minecraft:stone", 0, 0, 4],
        ["minecraft:stone", 0, 0, 5],
        ["minecraft:stone", 0, 0, 6],
        ["minecraft:stone", 0, 0, 7],
        ["minecraft:stone", 0, 0, 8],
        ["minecraft:stone", 0, 0, 9],
        ["minecraft:stone", 0, 0, 10],
        ["minecraft:stone", 0, 0, 11],
        ["minecraft:stone", 0, 0, 12],
        ["minecraft:stone", 0, 0, 13],
        ["minecraft:stone", 0, 0, 14],
        ["minecraft:stone", 0, 0, 15],
        ["minecraft:stone", 0, 0, 16],
        ["minecraft:stone", 0, 0, 17],
        ["minecraft:stone", 0, 0, 18],
        ["minecraft:stone", 0, 0, 19],
        ["minecraft:stone", 0, 0, 20],
        ["minecraft:stone", 1, 0, 0],
        ["minecraft:stone", 1, 0, 1],
        ["minecraft:stone", 1, 0, 2],
        ["minecraft:stone", 1, 0, 3],
        ["minecraft:stone", 1, 0, 4],
        ["minecraft:stone", 1, 0, 5],
        ["minecraft:stone", 1, 0, 6],
        ["minecraft:stone", 1, 0, 7],
        ["minecraft:stone", 1, 0, 8],
        ["minecraft:stone", 1, 0, 9],
        ["minecraft:stone", 1, 0, 10],
        ["minecraft:stone", 1, 0, 11],
        ["minecraft:stone", 1, 0, 12],
        ["minecraft:stone", 1, 0, 13],
        ["minecraft:stone", 1, 0, 14],
        ["minecraft:stone", 1, 0, 15],
        ["minecraft:stone", 1, 0, 16],
        ["minecraft:stone", 1, 0, 17],
        ["minecraft:stone", 1, 0, 18],
        ["minecraft:stone", 1, 0, 19],
        ["minecraft:stone", 1, 0, 20],
        ["minecraft:stone", 2, 0, 0],
        ["minecraft:stone", 2, 0, 1],
        ["minecraft:stone", 2, 0, 2],
        ["minecraft:stone", 2, 0, 3],
        ["minecraft:stone", 2, 0, 4],
        ["minecraft:stone", 2, 0, 5],
        ["minecraft:stone", 2, 0, 6],
        ["minecraft:stone", 2, 0, 7],
        ["minecraft:stone", 2, 0, 8],
        ["minecraft:stone", 2, 0, 9],
        ["minecraft:stone", 2, 0, 10],
        ["minecraft:stone", 2, 0, 11],
        ["minecraft:stone", 2, 0, 12],
        ["minecraft:stone", 2, 0, 13],
        ["minecraft:stone", 2, 0, 14],
        ["minecraft:stone", 2, 0, 15],
        ["minecraft:stone", 2, 0, 16],
        ["minecraft:stone", 2, 0, 17],
        ["minecraft:stone", 2, 0, 18],
        ["minecraft:stone", 2, 0, 19],
        ["minecraft:stone", 2, 0, 20],
        ["minecraft:stone", 3, 0, 0],
        ["minecraft:stone", 3, 0, 1],
        ["minecraft:stone", 3, 0, 2],
        ["minecraft:stone", 3, 0, 3],
        ["minecraft:stone", 3, 0, 4],
        ["minecraft:stone", 3, 0, 5],
        ["minecraft:stone", 3, 0, 6],
        ["minecraft:stone", 3, 0, 7],
        ["minecraft:stone", 3, 0, 8],
        ["minecraft:stone", 3, 0, 9],
        ["minecraft:stone", 3, 0, 10],
        ["minecraft:stone", 3, 0, 11],
        ["minecraft:stone", 3, 0, 12],
        ["minecraft:stone", 3, 0, 13],
        ["minecraft:stone", 3, 0, 14],
        ["minecraft:stone", 3, 0, 15],
        ["minecraft:stone", 3, 0, 16],
        ["minecraft:stone", 3, 0, 17],
        ["minecraft:stone", 3, 0, 18],
        ["minecraft:stone", 3, 0, 19],
        ["minecraft:stone", 3, 0, 20],
        ["minecraft:stone", 4, 0, 0],
        ["minecraft:stone", 4, 0, 1],
        ["minecraft:stone", 4, 0, 2],
        ["minecraft:stone", 4, 0, 3],
        ["minecraft:stone", 4, 0, 4],
        ["minecraft:stone", 4, 0, 5],
        ["minecraft:stone", 4, 0, 6],
        ["minecraft:stone", 4, 0, 7],
        ["minecraft:stone", 4, 0, 8],
        ["minecraft:stone", 4, 0, 9],
        ["minecraft:stone", 4, 0, 10],
        ["minecraft:stone", 4, 0, 11],
        ["minecraft:stone", 4, 0, 12],
        ["minecraft:stone", 4, 0, 13],
        ["minecraft:stone", 4, 0, 14],
        ["minecraft:stone", 4, 0, 15],
        ["minecraft:stone", 4, 0, 16],
        ["minecraft:stone", 4, 0, 17],
        ["minecraft:stone", 4, 0, 18],
        ["minecraft:stone", 4, 0, 19],
        ["minecraft:stone", 4, 0, 20]
    ]
}


//读取build_task获得最大和最小坐标
let max_x = 0;
let max_y = 0;
let max_z = 0;
let min_x = 0;
let min_y = 0;
let min_z = 0;
for (let i = 0; i < buid_task.block_data.length; i++) {
    if (buid_task.block_data[i][1] > max_x) max_x = buid_task.block_data[i][1];
    if (buid_task.block_data[i][2] > max_y) max_y = buid_task.block_data[i][2];
    if (buid_task.block_data[i][3] > max_z) max_z = buid_task.block_data[i][3];
    if (buid_task.block_data[i][1] < min_x) min_x = buid_task.block_data[i][1];
    if (buid_task.block_data[i][2] < min_y) min_y = buid_task.block_data[i][2];
    if (buid_task.block_data[i][3] < min_z) min_z = buid_task.block_data[i][3];
}

const GUI = {
    MainForm(player) {
    const buid_task_form = new ActionFormData()
        .title("建筑任务")
        .button("查询当前在进行任务")
        .button("开始建筑任务")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 1) {
                system.runTimeout(() => {
                    const molang = new MolangVariableMap();
                    molang.setColorRGB("variable.color", { red: Math.random(), green: Math.random(), blue: Math.random() });
                    world.getDimension(buid_task.pos[0]).spawnParticle("minecraft:colored_flame_particle", {x:player.locattion.x,y:player.locattion.y,z:player.locattion.z}, molang);
                }, 100);
            }
        })
    }
}


//对于物品使用的检测
// world.afterEvents.itemUse.subscribe(event => {
//     if (event.itemStack.typeId == "minecraft:stick") {
//         let player = event.source;
//         GUI.MainForm(player);
//     }
// })

