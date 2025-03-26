import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Main } from "./main_menu";
import { OpGUI } from "./op";


export const WarpGUI = {
    Main(player) {
        let world_pos_data = world.getDynamicProperty("pos_data");
        if (world_pos_data == undefined) {
            world.setDynamicProperty("pos_data", JSON.stringify([]));
            world_pos_data = [];
        } else {
            world_pos_data = JSON.parse(world_pos_data);
        }
        const MainForm = new ActionFormData()
        .title("公共传送点")
        .body("请选择你要传送的地点")
        .button("返回上一级菜单","textures/ui/wysiwyg_reset")
        for (let i = 0; i < world_pos_data.length; i++) {
            MainForm.button(world_pos_data[i].name +
                "\nx:" + world_pos_data[i].x +
                " y:" + world_pos_data[i].y +
                " z:" + world_pos_data[i].z);
        }

        MainForm.show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                Main(player);
                return;
            }
            let index = response.selection - 1;
            player.teleport({
                x: Number(world_pos_data[index].x),
                y: Number(world_pos_data[index].y),
                z: Number(world_pos_data[index].z)
            },{
                dimension: world.getDimension(world_pos_data[index].dim)});
            player.playSound("random.levelup");
            player.sendMessage(" §a已成功将您传送至传送点: " + world_pos_data[index].name);
        })
    },

    SetUP(player) {
        const SetupForm = new ActionFormData()
        .title("公共传送点设置")
        .button("返回上一级菜单","textures/ui/wysiwyg_reset")
        .button("添加传送点", "textures/ui/color_plus")
        .button("删除传送点", "textures/ui/trash")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                OpGUI.OpMain(player);
                return;
            } else if (response.selection == 1) {
                this.AddPos(player);
            } else if (response.selection == 2) {
                this.Remove(player);
            }
        })
    },

    AddPos(player) {
        let world_pos_data = world.getDynamicProperty("pos_data");
        if (world_pos_data == undefined) {
            world.setDynamicProperty("pos_data", JSON.stringify([]));
            world_pos_data = [];
        } else {
            world_pos_data = JSON.parse(world_pos_data);
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
            world_pos_data.push({name: response.formValues[0], x: player.location.x.toFixed(2), y: player.location.y.toFixed(2), z: player.location.z.toFixed(2), dim: player.dimension.id});
            world.setDynamicProperty("pos_data", JSON.stringify(world_pos_data));
            player.sendMessage(" §a传送点添加成功，传送点名称为: " + response.formValues[0] + " 坐标为: " + player.location.x.toFixed(2) + " " + player.location.y.toFixed(2) + " " + player.location.z.toFixed(2));
        })
    },

    Remove(player) {
        let world_pos_data = world.getDynamicProperty("pos_data");
        if (world_pos_data == undefined) {
            world.setDynamicProperty("pos_data", JSON.stringify([]));
            world_pos_data = [];
        } else {
            world_pos_data = JSON.parse(world_pos_data);
        }
        const RemovePosForm = new ActionFormData()
        .title("删除公共传送点")
        .button("返回上一级菜单")
        .body("请选择你要删除的传送点")
        for (let i = 0; i < world_pos_data.length; i++) {
            RemovePosForm.button(world_pos_data[i].name +
                "\nx:" + world_pos_data[i].x +
                " y:" + world_pos_data[i].y +
                " z:" + world_pos_data[i].z);
        }
        RemovePosForm.show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                this.SetUP(player);
                return;
            }
            let index = response.selection - 1;
            world_pos_data.splice(index, 1);
            world.setDynamicProperty("pos_data", JSON.stringify(world_pos_data));
            player.sendMessage(" §a传送点删除成功");
        })
    }
}