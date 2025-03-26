import { system, world, ItemStack } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui';
import { ExternalFS } from "../API/http";
import { log, error } from "../API/logger";
import { cfg } from "../config";

const fs = new ExternalFS();

const player_data = {
    "scoreboard": {

    },
    "inventory": {

    },
    "tag": {

    },

}

let player_sign_in = {}

system.run(() => {
    fs.GetJSONFileData("player_sign_in.json").then((response) => {
        if (response === 0) {
            fs.CreateNewJsonFile("player_sign_in.json", {}).then((result) => {
                if (result === "success") {
                    player_sign_in = {};
                    log("【签到系统】在获取签到系统数据文件 player_sign_in.json 不存在，已成功创建");
                } else if (result === -1) {
                    error("【签到系统】在创建签到系统数据文件 player_sign_in.json 时与NIAHttpBOT连接失败");
                }
            });
        } else if (response === -1) {
            error("【签到系统】在获取签到系统数据文件 player_sign_in.json 时与NIAHttpBOT连接失败");
        } else {
            player_sign_in = response;
            log("【签到系统】成功获取签到系统数据文件 player_sign_in.json");
        }
    })
    fs.GetJSONFileData("announcement.json").then((response) => {
        if (response === 0) {
            fs.CreateNewJsonFile("announcement.json", announcement).then((result) => {
                if (result === "success") {
                    log("【公告系统】在获取公告数据文件 announcement.json 不存在，已成功创建");
                } else if (result === -1) {
                    error("【公告系统】在创建公告数据文件 announcement.json 时与NIAHttpBOT连接失败");
                }
            });
        } else if (response === -1) {
            error("【公告系统】在获取公告数据文件 announcement.json 时与NIAHttpBOT连接失败");
        } else {
            announcement = response;
            log("【公告系统】成功获取公告数据文件 announcement.json");
        }
    })
})



//读取公告数据
let announcement = {
    "update_time": "20190128",
    "content": [
        "默认公告内容"
    ]
}


world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        if (event.player.getDynamicProperty("has_read_announcement") != announcement.update_time) {
            EnterGUI.Announcement(event.player);
        } else {
            EnterGUI.SignIn(event.player);
        }
    }
})


function generateCalendar(player) {

    const nowdate = new Date()
    const date = new Date(nowdate.getTime() + 28800000);
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth(); // 0-11
    const currentDay = date.getDate();

    // 获取月份信息
    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    const seasonDesc = {
        0: "冬去春来", 1: "立春时节", 2: "春暖花开",
        3: "春色满园", 4: "初夏时光", 5: "炎炎夏日",
        6: "盛夏光年", 7: "秋风送爽", 8: "金秋时节",
        9: "秋高气爽", 10: "冬日将至", 11: "冰雪世界"
    };

    // 获取当月第一天是星期几 (0-6, 0是星期日)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // 获取当月天数
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 创建日历头部
    let calendarStr = `                  ${monthNames[currentMonth]}·${seasonDesc[currentMonth]} \n\n`;
    calendarStr += "        §fSun  §6Mon  §cTue  §eWed  §aThu  §bFri  §dSat\n";

    // 创建日期网格
    let dayCount = 1;
    let weekStr = "         ";

    // 添加第一行前的空格
    for (let i = 0; i < firstDay; i++) {
        weekStr += "     ";
    }

    // 填充日期
    for (let i = firstDay; i < 7; i++) {
        // 格式化日期，确保两位数
        const dayStr = dayCount < 10 ? "0" + dayCount : dayCount.toString();

        if (player_sign_in[player.name] &&
            player_sign_in[player.name][currentYear] &&
            player_sign_in[player.name][currentYear][currentMonth + 1] &&
            player_sign_in[player.name][currentYear][currentMonth + 1].includes(dayStr)) {
            // 判断是否已签到
            weekStr += `§a${dayStr}§r`;
        } else if (dayCount === currentDay) {
            weekStr += `§e${dayStr}§r`;
        } else {
            weekStr += `§c${dayStr}§r`;
        }

        // 添加空格或换行
        if (i === 6) {
            weekStr += "\n";
        } else {
            weekStr += "   ";
        }

        dayCount++;
    }

    calendarStr += weekStr;

    // 填充剩余周
    while (dayCount <= daysInMonth) {
        weekStr = "         ";

        for (let i = 0; i < 7 && dayCount <= daysInMonth; i++) {
            const dayStr = dayCount < 10 ? "0" + dayCount : dayCount.toString();

            if (player_sign_in[player.name] &&
                player_sign_in[player.name][currentYear] &&
                player_sign_in[player.name][currentYear][currentMonth + 1] &&
                player_sign_in[player.name][currentYear][currentMonth + 1].includes(dayStr)) {
                // 判断是否已签到
                weekStr += `§a${dayStr}§r`;
            } else if (dayCount === currentDay) {
                weekStr += `§e${dayStr}§r`;
            } else {
                weekStr += `§c${dayStr}§r`;
            }

            // 添加空格或换行
            if (i === 6 || dayCount === daysInMonth) {
                weekStr += "\n";
            } else {
                weekStr += "   ";
            }

            dayCount++;
        }

        calendarStr += weekStr;
    }

    calendarStr += "\n";
    return calendarStr;
}

export const EnterGUI = {
    SignIn(player) {
        const SignForm = new ActionFormData();
        SignForm.title("§b每日签到");
        SignForm.body(generateCalendar(player) +
            "§6       今日签到奖励： " +
            "§b 金币 * 233 " +
            "§b 钻石 * 1"
        );
        SignForm.button("签到")
        SignForm.show(player).then((response) => {
            if (response.cancelationReason == "UserBusy") {
                this.SignIn(player);
            }
            if (response.selection == 0) {
                let nowdate = new Date()
                let date = new Date(nowdate.getTime() + 28800000);
                let currentYear = date.getFullYear();
                let currentMonth = date.getMonth(); // 0-11
                let currentDay = date.getDate();
                //确保日期是两位数
                currentDay = currentDay < 10 ? "0" + currentDay : currentDay.toString();
                if (player_sign_in[player.name] &&
                    player_sign_in[player.name][currentYear] &&
                    player_sign_in[player.name][currentYear][currentMonth + 1] &&
                    player_sign_in[player.name][currentYear][currentMonth + 1].includes(currentDay)) {
                    player.sendMessage("§c 您今天已经签到过了哦~");
                    return;
                } else {
                    let old_player_sign_in = JSON.parse(JSON.stringify(player_sign_in));
                    if (!player_sign_in[player.name]) {
                        player_sign_in[player.name] = {};
                    }
                    if (!player_sign_in[player.name][currentYear]) {
                        player_sign_in[player.name][currentYear] = {};
                    }
                    if (!player_sign_in[player.name][currentYear][currentMonth + 1]) {
                        player_sign_in[player.name][currentYear][currentMonth + 1] = [];
                    }
                    player_sign_in[player.name][currentYear][currentMonth + 1].push(currentDay);
                    fs.OverwriteJsonFile("player_sign_in.json", player_sign_in).then((response) => {
                        if (response === "success") {
                            player.sendMessage("§a 签到成功！祝您今日游戏愉快~");
                            player.playSound("random.levelup");
                            world.scoreboard.getObjective(cfg.MoneyScoreboardName).addScore(player, 233);
                            let diamond = new ItemStack("minecraft:diamond", 1);
                            diamond.setLore(["§6签到获得"]);
                            player.getComponent("minecraft:inventory").container.addItem(diamond);
                        } else {
                            player.sendMessage("§a 签到失败，这不是您的错误，请联系管理员处理...");
                            player_sign_in = old_player_sign_in;
                        }
                    })
                }

            }
        })
    },

    Announcement(player) {
        let body_str = "";
        announcement.content.forEach((line) => {
            body_str += line + "\n";
        })
        const AnnouncementForm = new ActionFormData();
        AnnouncementForm.title("公告");
        AnnouncementForm.body(body_str);
        AnnouncementForm.button("我知道了");
        AnnouncementForm.button("下一次不再显示");
        AnnouncementForm.show(player).then((response) => {
            if (response.cancelationReason == "UserBusy") {
                this.Announcement(player);
            }
            if (response.selection == 1) {
                player.setDynamicProperty("has_read_announcement", announcement.update_time);
                EnterGUI.SignIn(player);
            }
        })
    },



    Welcome(player) {
        const WelcomeForm = new ActionFormData();
        WelcomeForm.title("数据同步中提醒");
        WelcomeForm.body("\n\n\n您的玩家数据正在与其他服务器数据进行同步中，请稍后...\n\n\n" + system.currentTick);
        WelcomeForm.button("查看同步进度");
        WelcomeForm.show(player).then((response) => {
            if (response.cancelationReason == "UserBusy") {
                this.welcome_form(player);
            }
        })
    }
}

// world.afterEvents.itemUse.subscribe(event => {
//     if (event.itemStack.typeId == "minecraft:stick") {
//         GUI.sign_in(event.source);
//     }
// })
