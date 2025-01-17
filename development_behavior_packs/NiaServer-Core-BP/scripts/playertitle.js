import { world } from "@minecraft/server"
import { ActionFormData,ModalFormData,MessageFormData } from "@minecraft/server-ui"
import { log,warn,error } from "./API/logger";
import { ShopGUI } from './menu/shop.js';
import { cfg } from './config.js'

const MoneyShowName = cfg.MoneyShowName;
const MoneyScoreboardName = cfg.MoneyScoreboardName;

const title_data = {
    "title_c_op": {
        "title": "",
        "tag": "title_c_op",
        "type": "image",
        "can_buy": true,
        "show_in_shop": true,
        "price": 0,
        "description": "服务器管理员专用称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "op"
            },
            {
                "type": "scoreboard",
                "scoreboard": "money",
                "scoreboard_show_name": "金币",
                "operator": ">=",
                "value": 9999999999
            },
            {
                "type": "scoreboard",
                "scoreboard": "money",
                "scoreboard_show_name": "原神等级",
                "operator": ">=",
                "value": 60
            },
            {
                "type": "scoreboard",
                "scoreboard": "money",
                "scoreboard_show_name": "崩铁等级",
                "operator": ">=",
                "value": 60
            },
            {
                "type": "scoreboard",
                "scoreboard": "money",
                "scoreboard_show_name": "手机里mhy游戏个数",
                "operator": ">=",
                "value": 3
            },
        ],
    },
    "title_c_donator": {
        "title": "",
        "tag": "title_c_donator",
        "type": "image",
        "can_buy": true,
        "show_in_shop": true,
        "price": 100,
        "description": "服务器捐赠者专用称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "donator"
            },
            {
                "type": "scoreboard",
                "scoreboard": "menu",
                "operator": ">=",
                "value": 100
            }
        ],
    },
    "title_c_default":{
        "title": "",
        "tag": "title_c_default",
        "type": "image",
        "can_buy": true,
        "show_in_shop": true,
        "price": 0,
        "description": "普通玩家称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "normal"
            },
            {
                "type": "scoreboard",
                "scoreboard": "menu",
                "operator": ">=",
                "value": 100
            }
        ],
    },
    "title_default": {
        "title": "萌新一枚",
        "tag": "title_default",
        "type": "text",
        "can_buy": true,
        "show_in_shop": true,
        "price": 0,
        "description": "普通玩家称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "normal"
            },
            {
                "type": "scoreboard",
                "scoreboard": "menu",
                "operator": "<",
                "value": 100
            }
        ],
    },


}

var title = {};
var count = 0;
for (let key in title_data) {
    let show_key = "show_" + key;
    title[show_key] = title_data[key].title;
    count++;
}
log(`【称号系统】已成功加载${count}个称号！`);


function CheckScoreboard(player, scoreboard, score, checkMode) {
    const objective = world.scoreboard.getObjective(scoreboard);
    if (!objective) return false;
    const participant = objective.getParticipants().find(p => p.displayName === player.nameTag);
    if (!participant) return false;
    const playerScore = objective.getScore(participant);

    switch (checkMode) {
        case ">=": return playerScore >= score;
        case "<=": return playerScore <= score;
        case ">":  return playerScore >  score;
        case "<":  return playerScore <  score;
        case "==": return playerScore == score;
        case "!=": return playerScore != score;
        default:   return false;
    }
}


const GUI = {
    TitleShop(player) {
        const TitleShopForm = new ActionFormData()
        .title("称号商店")
        .body("请选择您要购买的称号")
        .button("返回上一级")
        for (let title_tag in title_data) {
            if (!title_data[title_tag].show_in_shop) {
                continue;
            }
            let button_content = "";
            if (title_data[title_tag].type == "image") {
                button_content = "§c[图标称号]";
            } else if (title_data[title_tag].type == "text") {
                button_content = "§8[普通称号]"
            }
            if (!title_data[title_tag].can_buy) {
                button_content = button_content + "§r§c[不可购买]§r";
            }
            button_content = button_content + " " + title_data[title_tag].title + "\n§0§l价格: §r§8" + title_data[title_tag].price + " " + MoneyShowName + "§0§l 简介：§r§8" + title_data[title_tag].description;
            TitleShopForm.button(button_content);
        };
        TitleShopForm.show(player).then((response) => {
            if (response.canceled) {
                ShopGUI.ShopMain(player);
            }
            if (response.selection == 0) {
                ShopGUI.ShopMain(player);
            } else {
                let i = 1;
                for (let title_tag in title_data) {
                    if (!title_data[title_tag].show_in_shop) {
                        continue;
                    }
                    if (i == response.selection && title_data[title_tag].can_buy) {
                        this.TitleShopSub(player,title_tag);
                    } else if (i == response.selection && !title_data[title_tag].can_buy) {
                        player.sendMessage("§c 称号 §r" + title_data[title_tag].title + "§r§c 暂时无法购买");
                    }
                    i++;
                }
            }
        });
    },

    TitleShopSub(player,title_tag) {
        let body = "";
        //称号要校验的条件
        if (title_data[title_tag].check_mode != "none") {
            if (title_data[title_tag].check_mode == "and") {
                body = "\n您需要满足以下全部条件才能购买称号\n";
            }
            if (title_data[title_tag].check_mode == "or") {
                body = "\n您需要满足以下条件之一才能购买称号\n";
            }
            let check_count = 0;
            for (let check of title_data[title_tag].check) {
                check_count++;
                body = body + check_count + ". ";
                if (check.type == "tag") {
                    if (check.operator == "==") {
                        body = `${body}拥有tag标签: §r§6${check.value}§r ${player.hasTag(check.value) ? "§a√" : "§c×"}§r\n`;
                    } else if (check.operator == "!=") {
                        body = `${body}没有tag标签: §r§6${check.value}§r ${!player.hasTag(check.value) ? "§a√" : "§c×"}§r\n`;
                    } else {
                        body = body + "未知的tag操作符: §r§6" + check.operator + "§r\n";
                    }
                } else if (check.type == "scoreboard") {
                    switch (check.operator) {
                        case ">=":
                            body = `${body}§r§6${check.scoreboard_show_name}§r §r大于等于§r§6 ${check.value} ${CheckScoreboard(player, check.scoreboard, check.value, check.operator) ? "§a√" : "§c×"}§r\n`;
                            break;
                        case "<=":
                            body = `${body}§r§6${check.scoreboard_show_name}§r §r小于等于§r§6 ${check.value} ${CheckScoreboard(player, check.scoreboard, check.value, check.operator) ? "§a√" : "§c×"}§r\n`;
                            break;
                        case ">":
                            body = `${body}§r§6${check.scoreboard_show_name}§r §r大于§r§6 ${check.value} ${CheckScoreboard(player, check.scoreboard, check.value, check.operator) ? "§a√" : "§c×"}§r\n`;
                            break;
                        case "<":
                            body = `${body}§r§6${check.scoreboard_show_name}§r §r小于§r§6 ${check.value} ${CheckScoreboard(player, check.scoreboard, check.value, check.operator) ? "§a√" : "§c×"}§r\n`;
                            break;
                        case "==":
                            body = `${body}§r§6${check.scoreboard_show_name}§r §r等于§r§6 ${check.value} ${CheckScoreboard(player, check.scoreboard, check.value, check.operator) ? "§a√" : "§c×"}§r\n`;
                            break;
                        case "!=":
                            body = `${body}§r§6${check.scoreboard_show_name}§r §r不等于§r§6 ${check.value} ${CheckScoreboard(player, check.scoreboard, check.value, check.operator) ? "§a√" : "§c×"}§r\n`;
                            break;
                        default:
                            body = body + "未知的计分板操作符: §r§6" + check.operator + "§r\n";
                            break;
                    }
                } else {
                    body = body + "未知的条件类型: §r§8" + check.type + "\n";
                }

            }
        }

        const TitleShopSubForm = new ActionFormData()
        .title("称号购买确认")
        .body("您确定要购买称号 " + title_data[title_tag].title + " 吗？\n"+
            "称号价格：§r§6 " + title_data[title_tag].price + " §r" + MoneyShowName + "\n"+
            "称号简介：" + title_data[title_tag].description + "\n" + body
        )
        .button("确认购买")
        .button("返回上一级")
        .show(player).then((response) => {
            if (response.canceled) {
                this.TitleShop(player);
            }
            if (response.selection == 0) {
                //开始检查玩家是否拥有称号
                if (player.hasTag(title_data[title_tag].tag)) {
                    player.sendMessage("§c 您已经拥有称号 " + title_data[title_tag].title + " 了，无需重复购买");
                    return;
                }
                //开始检查玩家是否满足购买条件
                let check_result = true;
                if (title_data[title_tag].check_mode == "and") {
                    for (let check of title_data[title_tag].check) {
                        if (check.type == "tag") {
                            if (check.operator == "==") {
                                if (!player.hasTag(check.value)) {
                                    player.sendMessage("§c 购买 " + title_data[title_tag].title + " 失败! 您不满足称号购买条件: 拥有tag标签 " + check.value);
                                    check_result = false;
                                    break;
                                }
                            } else if (check.operator == "!=") {
                                if (player.hasTag(check.value)) {
                                    player.sendMessage("§c 购买 " + title_data[title_tag].title + " 失败! 您不满足称号购买条件: 没有tag标签 " + check.value);
                                    check_result = false;
                                    break;
                                }
                            }
                        } else if (check.type == "scoreboard") {
                            if (!CheckScoreboard(player, check.scoreboard, check.value, check.operator)) {
                                check_result = false;
                                player.sendMessage("§c 购买 " + title_data[title_tag].title + " 失败! 您不满足称号购买条件: " + check.scoreboard_show_name + " " + check.operator + " " + check.value);
                                break;
                            }
                        }
                    }
                    if (!check_result) {
                        return;
                    }
                } else if (title_data[title_tag].check_mode == "or") {
                    check_result = false;
                    for (let check of title_data[title_tag].check) {
                        if (check.type == "tag") {
                            if (check.operator == "==") {
                                if (player.hasTag(check.value)) {
                                    check_result = true;
                                    break;
                                }
                            } else if (check.operator == "!=") {
                                if (!player.hasTag(check.value)) {
                                    check_result = true;
                                    break;
                                }
                            }
                        } else if (check.type == "scoreboard") {
                            if (CheckScoreboard(player, check.scoreboard, check.value, check.operator)) {
                                check_result = true;
                                break;
                            }
                        }
                    }
                    if (!check_result) {
                        player.sendMessage("§c 购买 " + title_data[title_tag].title + " 失败! 您没有一项满足称号购买条件");
                        return;
                    }
                } else if (title_data[title_tag].check_mode == "none") {
                    check_result = true;
                }
                //检查玩家是否有足够的金币
            // if (!world.scoreboard.getObjective(MoneyScoreboardName)) return false;
            // const participant = objective.getParticipants().find(p => p.displayName === player.nameTag);
            // if (!participant) return false;
            // const playerScore = objective.getScore(participant);

            } else{
                this.TitleShop(player);
            }
        });

    }

}

export const TitleGUI = GUI;

//对于物品使用的检测
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick") {
        let player = event.source;
        GUI.TitleShop(player);
    }
})

