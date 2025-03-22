import { world,system } from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { RunCmd,GetScore } from '../API/game.js';
import { log,warn,error } from "../API/logger.js";
import { cfg } from '../config.js'

import { SetupGUI } from './setup.js';
import { ShopGUI } from './shop.js';
// import { NewShopGUI } from './new_shop.js';
import { TpaGUI } from './tpa.js';
import { CDKGUI } from './cdk.js';
import { TransferGUI } from './transfer.js';
import { OpGUI } from './op.js';
import { MarketGUI } from './market.js';
import { LandGUI } from './land.js';
import { HomeGUI } from './home.js';
import { RankingGUI } from './ranking.js';

const MoneyScoreboardName = cfg.MoneyScoreboardName;


const ALL_GUI = ["MainGUI","SetupGUI","ShopGUI","TpaGUI","CdkGUI","TransferGUI","OpGUI","MarketGUI","LandGUI","HomeGUI","RankingGUI"];

//注册scriptevent
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id != "mcnia:nc_openGUI") return;
    //openGUI后的处理
    //event.message是一个object对象，格式形如{"GUI":"GUI名称","target":"目标玩家名称","data":{}}
    //解析event.message，判断传进的数据是否是一个object对象
    let receive_data = event.message;
    //将字符串转换为对象,如果转换失败则log输出错误
    try {
        receive_data = JSON.parse(receive_data);
    } catch (e) {
        error(e);
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c json格式解析错误，请检查传入的数据是否符合json格式！\n" +
            "§b您传入的数据为：" + event.message + "\n" +
            "§a正确的格式为：{\"GUI\":\"GUI名称\",\"target\":\"目标玩家名称\",\"data\":{}}"
        );
        return;
    }
    //判断obj是否符合{"GUI":"GUI名称","target":"目标玩家名称","data":{}}
    if (receive_data.GUI == undefined || receive_data.target == undefined || receive_data.data == undefined) {
        error("The data received is not a valid object!");
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c json解析错误，请检查传入的数据是否符合预设格式！\n" +
            "§b您传入的数据为：" + event.message + "\n" +
            "§a正确的格式为：{\"GUI\":\"GUI名称\",\"target\":\"目标玩家名称\",\"data\":{}}"
        );
        return;
    }
    //获取目标玩家
    let player = world.getPlayers({name: receive_data.target})[0];
    if (player == undefined) {
        error("The target player does not exist!");
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c 未找到目标玩家！请检查玩家名称是否正确！");
        return;
    }
    //打开GUI
    //判断GUI是否存在
    if (ALL_GUI.indexOf(receive_data.GUI) == -1) {
        error("The GUI does not exist!");
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c 未找到相应的GUI！请检查GUI名称是否正确！");
        return;
    }
    OpenGUI(player,receive_data.GUI);
})

const MainGUI = {
    "title": "服务器菜单",
    "body": "§l===========================\n"+
            "§eHi! §l§6%playername% §r§e欢迎回来！\n"+
            "§e您目前金币余额： §6§l*money*\n"+
            "§r§e您目前在线总时长为： §6§l*time*\n"+
            "§r§e当前物价指数为： §6§l%RN%\n"+
            "§r§l===========================\n"+
            "§r§c§l游玩中有问题找腐竹反馈！\n"+
            "祝您游玩愉快！\n"+
            "§r§l===========================",
    "buttons": [
        {
            "name": "立即回城\n点击后立即返回主城",
            "icon": "textures/blocks/chest_front",
            "type": "runCmd",
            "content": "tp @a[name=%playername%] 233 65 667",
            "opMenu": false
        },
        {
            "name": "立即回城（仅OP）\n点击后立即返回全新主城",
            "icon": "textures/blocks/chest_front",
            "type": "runCmd",
            "content": "tp @a[name=%playername%] 99735 55 284",
            "opMenu": true
        },
        {
            "name": "调节生存模式\n不调节生存你怎么开始玩？",
            "icon": "textures/ui/controller_glyph_color",
            "type": "runCmd",
            "content": "gamemode s %playername%",
            "opMenu": false
        },
        {
            "name": "调节观察者模式\n观察玩家吗，有意思",
            "icon": "textures/ui/controller_glyph_color",
            "type": "runCmd",
            "content": "gamemode spectator %playername%",
            "opMenu": true
        },
        {
            "name": "排行榜\n又到了我最喜欢的赛博斗蛐蛐时间",
            "icon": "textures/ui/MCoin",
            "type": "openGUI",
            "GUI": "RankingGUI",
            "opMenu": false
        },
        {
            "name": "设置\n在这里修改所有设置",
            "icon": "textures/ui/automation_glyph_color",
            "type": "openGUI",
            "GUI": "SetupGUI",
            "opMenu": false
        },
        {
            "name": "商店系统\n购买、卖出、赚钱？",
            "icon": "textures/ui/icon_blackfriday",
            "type": "openGUI",
            "GUI": "ShopGUI",
            "opMenu": false
        },
        {
            "name": "武器铺\n在这里强化你的元素武器!",
            "icon": "textures/ui/smithing_icon",
            "type": "runCmd",
            "content": "scriptevent mcnia:nx_openGUI {\"GUI\":\"EQGUI\",\"target\":\"%playername%\",\"data\":{}}",
            "opMenu": false
        },
        {
            "name": "传送系统\n快速传送到你的家",
            "icon": "textures/ui/icon_recipe_construction",
            "type": "openGUI",
            "GUI": "HomeGUI",
            "opMenu": false
        },
        {
            "name": "玩家传送系统\n传送到你的好基友那里",
            "icon": "textures/ui/dressing_room_skins",
            "type": "openGUI",
            "GUI": "TpaGUI",
            "opMenu": false
        },
        {
            "name": "兑换码系统\n礼品码在这里输入后即可兑换",
            "icon": "textures/ui/gift_square",
            "type": "openGUI",
            "GUI": "CdkGUI",
            "opMenu": false
        },
        {
            "name": "交易市场\n随心所欲，自由交易！",
            "icon": "textures/ui/enable_editor",
            "type": "openGUI",
            "GUI": "MarketGUI",
            "opMenu": false
        },
        {
            "name": "圈地系统\n保护属于自己的小家",
            "icon": "textures/ui/world_glyph_color",
            "type": "openGUI",
            "GUI": "LandGUI",
            "opMenu": false
        },
        {
            "name": "转账系统\n玩家间的转账",
            "icon": "textures/ui/icon_best3",
            "type": "openGUI",
            "GUI": "TransferGUI",
            "opMenu": false
        },
        {
            "name": "管理菜单\n点开即可开始管理服务器",
            "icon": "textures/ui/op",
            "type": "openGUI",
            "GUI": "OpGUI",
            "opMenu": true
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
        //检查玩家是否拥有管理权限
        if (player.hasTag(cfg.OPTAG)) {
            for (let i = 0; i < buttons.length; i ++) {
                MainForm.button(buttons[i].name,buttons[i].icon)
            }
        } else {
            for (let i = 0; i < buttons.length; i ++) {
                if (!buttons[i].opMenu) {
                    MainForm.button(buttons[i].name,buttons[i].icon)
                }
            }
        }
    MainForm.show(player).then((response) => {
        if (player.hasTag(cfg.OPTAG)) {
            if (!response.canceled) {
                switch (buttons[response.selection].type) {
                    case "runCmd":
                        let cmd = buttons[response.selection].content.replace("%playername%",player.nameTag)
                        RunCmd(cmd)
                        break;
                    case "openGUI":
                        OpenGUI(player,buttons[response.selection].GUI)
                        break;
                    default:
                        player.sendMessage(`§c 未找到相应的功能！请联系管理员！`,player.nameTag);
                        break;
                    //这里相当于一个自定义功能的实例
                    //case "goISLAND":
                        // if (GetScore("posX",player.nameTag) == 0 && GetScore("posY",player.nameTag) == 0 && GetScore("posZ",player.nameTag) == 0) {
                        //     player.sendMessage(`§c 未找到相应的主岛数据！请在领取空岛后使用本功能！`,player.nameTag)
                        // } else {
                        //     RunCmd(`tp @a[name=${player.nameTag}] ${GetScore("posX",player.nameTag)} ${GetScore("posY",player.nameTag)} ${GetScore("posZ",player.nameTag)}`)
                        //     player.sendMessage(`§a 已经将您传送至主岛！`,player.nameTag)
                        // }
                        // break;
                }
            }
        } else {
            if (!response.canceled) {
                //这里的目的是为了清除管理菜单
                let buttons = []
                for (let i = 0; i < MainGUI.buttons.length; i++) {
                    if (!MainGUI.buttons[i].opMenu) {
                        buttons.push(MainGUI.buttons[i])
                    }
                }
                switch (buttons[response.selection].type) {
                    case "runCmd":
                        let cmd = buttons[response.selection].content.replace("%playername%",player.nameTag)
                        RunCmd(cmd)
                        break;
                    case "openGUI":
                        OpenGUI(player,buttons[response.selection].GUI)
                        break;
                }
            }
        }
    })
}


function OpenGUI(player, GUINAME) {
    const GUIs = {
        MainGUI: () => Main(player),
        SetupGUI: () => SetupGUI.SetupMain(player),
        ShopGUI: () => ShopGUI.ShopMain(player),
        TpaGUI: () => TpaGUI.TpaMain(player),
        CdkGUI: () => CDKGUI(player),
        TransferGUI: () => TransferGUI.Transfer(player),
        OpGUI: () => OpGUI.CheckOP(player),
        MarketGUI: () => MarketGUI.Main(player),
        LandGUI: () => LandGUI.Main(player),
        HomeGUI: () => HomeGUI.HomeMain(player),
        RankingGUI: () => RankingGUI.Main(player)
    }
    ;(GUIs[GUINAME] || (() => {
        player.sendMessage("§c 未找到相应的GUI，请联系管理员！")
    }))()
}

//对于物品使用的检测
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == cfg.MENUITEM) {
        let player = event.source;
        Main(player)
    }
})

