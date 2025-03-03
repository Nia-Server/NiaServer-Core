import { world,system,MolangVariableMap } from '@minecraft/server'
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'

import { ExternalFS } from '../API/http.js';

import { build_task } from './bunny.js'
const fs = new ExternalFS();

//读取build_task获得最大和最小坐标
let max_x = 0;
let max_y = 0;
let max_z = 0;
let min_x = 0;
let min_y = 0;
let min_z = 0;
for (let i = 0; i < build_task.block_data.length; i++) {
    if (build_task.block_data[i][1] > max_x) max_x = build_task.block_data[i][1];
    if (build_task.block_data[i][2] > max_y) max_y = build_task.block_data[i][2];
    if (build_task.block_data[i][3] > max_z) max_z = build_task.block_data[i][3];
    if (build_task.block_data[i][1] < min_x) min_x = build_task.block_data[i][1];
    if (build_task.block_data[i][2] < min_y) min_y = build_task.block_data[i][2];
    if (build_task.block_data[i][3] < min_z) min_z = build_task.block_data[i][3];
}

const GUI = {
    MainForm(player) {
    const build_task_form = new ActionFormData()
        .title("建筑任务")
        .button("查询当前在进行任务")
        .button("开始建筑任务")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 1) {
                let player_pos = {"x":player.location.x,"y":player.location.y,"z":player.location.z};
                particle_framework_x_z(player, {x:min_x,y:min_y,z:min_z},{x:max_x,y:max_y,z:max_z},{x:build_task.pos[1],y:build_task.pos[2],z:build_task.pos[3]});
            }
        })
    }
} 


function particle_framework_x_z(player, min_pos, max_pos, base_pos) {
    let actual_min_pos = { x: min_pos.x + base_pos.x - 1, y: min_pos.y + base_pos.y - 1, z: min_pos.z + base_pos.z - 1 };
    let actual_max_pos = { x: max_pos.x + base_pos.x + 1, y: max_pos.y + base_pos.y + 1, z: max_pos.z + base_pos.z + 1 };
    let pos_x_z = { x: actual_min_pos.x, y: actual_min_pos.y, z: actual_min_pos.z };
    let pos_z_x = { x: actual_min_pos.x, y: actual_min_pos.y, z: actual_min_pos.z };
    let last_pos_x_z = { x: actual_min_pos.x, y: actual_min_pos.y, z: actual_min_pos.z };
    let last_pos_z_x = { x: actual_min_pos.x, y: actual_min_pos.y, z: actual_min_pos.z };
    let pos_y = [{ x: actual_min_pos.x, y: actual_min_pos.y, z: actual_min_pos.z }];
    let distance_x = Math.abs(actual_max_pos.x - actual_min_pos.x);
    let distance_y = Math.abs(actual_max_pos.y - actual_min_pos.y);
    let distance_z = Math.abs(actual_max_pos.z - actual_min_pos.z);
    let v_av = (distance_x + distance_z) / 100;
    let particle_interval = (distance_x * 4 + distance_y * 4 + distance_z * 4) / 200;
    let pos_x_z_result = false;
    let pos_z_x_result = false;
    let particle_framework_x_z_id = system.runInterval(() => {
        if (pos_x_z.x < actual_max_pos.x) {
            pos_x_z = { x: pos_x_z.x + v_av, y: pos_x_z.y, z: pos_x_z.z };
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:critical_hit_emitter", pos_x_z);
            if (pos_x_z.x - last_pos_x_z.x > particle_interval) {
                pos_y.push({ x: last_pos_x_z.x + particle_interval, y: last_pos_x_z.y, z: last_pos_x_z.z });
                last_pos_x_z = { x: last_pos_x_z.x + particle_interval, y: last_pos_x_z.y, z: last_pos_x_z.z };
            }
        } else if (pos_x_z.z < actual_max_pos.z) {
            pos_x_z = { x: pos_x_z.x, y: pos_x_z.y, z: pos_x_z.z + v_av };
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:critical_hit_emitter", pos_x_z);
            if (pos_x_z.z - last_pos_x_z.z > particle_interval) {
                pos_y.push({ x: last_pos_x_z.x, y: last_pos_x_z.y, z: last_pos_x_z.z + particle_interval });
                last_pos_x_z = { x: last_pos_x_z.x, y: last_pos_x_z.y, z: last_pos_x_z.z + particle_interval };
            }
        } else {
            pos_x_z_result = true;
        }

        if (pos_z_x.z < actual_max_pos.z) {
            pos_z_x = { x: pos_z_x.x, y: pos_z_x.y, z: pos_z_x.z + v_av };
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:critical_hit_emitter", pos_z_x);
            if (pos_z_x.z - last_pos_z_x.z > particle_interval) {
                pos_y.push({ x: last_pos_z_x.x, y: last_pos_z_x.y, z: last_pos_z_x.z + particle_interval });
                last_pos_z_x = { x: last_pos_z_x.x, y: last_pos_z_x.y, z: last_pos_z_x.z + particle_interval };
            }
        } else if (pos_z_x.x < actual_max_pos.x) {
            pos_z_x = { x: pos_z_x.x + v_av, y: pos_z_x.y, z: pos_z_x.z };
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:critical_hit_emitter", pos_z_x);
            if (pos_z_x.x - last_pos_z_x.x > particle_interval) {
                pos_y.push({ x: last_pos_z_x.x + particle_interval, y: last_pos_z_x.y, z: last_pos_z_x.z });
                last_pos_z_x = { x: last_pos_z_x.x + particle_interval, y: last_pos_z_x.y, z: last_pos_z_x.z };
            }
        } else {
            pos_z_x_result = true;
        }

        for (let i= 0; i < pos_y.length; i++) {
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", pos_y[i]);
        }

        if (pos_x_z_result && pos_z_x_result) {
            system.clearRun(particle_framework_x_z_id);
            particle_framework_up(player, pos_y, actual_min_pos, actual_max_pos, v_av, particle_interval);
        }

    }, 1);
}

function particle_framework_up(player, pos_y, actual_min_pos, actual_max_pos, v_av, particle_interval) {
    let pos_y_up = JSON.parse(JSON.stringify(pos_y));
    let last_pos_y = JSON.parse(JSON.stringify(pos_y));
    let pos_y_result = false;
    let particle_framework_up_id = system.runInterval(() => {
        for (let i = 0; i < pos_y_up.length; i++) {
            if (pos_y_up[i].y < actual_max_pos.y) {
                pos_y_up[i] = { x: pos_y_up[i].x, y: pos_y_up[i].y + v_av, z: pos_y_up[i].z };
                world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", pos_y_up[i]);
                if (pos_y_up[i].y - last_pos_y[i].y > particle_interval) {
                    pos_y.push({ x: last_pos_y[i].x, y: last_pos_y[i].y + particle_interval, z: last_pos_y[i].z });
                    last_pos_y[i] = { x: last_pos_y[i].x, y: last_pos_y[i].y + particle_interval, z: last_pos_y[i].z };
                }
            } else {
                pos_y_result = true;
            }
        }

        for (let i= 0; i < pos_y.length; i++) {
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", pos_y[i]);
        }

        if (pos_y_result) {
            system.clearRun(particle_framework_up_id);
            final_show(player, actual_min_pos, actual_max_pos);
        }
    }, 2);
}


function final_show(player, actual_min_pos, actual_max_pos) {
    let distance_x = Math.abs(actual_max_pos.x - actual_min_pos.x);
    let distance_y = Math.abs(actual_max_pos.y - actual_min_pos.y);
    let distance_z = Math.abs(actual_max_pos.z - actual_min_pos.z);
    let total_length = distance_x * 4 + distance_y * 4 + distance_z * 4;
    let particle_interval = total_length / 200;
    const molang = new MolangVariableMap();
    let pre_load = false;
    let pre_load_index = 0;
    system.runInterval(() => {
        molang.setColorRGB("variable.color", { red: Math.random(), green: Math.random(), blue: Math.random() });
        for (let i = actual_min_pos.x; i < actual_max_pos.x; i += particle_interval) {
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: i, y: actual_min_pos.y, z: actual_min_pos.z });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: i, y: actual_min_pos.y, z: actual_max_pos.z });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: i, y: actual_max_pos.y, z: actual_min_pos.z });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: i, y: actual_max_pos.y, z: actual_max_pos.z });
        }
        for (let i = actual_min_pos.z; i < actual_max_pos.z; i += particle_interval) {
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_min_pos.x, y: actual_min_pos.y, z: i });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_min_pos.x, y: actual_max_pos.y, z: i });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_max_pos.x, y: actual_min_pos.y, z: i });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_max_pos.x, y: actual_max_pos.y, z: i });
        }
        for (let i = actual_min_pos.y; i < actual_max_pos.y; i += particle_interval) {
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_min_pos.x, y: i, z: actual_min_pos.z });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_min_pos.x, y: i, z: actual_max_pos.z });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_max_pos.x, y: i, z: actual_min_pos.z });
            world.getDimension(build_task.pos[0]).spawnParticle("minecraft:balloon_gas_particle", { x: actual_max_pos.x, y: i, z: actual_max_pos.z });
        }
        let show_particle = [];
        if (!pre_load) {
            player.onScreenDisplay.setActionBar("正在预加载所有粒子数据...");
            if (build_task.block_data.length - pre_load_index > 500) {
                for (let i = pre_load_index; i - pre_load_index < 500; i++) {
                    show_particle.push({ x: build_task.block_data[i][1], y: build_task.block_data[i][2], z: build_task.block_data[i][3]});
                }
                pre_load_index = 500 + pre_load_index
            } else {
                for (let i = pre_load_index; i < build_task.block_data.length; i++) {
                    show_particle.push({ x: build_task.block_data[i][1], y: build_task.block_data[i][2], z: build_task.block_data[i][3]});
                }
                pre_load_index = 0;
            }
            // for (let i = 0 ; i < build_task.block_data.length; i++) {
            //     world.getDimension(build_task.pos[0]).spawnParticle("minecraft:colored_flame_particle",{
            //         x: build_task.block_data[i][1] + actual_min_pos.x + 0.5,
            //         y: build_task.block_data[i][2] + actual_min_pos.y + 0.5,
            //         z: build_task.block_data[i][3] + actual_min_pos.z + 0.5},molang);
            // }

        }
        for (let i = 0 ; i < show_particle.length; i++) {
            world.getDimension(build_task.pos[0]).spawnParticle("mcnia:basic",{
                x: show_particle[i].x + actual_min_pos.x + 0.5,
                y: show_particle[i].y + actual_min_pos.y + 0.5,
                z: show_particle[i].z + actual_min_pos.z + 0.5},molang);
        }
    }, 3);

}




//对于物品使用的检测
// world.afterEvents.itemUse.subscribe(event => {
//     if (event.itemStack.typeId == "minecraft:stick") {
//         let player = event.source;
//         GUI.MainForm(player);
//     }
// })

