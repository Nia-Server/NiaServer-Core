import { SignSide, system, world } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui';


const player_data = {
    "scoreboard": {

    },
    "inventory": {

    },
    "tag": {

    },

}

const player_sign_in = {
    "NIANIANKNIA": []
}

world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        GUI.sign_in(event.player);
    }
})

function generateCalendar() {
    const date = new Date();
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
    let weekStr = "         §c";

    // 添加第一行前的空格
    for (let i = 0; i < firstDay; i++) {
        weekStr += "     ";
    }

    // 填充日期
    for (let i = firstDay; i < 7; i++) {
        // 格式化日期，确保两位数
        const dayStr = dayCount < 10 ? "0" + dayCount : dayCount.toString();

        // 给当天日期添加高亮
        if (dayCount === currentDay) {
            weekStr += `§e${dayStr}`;
        } else {
            weekStr += dayStr;
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
        weekStr = "         §c";

        for (let i = 0; i < 7 && dayCount <= daysInMonth; i++) {
            const dayStr = dayCount < 10 ? "0" + dayCount : dayCount.toString();

            // 给当天日期添加高亮
            if (dayCount === currentDay) {
                weekStr += `§e${dayStr}`;
            } else if (dayCount % 7 === 0 || dayCount % 7 === 6) {
                // 周末使用不同颜色
                weekStr += `§a${dayStr}`;
            } else {
                weekStr += dayStr;
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

const GUI = {
    sign_in(player) {
        const SignForm = new ActionFormData();
        SignForm.title("§b每日签到");
        SignForm.body(generateCalendar() +
            "§6       今日签到奖励：" +
            "§b 金币：233\n"
        );
        SignForm.button("签到")
        SignForm.show(player).then((response) => {
            if (response.cancelationReason == "UserBusy") {
                GUI.sign_in(player);
            }
        })
    },

    welcome_form(player) {
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
