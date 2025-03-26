import { world,Scoreboard, system } from "@minecraft/server";
import { ActionFormData,ModalFormData } from "@minecraft/server-ui";
import { log } from "../API/logger.js";
import { Main } from "./main_menu.js";
import { cfg } from "../config.js";
import { GetTime } from "../API/game.js";


let n_coin = 200;


let money_list = {
    "NIANIANKNIA" : 1
}


let n_coin_data_temp = {

}

let n_coin_data = {
    "-8589934591": {
        "type": "定期存法",
        "status": "normal",
        "save_time": "10",
        "buy_coin_num": "3000000",
        "now_coin_num": "3000000",
        "insurance": false,
        "buy_time": 1742908511656,
        "change_log": []
    },
    "123456": {
        "type": "定期存法",
        "status": "normal",
        "save_time": "10",
        "buy_coin_num": "3000000",
        "now_coin_num": "3000000",
        "insurance": false,
        "buy_time": 1742908511656,
        "change_log": []
    },
}
export const BankGUI = {
    Main(player) {
        const MainForm = new ActionFormData()
        .title("NIA服务器人民银行")
        .body("腐竹提醒您：投资有风险，入市需谨慎")
        .button("返回上一页")
        .button("查看理财盈亏榜")
        .button("购买N币\n三小时起存，设定时间自动结算！")
        .button("查看当前N币\n查看当前N币结算情况")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0){
                Main(player);
                return;
            }
            if (response.selection == 1){
                this.Ranking(player);
                return;
            }
            if (response.selection == 2){
                //检查是否有N币数据

                if (n_coin_data.hasOwnProperty(player.id) &&
                    n_coin_data[player.id].hasOwnProperty("status") &&
                    n_coin_data[player.id].status != "complete") {
                    player.sendMessage(" §c您有未结算的N币数据，请先结算后再返回");
                    return;
                }
                this.BuyNCoinInfo(player);
                return;
            }
            if (response.selection == 3){
                this.CheckNCoin(player);
                return;
            }
        })
    },

    BuyNCoinInfo(player) {
        const BuyNCoinForm = new ActionFormData()
        .title("虚拟货币购买须知")
        .body("§e请在购买§c虚拟货币N币（以下简称“N币”）§e前仔细阅读以下条款：\n\n" +
            "1. N币是指由NIA服务器在我的世界BDS服务器中发行的一个虚拟货币，仅仅用于丰富游戏内容，与现实世界、货币等没有任何联系。"+
            "所有个人、团体禁止以此在现实世界中进行金钱交易，§c一旦发现服务器将永封游戏账号。§e\n\n"+
            "2. N币价格每天将在§c每晚12点更新§e，其价格将以基础价格§c200金币/个§e左右进行波动，最后仓库结算价格将按照§c当日N币价格§e进行计算，§c而非买入的N币价格§e\n\n"+
            "3. N币买入之后有两种存入方式：§c定期与活期§e；但是不论定期还是活期存法，§c都必须存入至少3h，§e活期可以在3h以后自由选定取出时间；"+
            "定期存入则要在存入时选定存入时间（三小时起存，不设上限），§c在达到设定的存入时间之前，无法取出§e，在达到设定的存入时间之后自动结算；"+
            "以上两种存法都会在发生§c\"爆仓\"§e事件之后自动结算，不再进行收益计算\n\n"+
            "4. N币§c活期存法§e将买入后§c每十二分钟§e进行一次结算，每次结算的公式为§cX*Y§e（其中X为当前§c持有的N币数量§e，Y为§c随机系数§e）；"+
            "其中§c前三小时§e，§cY§e将在区间§c[0.01,2.00]§e中随机分配取值；§c三小时过后Y§e将在区间§c[0.001,2.000+Z]§e (§cZ = ( 当前存入的小时总数向上取整后 - 3) / 2§e)范围之内进行取值，"+
            "且§c每过一整个小时§e，§cY§c取值§c0.8§e以上的概率将降低§c10%%§e，对应的§c0.8§e以下的概率将升高§c10%%§e\n\n"+
            "5. N币§c定期存法§e将买入后§c每十二分钟§e进行一次结算，每次结算的公式为§cX*Y§e（其中X为当前§c持有的N币数量§e，Y为§c随机系数§e）；"+
            "其中§c前三小时§e，§cY§e将在区间§c[0.01,2.00]§e中随机分配取值；§c三小时过后Y§e将在区间§c[0.001,2.000+Z]§e (§cZ = ( 当前存入的小时总数向上取整后 - 3)§e)范围之内进行取值，"+
            "且§c每过一整个小时§e，§cY§c取值§c1§e以上的概率将降低§c8%%§e，对应的§c1§e以下的概率将升高§c8%%§e\n\n"+
            "6. 在购买N币的同时可选购买§c\"美联储财产安心险\"§e，购买本保险以后将收取本次购买§cN币总数的5%%§e作为保费，"+
            "在发生§c\"爆仓\"§e事件之后，\"美联储财产安心险\"将为您赔付您§c购买N币原金币数的50%%金币§e作为财产保障\n\n"+
            "7. 以上所有内容§c均属虚构§e，具体解释权以§cNIA服务器人民银行为准"
        )
        .button("我已认真阅读并同意上述条款")
        .button("我不同意上述条款")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0){
                this.BuyNCoin(player);
                return;
            }
            if (response.selection == 1){
                this.Main(player);
                return;
            }

        })
    },

    BuyNCoin(player) {
        //计算可以购买的最大N币数量
        let can_buy_n_coin_num = Math.floor(world.scoreboard.getObjective(cfg.MoneyScoreboardName).getScore(player) / n_coin);
        const BuyNCoinForm = new ModalFormData()
        .title("N币购买")
        .divider()
        .dropdown("§6请选择购买N币的类型：",["定期存法","活期存法"])
        .divider()
        .toggle("§6购买美联储财产安心险", false)
        .divider()
        .label(`当前N币价格为：§e${n_coin}${cfg.MoneyShowName}§r每个\n您当前实际最多可以购买§e${can_buy_n_coin_num}§r个N币`)
        .textField(`§6请输入您要购买的N币数量：`,`N币数量要求为正整数`)
        .divider()
        .label("§c定期存法§r请输入存入的具体时间\n"+
            "§c活期存法§r§e可选§r输入保险时间，将在您设定的时间到达之后§c自动结算§r，在此之前您可以随意取出\n"+
            "§c注意§r最少存入/保险时间为§c3小时§r\n" +
            "§c不建议存入时间大于八小时以免发生爆仓事件")
        .textField("§6请输入存入/保险时间(单位：小时)：","时间要求为正整数")
        .divider()
        .submitButton("确认购买信息")
        .show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage(" §c本次N币购买进程已取消");
                return;
            }
            //开始数据合理性检查
            if (response.formValues[2] == "") {
                player.sendMessage(" §c您没有输入要购买的N币数量");
                system.runTimeout(() => {this.BuyNCoin(player)},25)
                return;
            }
            if (isNaN(response.formValues[2]) || response.formValues[2] <=0 || !Number.isInteger(Number(response.formValues[2]))) {
                player.sendMessage(" §c您输入的N币数量格式不是正整数");
                system.runTimeout(() => {this.BuyNCoin(player)},25)
                return;
            }
            if (response.formValues[2] > can_buy_n_coin_num) {
                player.sendMessage(" §c您购买的N币数量超过了您实际可以购买的最大数量");
                system.runTimeout(() => {this.BuyNCoin(player)},25)
                return;
            }
            if (response.formValues[0] == 0) {
                if (response.formValues[3] == "" && response.formValues[0] == 0) {
                    player.sendMessage(" §c您没有输入存入时间");
                    system.runTimeout(() => {this.BuyNCoin(player)},25)
                    return;
                }
                if (isNaN(response.formValues[3]) || response.formValues[3] <=0) {
                    player.sendMessage(" §c您输入的存入时间格式不是正数");
                    system.runTimeout(() => {this.BuyNCoin(player)},25)
                    return;
                }
                if (response.formValues[3] < 3) {
                    player.sendMessage(" §c您输入的存入时间小于3h");
                    system.runTimeout(() => {this.BuyNCoin(player)},25)
                    return;
                }
            }
            if (response.formValues[0] == 1) {
                if (response.formValues[3] == "") {
                    response.formValues[3] = -1;
                    return;
                };
                if (isNaN(response.formValues[3]) || response.formValues[3] <=0) {
                    player.sendMessage(" §c您输入的保险时间格式不是正数");
                    system.runTimeout(() => {this.BuyNCoin(player)},25)
                    return;
                }
                if (response.formValues[3] < 3) {
                    player.sendMessage(" §c您输入的保险时间小于3h");
                    system.runTimeout(() => {this.BuyNCoin(player)},25)
                    return;
                }
            }

            this.BuyNCoinConfirm(player, response.formValues[2], response.formValues[0] == 0 ? "定期存法" : "活期存法", response.formValues[3], response.formValues[1]);
        })
    },

    //购买信息确认表单
    BuyNCoinConfirm(player, n_coin_num, type, time, insurance) {
        const BuyNCoinForm = new ActionFormData()
        .title("N币购买信息确认")
        .body(`\n§r您本次购买的N币数量为：§e${n_coin_num}§r个\n\n本次购买的存入方式为：§e${type}§r\n\n本次购买的存入/保险时间为：§e${time}§r小时\n\n本次购买是否购买美联储财产安心险：§e${insurance?"是":"否"}§r\n`)
        .button("确认购买")
        .button("取消购买")
        .show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage(" §c本次N币购买进程已取消");
                return;
            }
            if (response.selection == 0) {
                //扣除金币
                world.scoreboard.getObjective(cfg.MoneyScoreboardName).addScore(player, -n_coin_num * n_coin);
                //建立N币数据
                n_coin_data[player.id] = {
                    "player_name": player.name,
                    "type": type,
                    "status": "normal",
                    "save_time": time,
                    "buy_coin_num": n_coin_num,
                    "now_coin_num": n_coin_num,
                    "insurance": insurance,
                    "buy_time": Date.now(),
                    "change_log" : []
                }
                log(JSON.stringify(n_coin_data));
                player.sendMessage(` §e您已成功购买§c${n_coin_num}§e个N币，存入方式为§c${type}§e，存入时间为§c${time}§e小时，是否购买美联储财产安心险：§c${insurance?"是":"否"}`);
            }
        })
    },

    CheckNCoin(player) {
        //获取N币数据
        let player_n_coin_data = n_coin_data[player.id];
        //获取当前时间
        let now_time = Date.now();
        //获取当时购买时间
        let buy_time = player_n_coin_data.buy_time;
        //获取存入时间（小时）
        let save_time = player_n_coin_data.save_time;
        //计算存入的总时间（小时）
        let total_time = (now_time - buy_time) / 3600000;

        if (player_n_coin_data == undefined) {
            player.sendMessage(" §c您当前没有在进行结算的N币，请先购买N币后再来查看");
            system.runTimeout(() => {this.Main(player)},25);
            return;
        }

        //计算剩余结算次数
        let total_count = 0;
        //save_time为-1表示活期存法且不设定保险时间
        if (total_time < save_time || save_time == -1) {
            total_count = Math.floor(total_time / 0.2);
        } else {
            total_count = Math.floor(save_time / 0.2);
            player_n_coin_data.status = "finsh";
        }
        //读取变动记录，看看已经结算了多少次，然后进行剩余次数的结算
        total_count = total_count - player_n_coin_data.change_log.length;
        //开始三个小时内的结算
        let count_3h = 0;
        let random_num = 0;
        if (player_n_coin_data.change_log.length <= 15) {
            count_3h = 15 - player_n_coin_data.change_log.length;
            if (count_3h > total_count) count_3h = total_count;
            for (let i = 0; i < count_3h; i++) {
                if (player_n_coin_data.status == "break") break;
                random_num = Math.random() * 1.999 + 0.001;
                log(`当前随机数为${random_num}`);
                player_n_coin_data.change_log.push({
                    "before_coin_num": player_n_coin_data.now_coin_num,
                    "after_coin_num": player_n_coin_data.now_coin_num * random_num});
                player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
                if (random_num < 0.05) player_n_coin_data.status = "break";
            }
        }
        //剩余次数的结算（三个小时后的）
        total_count = total_count - count_3h;
        for (let i = 0; i < total_count; i++) {
            if (player_n_coin_data.status == "break") break;
            // let Z = Math.ceil((now_time - buy_time) / 3600000 - 3);
            let Z = Math.ceil(i / 4);
            if (player_n_coin_data.type == "活期存法") Z = Z / 2;
            if (Z == 0) Z = 1;
            log(`Z值为${Z}`);
            //计算Y值
            //计算各区间的概率调整
            //基础概率是50%(0.5)对半分
            //每过一小时，[0,1]区间概率增加8%，[1,2+Z]区间相应减少
            let base_rate = 0.5;

            //计算经过整数小时的概率调整
            let hour = Math.floor(i * 0.2);
            if (hour > 0) {
                if (player_n_coin_data.type == "活期存法") base_rate = Math.min(1,base_rate + 0.1 * (hour));
                if (player_n_coin_data.type == "定期存法") base_rate = Math.min(1,base_rate + 0.08 * (hour));
            }
            log(`当前概率为${base_rate}`);
            //根据调整后的概率计算Y值
            if (Math.random() < base_rate) {
                //在 [0.001, 0.8] 区间内随机取值
                if (player_n_coin_data.type == "活期存法") random_num = Math.random() * 0.799 + 0.001;
                //在 [0.001, 1] 区间内随机取值
                if (player_n_coin_data.type == "定期存法") random_num = Math.random() * 0.999 + 0.001;
                log(`高：当前随机数为${random_num}`);
                player_n_coin_data.change_log.push({
                    "before_coin_num": player_n_coin_data.now_coin_num,
                    "after_coin_num": player_n_coin_data.now_coin_num * random_num});
                player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
            } else {
                //在[0.8, 2+Z] 区间内随机取值
                if (player_n_coin_data.type == "活期存法") random_num = Math.random() * (1 + Z) + 0.8;
                //在 [1, 2+Z] 区间内随机取值
                if (player_n_coin_data.type == "定期存法") random_num = Math.random() * (1 + Z) + 1;
                log(`低：当前随机数为${random_num}`);
                player_n_coin_data.change_log.push({
                    "before_coin_num": player_n_coin_data.now_coin_num,
                    "after_coin_num": player_n_coin_data.now_coin_num * random_num});
                player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
            }
            if (random_num < 0.05) player_n_coin_data.status = "break";
        }

        //将n币数据写入
        n_coin_data[player.id] = player_n_coin_data;

        // if (player_n_coin_data.status == "normal" && player_n_coin_data.type == "定期存法") {
        //     //定期存法，且还没有全部结算
        //     let total_count = 0;
        //     //计算剩余结算次数
        //     if (total_time < save_time) {
        //         total_count = Math.floor(total_time / 0.2);
        //     } else {
        //         total_count = Math.floor(save_time / 0.2);
        //         player_n_coin_data.status = "finsh";
        //     }
        //     //读取变动记录，看看已经结算了多少次，然后进行剩余次数的结算
        //     total_count = total_count - player_n_coin_data.change_log.length;
        //     //开始三个小时内的结算
        //     let count_3h = 0;
        //     let random_num = 0;
        //     if (player_n_coin_data.change_log.length <= 15) {
        //         count_3h = 15 - player_n_coin_data.change_log.length;
        //         if (count_3h > total_count) count_3h = total_count;
        //         for (let i = 0; i < count_3h; i++) {
        //             if (player_n_coin_data.status == "break") break;
        //             random_num = Math.random() * 1.99 + 0.01;
        //             log(`当前随机数为${random_num}`);
        //             player_n_coin_data.change_log.push({
        //                 "before_coin_num": player_n_coin_data.now_coin_num,
        //                 "after_coin_num": player_n_coin_data.now_coin_num * random_num});
        //             player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
        //             if (random_num < 0.05) player_n_coin_data.status = "break";
        //         }
        //     }
        //     //剩余次数的结算（三个小时后的）
        //     total_count = total_count - count_3h;
        //     for (let i = 0; i < total_count; i++) {
        //         if (player_n_coin_data.status == "break") break;
        //         let Z = Math.ceil((now_time - buy_time) / 3600000 - 3);
        //         log(`Z值为${Z}`);
        //         //计算Y值
        //         //计算各区间的概率调整
        //         //基础概率是50%(0.5)对半分
        //         //每过一小时，[0,1]区间概率增加8%，[1,2+Z]区间相应减少
        //         let base_rate = 0.5;

        //         //计算经过整数小时的概率调整
        //         let hour = Math.floor((now_time - buy_time) / 3600000) ;
        //         if (hour - 3 > 0) {
        //             base_rate = Math.min(1,base_rate + 0.08 * (hour - 3));
        //         }
        //         log(`当前概率为${base_rate}`);
        //         //根据调整后的概率计算Y值
        //         if (Math.random() < base_rate) {
        //             //在 [0.001, 1] 区间内随机取值
        //             random_num = Math.random() * 0.999 + 0.001;
        //             log(`高：当前随机数为${random_num}`);
        //             player_n_coin_data.change_log.push({
        //                 "before_coin_num": player_n_coin_data.now_coin_num,
        //                 "after_coin_num": player_n_coin_data.now_coin_num * random_num});
        //             player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
        //         } else {
        //             //在 [1, 2+Z] 区间内随机取值
        //             random_num = Math.random() * (1 + Z) + 1;
        //             log(`低：当前随机数为${random_num}`);
        //             player_n_coin_data.change_log.push({
        //                 "before_coin_num": player_n_coin_data.now_coin_num,
        //                 "after_coin_num": player_n_coin_data.now_coin_num * random_num});
        //             player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
        //         }
        //         if (random_num < 0.05) player_n_coin_data.status = "break";
        //     }

        //     //将n币数据写入
        //     n_coin_data[player.id] = player_n_coin_data;

        //     //开始进行表单展示


        // } else if (player_n_coin_data.status == "normal" && player_n_coin_data.type == "活期存法") {

        // }
        log(player_n_coin_data.status);
        //表单展示
        let form_body_str = "";
        switch (player_n_coin_data.status) {
            case "normal":
                form_body_str = `§6您当前的N币数据如下：\n\n` +
                `§e当前持有状态：§c正常\n` +
                `§e买入初始数量：§c${player_n_coin_data.buy_coin_num}\n` +
                `§e当前持有类型：§c${player_n_coin_data.type}\n` +
                `§e当前持有数量：§c${player_n_coin_data.now_coin_num}\n` +
                `§e当前持有时间：§c${total_time.toFixed(2)}h\n`
                for (let i = 0; i < player_n_coin_data.change_log.length; i++) {
                    form_body_str += `§e第§c${i+1}§e次结算后数量：\n` +
                    `§c${player_n_coin_data.change_log[i].after_coin_num}\n`;
                }
                break;
            case "complete":
                break;
            case "finish":
            case "break":
                form_body_str = `§6您当前的N币数据如下：\n\n` +
                `§e当前持有状态：§c爆仓\n` +
                `§e买入初始数量：§c${player_n_coin_data.buy_coin_num}\n` +
                `§e当前持有类型：§c${player_n_coin_data.type}\n` +
                `§e当前持有数量：§c${player_n_coin_data.now_coin_num}\n` +
                `§e当前持有时间：§c${total_time.toFixed(2)}h\n`
                for (let i = 0; i < player_n_coin_data.change_log.length; i++) {
                    form_body_str += `§e第§c${i+1}§e次结算后数量：\n` +
                    `§c${player_n_coin_data.change_log[i].after_coin_num}\n`;
                }
                break;
            
        }
        const CheckNCoinForm = new ActionFormData()
        .title("N币详情界面")
        .body(form_body_str)
        .button("返回上一页")
        .show(player)

    }
}

let count = 0;
let average = 0;

system.runInterval(() => {
    //遍历所有N币数据
    //获取N币数据
    let player_n_coin_data = n_coin_data["123456"];
    //获取当前时间
    let now_time = Date.now();
    //获取当时购买时间
    let buy_time = player_n_coin_data.buy_time;
    //获取存入时间（小时）
    let save_time = player_n_coin_data.save_time;
    //计算存入的总时间（小时）
    // let total_time = (now_time - buy_time) / 3600000;
    let total_time = 24;

    if (player_n_coin_data == undefined) {
        player.sendMessage(" §c您当前没有在进行结算的N币，请先购买N币后再来查看");
        system.runTimeout(() => {this.Main(player)},25);
        return;
    }

    //player_n_coin_data.now_coin_num = 3000000 * 0.95;

    //计算剩余结算次数
    let total_count = 0;
    //save_time为-1表示活期存法且不设定保险时间
    if (total_time < save_time || save_time == -1) {
        total_count = Math.floor(total_time / 0.2);
    } else {
        total_count = Math.floor(save_time / 0.2);
        player_n_coin_data.status = "finsh";
    }
    //读取变动记录，看看已经结算了多少次，然后进行剩余次数的结算
    total_count = total_count - player_n_coin_data.change_log.length;
    //开始三个小时内的结算
    let count_3h = 0;
    let random_num = 0;
    if (player_n_coin_data.change_log.length <= 15) {
        count_3h = 15 - player_n_coin_data.change_log.length;
        if (count_3h > total_count) count_3h = total_count;
        for (let i = 0; i < count_3h; i++) {
            if (player_n_coin_data.status == "break") break;
            random_num = Math.random() * 0.4  + 0.8;
            // log(`当前随机数为${random_num}`);
            player_n_coin_data.change_log.push({
                "before_coin_num": player_n_coin_data.now_coin_num,
                "after_coin_num": player_n_coin_data.now_coin_num * random_num});
            player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
            if (random_num < 0.85) player_n_coin_data.status = "break";
        }
    }
    //剩余次数的结算（三个小时后的）
    total_count = total_count - count_3h;
    for (let i = 0; i < total_count; i++) {
        if (player_n_coin_data.status == "break") break;
        // let Z = Math.ceil((now_time - buy_time) / 3600000 - 3);
        let Z = Math.ceil(i / 4);
        if (player_n_coin_data.type == "活期存法") Z = Z / 2;
        if (Z == 0) Z = 1;
        // log(`Z值为${Z}`);
        //计算Y值
        //计算各区间的概率调整
        //基础概率是50%(0.5)对半分
        //每过一小时，[0,1]区间概率增加8%，[1,2+Z]区间相应减少
        let base_rate = 0.5;

        //计算经过整数小时的概率调整
        let hour = Math.floor(i * 0.2);
        if (hour > 0) {
            if (player_n_coin_data.type == "活期存法") base_rate = Math.min(1,base_rate * 2 * (hour));
            if (player_n_coin_data.type == "定期存法") base_rate = Math.min(1,base_rate + 0.08 * (hour));
        }
        // log(`当前概率为${base_rate}`);
        //根据调整后的概率计算Y值
        if (Math.random() < base_rate) {
            //在 [0.001, 0.8] 区间内随机取值
            if (player_n_coin_data.type == "活期存法") random_num = Math.random() * 0.8;
            //在 [0.001, 0.8] 区间内随机取值
            if (player_n_coin_data.type == "定期存法") random_num = Math.random() * 0.9;
            // log(`高：当前随机数为${random_num}`);
            player_n_coin_data.change_log.push({
                "before_coin_num": player_n_coin_data.now_coin_num,
                "after_coin_num": player_n_coin_data.now_coin_num * random_num});
            player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
        } else {
            //在[0.8, 2+Z] 区间内随机取值
            if (player_n_coin_data.type == "活期存法") random_num = Math.random() * (1 + Z) + 0.8;
            //在 [0.9, 0.9+Z] 区间内随机取值
            if (player_n_coin_data.type == "定期存法") random_num = Math.random() * Z + 0.9;
            // log(`低：当前随机数为${random_num}`);
            player_n_coin_data.change_log.push({
                "before_coin_num": player_n_coin_data.now_coin_num,
                "after_coin_num": player_n_coin_data.now_coin_num * random_num});
            player_n_coin_data.now_coin_num = player_n_coin_data.now_coin_num * random_num;
        }
        if (random_num < 0.05) player_n_coin_data.status = "break";
    }

    // if (player_n_coin_data.status == "normal") {
    //     log(`正常\n` + player_n_coin_data.now_coin_num);
    // } else if (player_n_coin_data.status == "break") {
    //     log(`爆仓\n` + player_n_coin_data.now_coin_num);
    // }
    // if (player_n_coin_data.now_coin_num < 3000000 * 0.5) {
    //     player_n_coin_data.now_coin_num = 1500000;
    // }
    //计算平均值
    count++;
    average = average * (count - 1) / count + player_n_coin_data.now_coin_num / count;
    log(`[无保险|5h]共模拟${count}次，当前平均值为${average.toFixed(2)}，比率为${(average / 3000000).toFixed(2)} || ${(player_n_coin_data.now_coin_num / 3000000).toFixed(2)}`);
    n_coin_data = {
        "123456": {
            "type": "定期存法",
            "status": "normal",
            "save_time": "10",
            "buy_coin_num": "3000000",
            "now_coin_num": "3000000",
            "insurance": false,
            "buy_time": 1742908511656,
            "change_log": []
        },
    }
},1)

world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick") {
        n_coin_data = {
            "-8589934591": {
                "type": "定期存法",
                "status": "normal",
                "save_time": "10",
                "buy_coin_num": "3000000",
                "now_coin_num": "3000000",
                "insurance": false,
                "buy_time": 1742908511656,
                "change_log": []
            },
            "123456": {
                "type": "定期存法",
                "status": "normal",
                "save_time": "10",
                "buy_coin_num": "3000000",
                "now_coin_num": "3000000",
                "insurance": false,
                "buy_time": 1742908511656,
                "change_log": []
            },
        }
        BankGUI.CheckNCoin(event.source);
    }
})