import { world,ItemStack } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui';
import { log } from "../API/logger.js";


const task_data = {
    "ZHCN0100000":{
        "type": "text",
        "name": "第一章 重生之我是鱼人",
        "format": "center",
        "description": [
            "§b========================",
            "章 节 简 介",
            "§b========================",
            "",
            "§6欢迎来到这个魔幻的水世界",
            "",
            "根据本章的任务内容",
            "",
            "你将了解这个世界的一些基本规则",
            "",
            "并且学会如何在这个世界生存下去...",
            "",
            "                          §b-鸽子腐竹"
        ],
        "checkmode": "none",
        "check":[],
        "reward": [
            {
                "type": "scoreboard",
                "scoreboard": "money",
                "mode": "add",
                "value": 100,
                "description": "金币 §6* 100",
            },
            {
                "type": "tag",
                "tag": "title_start",
                "operator": "add",
                "description": "称号-梦开始的地方",
            },
            {
                "type": "item",
                "item": "minecraft:iron_sword",
                "count": 1,
                "description": "铁剑一个"
            }
        ],
        "button": {
            "启动！": "ZHCN0100100"
        }
    },
    "ZHCN0100100":{
        "type": "text",
        "name": "第一章 重生之我是鱼人",
        "format": "left",
        "description": [
            "§6任务目标：",
            "§6- 采集一些木头",
            "§6- 制作一个工作台",
            "§6- 制作一把木剑",
            "",
            "§6任务奖励：",
            "§6- 金币 * 100",
            "§6- XX称号",
            "§6- 铁剑一个",
            "",
            "§6任务提示：",
            "§6- 任务目标在任务界面中查看",
            "§6- 任务奖励在任务完成后查看",
            "",
        ],
        "checkmode": "and",
        "check":[
            {
                "type": "item",
                "item": "minecraft:wood",
                "count": 10,
                "fail_info": "\n\n\n\n\n§c要求拥有§e10个木头\n\n§c请在获取足够木头后再次提交任务\n\n\n\n\n\n"
            },
            {
                "type": "item",
                "item": "minecraft:crafting_table",
                "count": 1,
                "fail_info": "\n\n\n\n\n§c要求拥有§e一个工作台\n\n§c请在获取工作台后再次提交任务\n\n\n\n\n\n"
            },
            {
                "type": "item",
                "item": "minecraft:wooden_sword",
                "count": 1,
                "fail_info": "\n\n\n\n\n§c要求拥有§e一把木剑\n\n§c请在获取木剑后再次提交任务\n\n\n\n\n\n"
            }
        ],
        "reward": [
            {
                "type": "scoreboard",
                "scoreboard": "money",
                "mode": "add",
                "value": 100,
                "description": "金币 §6* 100",
            },
            {
                "type": "tag",
                "tag": "test",
                "operator": "add",
                "description": "XX称号",
            },
            {
                "type": "item",
                "item": "minecraft:iron_sword",
                "count": 1,
                "description": "铁剑一个"
            },
            {
                "type": "command",
                "dimension": "minecraft:overworld",
                "command": "give @s minecraft:iron_sword 1",
                "description": "铁剑一个"
            }
        ],
        "button": {
            "下一节": "ZHCN0100200"
        }
    },
}


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
    TaskMain(player) {},

    TaskSub(player,task_id) {
        if (task_data[task_id] == undefined) {
            return false;
        }
        let task = task_data[task_id];
        let body = "";
        switch (task.format) {
            case "center":
                for (let i = 0; i < task.description.length; i++) {
                    let width = 0;
                    for (const char of task.description[i]) {
                        if (char === "§") {
                            width -= 1;
                        } else if (/[\u4e00-\u9fa5]/.test(char)) {
                            width += 2;
                        } else {
                            width += 1;
                        }
                    }
                    let blank_space_num = ((48 - width) / 2).toFixed(0);
                    body += " ".repeat(blank_space_num) + task.description[i] + "\n";
                }
                break;
            case "left":
                for (let i = 0; i < task.description.length; i++) {
                    body += task.description[i] + "\n";
                }
                break;
            case "right":
                for (let i = 0; i < task.description.length; i++) {
                    let width = 0;
                    for (const char of task.description[i]) {
                        if (char === "§") {
                            width -= 1;
                        } else if (/[\u4e00-\u9fa5]/.test(char)) {
                            width += 2;
                        } else {
                            width += 1;
                        }
                    }
                    let blank_space_num = (48 - width).toFixed(0);
                    body += " ".repeat(blank_space_num) + task.description[i] + "\n";
                }
                break;
            default:
                body = "§c任务描述解析错误！";
                break;
        }

        switch (task.type) {
            case "text":
                const chapter_form = new ActionFormData()
                .title(task.name)
                .body(body)
                for (const key in task.button) {
                    chapter_form.button(key);
                }
                chapter_form.show(player).then((response) => {
                    if (response.canceled) {
                        return;
                    }
                    //检查玩家是否满足任务条件
                    switch (task.checkmode) {
                        case "none":
                            break;
                        case "and":
                            for (const check of task.check) {
                                switch (check.type) {
                                    case "item":
                                        let item_count = 0;
                                        for (let i = 0; i < 36; i++) {
                                            let item = player.getComponent("minecraft:inventory").container.getItem(i);
                                            if (item != undefined && item.typeId == check.item) {
                                                item_count = item.amount + item_count;
                                            }
                                        }
                                        if (item_count < check.count) {
                                            this.TaskNotComplete(player,task_id,check.fail_info);
                                            return;
                                        }
                                        break;
                                    // case "xp":
                                    //     if (player.xpEarnedAtCurrentLevel < check.level) {
                                    //         this.TaskNotComplete(player,task_id,`\n\n\n\n\n§c你的经验等级§e ${player.xpEarnedAtCurrentLevel} §不满足任务要求 §e ${check.level}\n\n请通过其他方式获取经验后再次尝试！\n\n\n\n\n\n`);
                                    //         return;
                                    //     }
                                    //     break;
                                    case "scoreboard":
                                        if (!CheckScoreboard(player, check.scoreboard, check.value, check.operator)) {
                                            this.TaskNotComplete(player,task_id,check.fail_info);
                                            return;
                                        }
                                        break;
                                    case "tag":
                                        if (check.operator == "==") {
                                            if (!player.hasTag(check.tag)) {
                                                this.TaskNotComplete(player,task_id,check.fail_info);
                                                return;
                                            }
                                         } else if (check.operator == "!=") {
                                            if (player.hasTag(check.tag)) {
                                                this.TaskNotComplete(player,task_id,check.fail_info);
                                                return;
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case "or":
                            let check_result = false;
                            for (const check of task.check) {
                                switch (check.type) {
                                    case "item":
                                        let item_count = 0;
                                        for (let i = 0; i < 36; i++) {
                                            let item = player.getComponent("minecraft:inventory").container.getItem(i);
                                            if (item != undefined && item.typeId == check.item) {
                                                item_count = item.amount + item_count;
                                            }
                                        }
                                        log(item_count);
                                        if (item_count >= check.count) {
                                            check_result = true;
                                            break;
                                        }
                                        break;
                                    // case "xp":
                                    //     if (player.xpEarnedAtCurrentLevel >= check.level) {
                                    //         check_result = true;
                                    //         break;
                                    //     }
                                    //     break;
                                    case "scoreboard":
                                        if (CheckScoreboard(player, check.scoreboard, check.value, check.operator)) {
                                            check_result = true;
                                            break;
                                        }
                                        break;
                                    case "tag":
                                        if (check.operator == "==") {
                                            if (player.hasTag(check.tag)) {
                                                check_result = true;
                                                break;
                                            }
                                            } else if (check.operator == "!=") {
                                                if (!player.hasTag(check.tag)) {
                                                    check_result = true;
                                                    break;
                                                }
                                            }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if (!check_result) {
                                this.TaskNotComplete(player,task_id,`§c任务条件未达成，请完成任务条件后再次尝试！`);
                            } else {
                                log("任务条件已达成！");
                            }
                            break;
                        default:
                            break;
                    }

                    let reward_description = "";
                    let reward_count = 1;
                    for (const reward of task.reward) {
                        switch (reward.type) {
                            case "item":
                                let item = new ItemStack(reward.item, reward.count);
                                player.getComponent("minecraft:inventory").container.addItem(item);
                                reward_description += `§e${reward_count}. ${reward.description}\n`;
                                reward_count++;
                                break;
                            case "command":
                                world.getDimension(reward.dimension).runCommand(reward.command);
                                reward_description += `§e${reward_count}. ${reward.description}\n`;
                                reward_count++;
                                break;
                            case "scoreboard":
                                if (reward.mode == "add") {
                                    world.scoreboard.getObjective(reward.scoreboard).addScore(player,reward.value);
                                    reward_description += `§e${reward_count}. ${reward.description}\n`;
                                    reward_count++;
                                } else if (reward.mode == "remove") {
                                    world.scoreboard.getObjective(reward.scoreboard).addScore(player,-reward.value);
                                    reward_description += `§e${reward_count}. ${reward.description}\n`;
                                    reward_count++;
                                }
                                break;
                            case "tag":
                                if (reward.operator == "add") {
                                    player.addTag(reward.tag);
                                    reward_description += `§e${reward_count}. ${reward.description}\n`;
                                    reward_count++;
                                } else if (reward.operator == "remove") {
                                    player.removeTag(reward.tag);
                                    reward_description += `§e${reward_count}. ${reward.description}\n`;
                                    reward_count++;
                                }
                                break;
                            default:
                                break;
                        }
                    }

                    let i = 0;
                    for (const key in task.button) {
                        if (i == response.selection) {
                            //添加完成标记
                            //暂时不做
                            if (reward_description == "") {
                                this.TaskSub(player,task.button[key]);
                            } else {
                                this.TaskComplete(player,task.button[key],reward_description);
                            }
                        }
                        i++;
                    }
                })
                break;
            default:
                const error_form = new ActionFormData()
                .title(task.name)
                .body("§c任务类型解析错误！")
                error_form.show(player)
                break;
        }

    },
    //提示玩家未满足任务条件
    TaskNotComplete(player,task_id,fail_info) {
        const task_not_complete_form = new ActionFormData()
        .title("任务完成条件未达成")
        .body(fail_info)
        .button("返回任务界面")
        task_not_complete_form.show(player).then((response) => {
            if (response.canceled) {
                return;
            }
            GUI.TaskSub(player,task_id);
        })
    },

    //任务完成
    TaskComplete(player,task_id,description) {
        const task_complete_form = new ActionFormData()
        .title("任务完成奖励")
        .body(description)
        .button("下一个任务")
        task_complete_form.show(player).then((response) => {
            if (response.canceled) {
                return;
            }
            GUI.TaskSub(player,task_id);
        })
    }
}








