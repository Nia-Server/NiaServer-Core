import { world } from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import { Main } from './main';
import { TpaGUI } from './Tpa';

const GUI = {
    SetupMain(player) {
        const SetupMainForm = new ActionFormData()
        .title("设置")
        .button("返回上一级菜单")
        .button("游戏设置")
        .button("标题栏设置")
        .button("传送系统设置")
        .show(player).then((response) => {
            switch (response.selection) {
                case 0:
                    Main(player)
                    break;
                case 1:
                    this.PlayerSetupGUI(player)
                    break;
                case 2:
                    this.ActionBarSetupGUI(player)
                    break;
                case 3:
                    TpaGUI.TpaSetup(player)
                    break;
            }
        })

    },

    PlayerSetupGUI(player) {
        const PlayerSetupGUIForm = new ModalFormData()
        .title("玩家个人设置")
        if (player.hasTag("NightVision")) {
            PlayerSetupGUIForm.toggle("夜视效果",true)
        } else {
            PlayerSetupGUIForm.toggle("夜视效果",false)
        }
        PlayerSetupGUIForm.show(player).then((result) => {
            if (!result.canceled) {
                let Tags = ["NightVision"]
                for (let i = 0; i < Tags.length; i++) {
                    player.removeTag(Tags[i])
                    player.sendMessage("§c 夜视效果已关闭！")
                }
                if (result.formValues[0] == 1) {
                    player.addTag("NightVision")
                    player.sendMessage("§a 夜视效果已开启！")
                }
            } else {
                this.SetupMain(player)
            }
        })
    },

    ActionBarSetupGUI(player) {
        const ActionBarForm = new ModalFormData()
        ActionBarForm.title("§c§l设置标题栏")
        if (player.hasTag("ShowActionbar")) {
            ActionBarForm.toggle("标题栏提示信息显示",true);
        } else {
            ActionBarForm.toggle("标题栏提示信息显示",false);
        }
        ActionBarForm.show(player).then((result) => {
            if (!result.canceled) {

                player.removeTag("ShowActionbar")
                if (result.formValues[0] == 1) {
                    player.addTag("ShowActionbar")
                }
                player.sendMessage("§e 标题栏设置更改成功！")
            } else {
                this.SetupMain(player)
            }
        })
    }
}

export const SetupGUI = GUI
