import { world } from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import { Broadcast,Tell,log,RunCmd,GetScore } from '../customFunction.js';
import { cfg } from '../config.js'

import { SetupGUI } from './Setup.js';
import { ShopGUI } from './shop.js';
import { OxygenGUI } from './oxygen.js';
import { TpaGUI } from './Tpa.js';
import { CDKGUI } from './cdk.js';
import { FlyGUI } from './Fly.js';
import { TransferGUI } from './Transfer.js';


const MainGUI = {
    "title": "服务器菜单",
    "body": "§l===========================\n§eHi! §l§6%playername% §r§e欢迎回来！\n§e您目前能源币余额： §6§l*money*\n§r§e您目前剩余氧气值为： §6§l*oxygen*\n§r§e您目前剩余体力值为： §6§l*stamina*\n§r§e您目前在线总时长为： §6§l*time*\n§r§e当前物价指数为： §6§l%RN%\n§r§l===========================\n§r§c§l游玩中有问题找腐竹反馈！\n祝您游玩愉快！\n§r§l===========================",
    "buttons": [
        {
            "name": "立即回城\n点击后立即返回主城",
            "icon": "textures/blocks/chest_front",
            "type": "runCmd",
            "content": "tp @a[name=%playername%] 702 82 554"
        },
        {
            "name": "返回主岛\n即可立即返回自己的主岛",
            "icon": "textures/ui/backup_replace",
            "type": "goISLAND"
        },
        {
            "name": "个人传送点\n设置属于自己的传送点",
            "icon": "textures/ui/icon_new",
            "type": "runCmd",
            "content": "openhomegui %playername%"
        },
        {
            "name": "调节生存模式\n不调节生存你怎么开始玩？",
            "icon": "textures/ui/controller_glyph_color",
            "type": "runCmd",
            "content": "gamemode s %playername%"
        },
        {
            "name": "设置\n在这里修改所有设置",
            "icon": "textures/ui/automation_glyph_color",
            "type": "openGUI",
            "GUI": "SetupGUI"
        },
        {
            "name": "商店系统\n购买、卖出、赚钱？",
            "icon": "textures/ui/icon_blackfriday",
            "type": "openGUI",
            "GUI": "ShopGUI"
        },
        {
            "name": "氧气系统\n在这里购买呼吸装备，升级！",
            "icon": "textures/ui/bubble",
            "type": "openGUI",
            "GUI": "OxygenGUI"
        },
        {
            "name": "玩家传送系统\n传送到你的好基友那里",
            "icon": "textures/ui/dressing_room_skins",
            "type": "openGUI",
            "GUI": "TpaGUI"
        },
        {
            "name": "兑换码系统\n礼品码在这里输入后即可兑换",
            "icon": "textures/ui/gift_square",
            "type": "openGUI",
            "GUI": "CdkGUI"
        },
        {
            "name": "飞行系统\n开启飞行模式建造自己的家园！",
            "icon": "textures/ui/levitation_effect",
            "type": "openGUI",
            "GUI": "FlyGUI"
        },
        {
            "name": "转账系统\n玩家间的转账",
            "icon": "textures/ui/icon_best3",
            "type": "openGUI",
            "GUI": "TransferGUI"
        }
    ]
}


export function Main(player) {
    //标题元素替换
    let title = MainGUI.title.replace("%playername%",player.nameTag)
    //body元素替换
    let body = MainGUI.body.replace("%playername%",player.nameTag).replace("%RN%",GetScore("DATA","RN")/100)
    let bodyarr = body.split("*");
    for (let i = 1; i < bodyarr.length; i += 2) {
        body = body.replaceAll(`*${bodyarr[i]}*`,GetScore(bodyarr[i],player.nameTag))
    }
    //定义button
    let buttons =MainGUI.buttons
    const MainForm = new ActionFormData()
        .title(title)
        .body(body)
        for (let i = 0; i < buttons.length; i ++) {
            MainForm.button(buttons[i].name,buttons[i].icon)
        }
    MainForm.show(player).then((response) => {
        switch (buttons[response.selection].type) {
            case "runCmd":
                let cmd = buttons[response.selection].content.replace("%playername%",player.nameTag)
                RunCmd(cmd)
                break;
            case "openGUI":
                OpenGUI(player,buttons[response.selection].GUI)
                break;
            case "goISLAND":
                if (GetScore("posX",player.nameTag) == 0 && GetScore("posY",player.nameTag) == 0 && GetScore("posZ",player.nameTag) == 0) {
                    player.sendMessage(`§c>> 未找到相应的主岛数据！请在领取空岛后使用本功能！`,player.nameTag)
                } else {
                    RunCmd(`tp @a[name=${player.nameTag}] ${GetScore("posX",player.nameTag)} ${GetScore("posY",player.nameTag)} ${GetScore("posZ",player.nameTag)}`)
                    player.sendMessage(`§a>> 已经将您传送至主岛！`,player.nameTag)
                }
                break;

        }
    })
}

function OpenGUI(player,GUINAME) {
    switch (GUINAME) {
        case "SetupGUI":
            SetupGUI.SetupMain(player)
            break;
        case "ShopGUI":
            ShopGUI.ShopMain(player)
            break;
        case "OxygenGUI":
            OxygenGUI.OxygenMain(player)
            break;
        case "TpaGUI":
            TpaGUI.TpaMain(player)
            break;
        case "CdkGUI":
            CDKGUI(player)
            break;
        case "FlyGUI":
            FlyGUI(player)
            break;
        case "TransferGUI":
            TransferGUI.Transfer(player)
            break;
    }
}

//对于物品使用的检测
world.events.beforeItemUse.subscribe(event => {
    if (event.item.typeId == cfg.MENUITEM) {
        let player = event.source;
        Main(player)
    }
})

