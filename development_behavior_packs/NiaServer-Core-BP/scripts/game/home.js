import { world } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { log } from "../API/logger.js";
import { Main } from "./main_menu.js";
import { SetupGUI } from "./setup.js";
import { pos_in_land,in_allowlist } from "./land.js";

const GUI = {
    HomeMain(player) {
        let player_pos_data = player.getDynamicProperty("pos_data");
        log(player_pos_data)
        if (player_pos_data == undefined) {
            player.setDynamicProperty("pos_data", JSON.stringify([]));
            player_pos_data = [];
        } else {
            player_pos_data = JSON.parse(player_pos_data);
        }
        const HomeMainForm = new ActionFormData()
        .title("传送点设置")
        .body("请选择你要传送的地点")
        .button("返回上一级菜单","textures/ui/wysiwyg_reset")
        .button("添加/删除传送点","textures/ui/paste")
        for (let i = 0; i < player_pos_data.length; i++) {
            HomeMainForm.button(player_pos_data[i].name +
                "\nx:" + player_pos_data[i].x +
                " y:" + player_pos_data[i].y +
                " z:" + player_pos_data[i].z);
        }
        HomeMainForm.show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                Main(player);
                return;
            }
            if (response.selection == 1) {
                this.SetUP(player);
                return;
            }
            let index = response.selection - 2;
            let land_result = pos_in_land(
                [player_pos_data[index].x,
                player_pos_data[index].y,
                player_pos_data[index].z],
                player_pos_data[index].dim);
            if (land_result && !in_allowlist(player, land_result)) {
                player.sendMessage(" §c您不能传送到位置处于他人领地内的传送点！");
                return;
            }
            player.teleport({
                x: Number(player_pos_data[index].x),
                y: Number(player_pos_data[index].y),
                z: Number(player_pos_data[index].z)
            },{
                dimension: world.getDimension(player_pos_data[index].dim)});
            player.sendMessage(" §a已成功将您传送至传送点: " + player_pos_data[index].name);
        })

    },
    SetUP(player) {
        const SetupForm = new ActionFormData()
        .title("传送点设置")
        .button("返回上一级菜单","textures/ui/wysiwyg_reset")
        .button("添加传送点")
        .button("删除传送点")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                this.HomeMain(player);
                return;
            } else if (response.selection == 1) {
                this.AddPos(player);
            } else if (response.selection == 2) {
                this.Remove(player);
            }
        })
    },

    AddPos(player) {
        let player_pos_data = player.getDynamicProperty("pos_data");
        if (player_pos_data == undefined) {
            player.setDynamicProperty("pos_data", JSON.stringify([]));
            player_pos_data = [];
        } else {
            player_pos_data = JSON.parse(player_pos_data);
        }
        const AddPosForm = new ModalFormData()
        .title("添加当前位置坐标至传送点")
        .textField("请输入传送点名称","名称不要过长")
        .submitButton("确定添加")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.formValues[0] == "") {
                player.sendMessage("§c传送点名称不能为空！");
                return;
            }
            let land_result = pos_in_land([player.location.x, player.location.y, player.location.z], player.dimension.id);
            if (land_result && !in_allowlist(player, land_result)) {
                player.sendMessage(" §c您不能在不属于您的领地内设置传送点！");
                return;
            }
            player_pos_data.push({name: response.formValues[0], x: player.location.x.toFixed(2), y: player.location.y.toFixed(2), z: player.location.z.toFixed(2), dim: player.dimension.id});
            player.setDynamicProperty("pos_data", JSON.stringify(player_pos_data));
            player.sendMessage(" §a传送点添加成功，传送点名称为: " + response.formValues[0] + " 坐标为: " + player.location.x.toFixed(2) + " " + player.location.y.toFixed(2) + " " + player.location.z.toFixed(2));
        })
    },

    Remove(player) {
        let player_pos_data = player.getDynamicProperty("pos_data");
        if (player_pos_data == undefined) {
            player.setDynamicProperty("pos_data", JSON.stringify([]));
            player_pos_data = [];
        } else {
            player_pos_data = JSON.parse(player_pos_data);
        }
        const RemovePosForm = new ActionFormData()
        .title("删除传送点")
        .button("返回上一级菜单")
        .body("请选择你要删除的传送点")
        for (let i = 0; i < player_pos_data.length; i++) {
            RemovePosForm.button(player_pos_data[i].name + "\nx:" + player_pos_data[i].x + " y:" + player_pos_data[i].y + " z:" + player_pos_data[i].z);
        }
        RemovePosForm.show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                Main(player);
                return;
            }
            let index = response.selection - 1;
            player_pos_data.splice(index, 1);
            player.setDynamicProperty("pos_data", JSON.stringify(player_pos_data));
            player.sendMessage(" §a传送点删除成功！");
        })
    }
}

world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick" && event.itemStack.nameTag == "home") {
        GUI.HomeMain(event.source);
    }
})

export const HomeGUI = GUI;