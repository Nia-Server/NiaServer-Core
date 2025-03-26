import { system, world } from "@minecraft/server"
import { ActionFormData,ModalFormData,MessageFormData } from "@minecraft/server-ui"
import { log,warn,error } from "../API/logger.js";
import { ShopGUI } from './shop.js';
import { SetupGUI } from './setup.js';
import { cfg } from '../config.js'
import { ExternalFS } from "../API/http.js";

const fs = new ExternalFS();
const MoneyShowName = cfg.MoneyShowName;
const MoneyScoreboardName = cfg.MoneyScoreboardName;

let title_data = {};

system.run(() => {
    fs.GetJSONFileData("title_data.json").then((result) => {
        //文件不存在
        if (result === 0) {
            fs.CreateNewJsonFile("title_data.json",{}).then((result) => {
                if (result === "success") {
                    title_data = {};
                    log("【称号系统】在获取称号数据文件 title_data.json 时发现文件不存在，已自动创建");
                } else if (result === -1) {
                    error("【称号系统】在获取称号数据文件 title_data.json 时与NIAHttpBOT连接失败");
                }
            });
        } else if (result === -1) {
            error("【称号系统】在获取称号数据文件 title_data.json 时与NIAHttpBOT连接失败");
        } else {
            //文件存在且服务器连接成功
            title_data = result;
            log("【称号系统】称号数据文件 title_data.json 获取成功");
        }
    })

})




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
        const form = new ActionFormData()
            .title("称号商店")
            .body("请选择您要购买的称号")
            .button("返回上一级");

        for (const [tagKey, tagInfo] of Object.entries(title_data)) {
            if (!tagInfo.show_in_shop) continue;
            let content = tagInfo.type === "image" ? "§c[图标称号]" : "§8[普通称号]";
            if (!tagInfo.can_buy) content += "§r§c[不可购买]§r";
            content += ` ${tagInfo.title}\n§0§l价格: §r§8${tagInfo.price} ${MoneyShowName} §0§l简介：§r§8${tagInfo.description}`;
            form.button(content);
        }

        form.show(player).then(response => {
            if (response.canceled || response.selection === 0) return ShopGUI.ShopMain(player);

            let index = 1;
            for (const [tagKey, tagInfo] of Object.entries(title_data)) {
                if (!tagInfo.show_in_shop) continue;
                if (index === response.selection) {
                    return tagInfo.can_buy
                        ? this.TitleShopSub(player, tagKey)
                        : player.sendMessage(`§c 称号 §r${tagInfo.title}§r§c 暂时无法购买`);
                }
                index++;
            }
        });
    },

    TitleShopSub(player, title_tag) {
        const data = title_data[title_tag];
        let body = "";

        if (data.check_mode !== "none") {
            body += data.check_mode === "and"
                ? "\n您需要满足以下全部条件才能购买称号\n"
                : "\n您需要满足以下条件之一才能购买称号\n";
            let count = 0;
            for (const chk of data.check) {
                count++;
                body += `${count}. `;
                if (chk.type === "tag") {
                    const hasTag = player.hasTag(chk.value);
                    if (["==", "!="].includes(chk.operator)) {
                        const msg = chk.operator === "=="
                            ? `拥有tag标签: §r§6${chk.value}§r ${hasTag ? "§a✔" : "§c✘"}§r\n`
                            : `没有tag标签: §r§6${chk.value}§r ${!hasTag ? "§a✔" : "§c✘"}§r\n`;
                        body += msg;
                    } else {
                        body += `未知的tag操作符: §r§6${chk.operator}§r\n`;
                    }
                } else if (chk.type === "scoreboard") {
                    const passed = CheckScoreboard(player, chk.scoreboard, chk.value, chk.operator) ? "§a✔" : "§c✘";
                    switch (chk.operator) {
                        case ">=":
                            body += `§r§6${chk.scoreboard_show_name}§r 大于等于§r§6 ${chk.value} ${passed}§r\n`;
                            break;
                        case "<=":
                            body += `§r§6${chk.scoreboard_show_name}§r 小于等于§r§6 ${chk.value} ${passed}§r\n`;
                            break;
                        case ">":
                            body += `§r§6${chk.scoreboard_show_name}§r 大于§r§6 ${chk.value} ${passed}§r\n`;
                            break;
                        case "<":
                            body += `§r§6${chk.scoreboard_show_name}§r 小于§r§6 ${chk.value} ${passed}§r\n`;
                            break;
                        case "==":
                            body += `§r§6${chk.scoreboard_show_name}§r 等于§r§6 ${chk.value} ${passed}§r\n`;
                            break;
                        case "!=":
                            body += `§r§6${chk.scoreboard_show_name}§r 不等于§r§6 ${chk.value} ${passed}§r\n`;
                            break;
                        default:
                            body += `未知的计分板操作符: §r§6${chk.operator}§r\n`;
                    }
                } else {
                    body += `未知的条件类型: §r§8${chk.type}\n`;
                }
            }
        }

        new ActionFormData()
            .title("称号购买确认")
            .body(
                `您确定要购买称号 ${data.title} §r吗？\n称号价格：§r§6${data.price} §r${MoneyShowName}\n` +
                `称号简介：${data.description}\n${body}`
            )
            .button("确认购买")
            .button("返回上一级")
            .show(player)
            .then(response => {
                if (response.canceled) return this.TitleShop(player);
                if (response.selection !== 0) return this.TitleShop(player);

                if (player.hasTag(data.tag)) {
                    return player.sendMessage(`§c 您已经拥有称号 §r${data.title}§r§c 了，无需重复购买`);
                }

                // 购买条件检查
                let checkPassed = data.check_mode === "none";
                if (data.check_mode === "and") {
                    checkPassed = data.check.every(chk => {
                        if (chk.type === "tag") {
                            const hasTag = player.hasTag(chk.value);
                            if (
                                (chk.operator === "==" && !hasTag) ||
                                (chk.operator === "!=" && hasTag)
                            ) {
                                player.sendMessage(`§c 购买 §r${data.title} §r§c失败! 您不满足条件: ${chk.operator === "==" ? "拥有" : "没有"}tag标签 ${chk.value}`);
                                return false;
                            }
                            return true;
                        } else if (chk.type === "scoreboard") {
                            if (!CheckScoreboard(player, chk.scoreboard, chk.value, chk.operator)) {
                                player.sendMessage(`§c 购买 §r${data.title} §r§c失败! 您不满足条件: ${chk.scoreboard_show_name} ${chk.operator} ${chk.value}`);
                                return false;
                            }
                            return true;
                        }
                        return true;
                    });
                } else if (data.check_mode === "or") {
                    checkPassed = data.check.some(chk => {
                        if (chk.type === "tag") {
                            return (chk.operator === "==" && player.hasTag(chk.value)) ||
                                   (chk.operator === "!=" && !player.hasTag(chk.value));
                        } else if (chk.type === "scoreboard") {
                            return CheckScoreboard(player, chk.scoreboard, chk.value, chk.operator);
                        }
                    });
                    if (!checkPassed) player.sendMessage(`§c 购买 §r${data.title} §r§c失败! 您没有一项满足称号购买条件`);
                }
                if (!checkPassed) return;

                // 金币检查
                const obj = world.scoreboard.getObjective(MoneyScoreboardName);
                if (!obj) {
                    return player.sendMessage(`§c 购买 §r${data.title} §r§c失败! 计分板 ${MoneyScoreboardName} 未找到`);
                }
                const part = obj.getParticipants().find(p => p.displayName === player.nameTag);
                if (!part) {
                    return player.sendMessage(`§c 购买 §r${data.title} §r§c失败! 未找到您的${MoneyShowName}数据`);
                }
                const score = obj.getScore(part);
                if (score < data.price) {
                    return player.sendMessage(`§c 购买 §r${data.title} §r§c失败! 您的${MoneyShowName}余额不足`);
                }
                // 扣费并添加称号
                obj.setScore(part, score - data.price);
                player.addTag(data.tag);
                player.sendMessage(`§a 购买称号 §r${data.title} §r§a成功，消耗 ${data.price} ${MoneyShowName}`);
            });
    },

    TitleSetUp(player) {
        const form = new ActionFormData()
            .title("称号设置")
            .body("请选择您要使用的称号")
            .button("返回上一级")
            .button("取消佩戴");
        let button = "";
        for (const [tagKey, tagInfo] of Object.entries(title_data)) {
            if (player.hasTag(tagKey)) {
                button = player.hasTag(`show_${tagKey}`) ? `§a[佩戴中]` : `§c[未佩戴]`;
                button += tagInfo.type === "image" ? "§c[图标称号]§r" : "§8[普通称号]§r";
                button += ` ${tagInfo.title}\n`;
                button += `§0§l简介：§r§8${tagInfo.description}`;
                form.button(button);
            }
        }
        form.show(player).then(response => {
            if (response.canceled || response.selection === 0) return SetupGUI.SetupMain(player);
            if (response.selection === 1) {
                let player_tags = player.getTags();
                player_tags.forEach(tag => {
                    if (tag.startsWith("show_title")) {
                        player.removeTag(tag);
                        player.sendMessage("§a 成功取消佩戴称号");
                    }
                });
                return this.TitleSetUp(player);
            }

            let index = 0;
            for (const [tagKey, tagInfo] of Object.entries(title_data)) {
                if (player.hasTag(tagKey)) {index++} else {continue}
                if (index === response.selection - 1) {
                    let player_tags = player.getTags();
                    //移除前缀是show_title的所有tag
                    player_tags.forEach(tag => {
                        if (tag.startsWith("show_title")) {
                            player.removeTag(tag);
                        }
                    });
                    player.addTag(`show_${tagKey}`);
                    return this.TitleSetUp(player);
                }
            }
        });
    }

}


// const command = ["back"]

export function get_player_title(player) {
    let player_tags = player.getTags();
    let title = "";
    player_tags.forEach(tag => {
        if (tag.startsWith("show_title")) {
            let tagKey = tag.replace("show_", "");
            let tagInfo = title_data[tagKey];
            if (tagInfo.type === "image") {
                title = `${tagInfo.title}`;
            } else if (tagInfo.type === "text") {
                title = `[${tagInfo.title}§r]`;
            }
        }
    });
    return title;
}

// world.beforeEvents.chatSend.subscribe(event => {
//     if (command.includes(event.message)) return;
//     event.cancel = true;
//     let player = event.sender;
//     let message =  `<${player.name}> ${event.message}`;
//     let title = "";
//     let player_tags = player.getTags();
//     player_tags.forEach(tag => {
//         if (tag.startsWith("show_title")) {
//             let tagKey = tag.replace("show_", "");
//             let tagInfo = title_data[tagKey];
//             if (tagInfo.type === "image") {
//                 title = `${tagInfo.title}`;
//             } else if (tagInfo.type === "text") {
//                 title = `[${tagInfo.title}§r]`;
//             }
//         }
//     });
//     world.sendMessage(title + message);
// })

export const TitleGUI = GUI;

