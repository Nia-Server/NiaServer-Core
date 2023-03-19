import { world } from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'

export function ActionBarSetupGUI(player) {
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
                player.removeTag(Tags[i])
            }
            if (result.formValues[0] == 1) {
                player.addTag("ShowActionbar")
                //RunCmd(`tag "${player.nameTag}" add ShowActionbar`)
            }
            if (result.formValues[1] == 1) {
                player.addTag("ShowOxygenName")
                //RunCmd(`tag "${player.nameTag}" add ShowOxygenName`)
            }
            if (result.formValues[2] >=1 && result.formValues[2] <=4) {
                player.addTag(`ShowOxygen${result.formValues[2]}`)
                //RunCmd(`tag "${player.nameTag}" add ShowOxygen${result.formValues[2]}`)
            }
            if (result.formValues[3] == 1) {
                player.addTag("ShowMoney")
                //RunCmd(`tag "${player.nameTag}" add ShowMoney`)
            }
            if (result.formValues[4] == 1) {
                player.addTag("ShowTime")
                //RunCmd(`tag "${player.nameTag}" add ShowTime`)
            }
            if (result.formValues[5] == 1) {
                player.addTag("ShowRN")
                //RunCmd(`tag "${player.nameTag}" add ShowRN`)
            }
            if (result.formValues[6] == 1) {
                player.addTag("ShowStamina")
                //RunCmd(`tag "${player.nameTag}" add ShowStamina`)
            }
            player.sendMessage("§e>> 标题栏设置更改成功！")
        }
    })
}
