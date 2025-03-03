import { world,Scoreboard } from "@minecraft/server";
import { ActionFormData,ModalFormData } from "@minecraft/server-ui";
import { log } from "../API/logger.js";
import { Main } from "./main_menu.js";


const GUI = {
    Main(player) {
        const MainForm = new ActionFormData()
        .title("NIA服务器人民银行")
        .body("腐竹提醒您：投资有风险，入市需谨慎")
        .button("返回上一页")
        .button("购买虚拟货币N币\n三小时起存，设定时间自动结算！")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0){
                Main(player);
                return;
            }
            if (response.selection == 1){
                this.BuyNCoinInfo(player);
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
    }
}

// world.afterEvents.itemUse.subscribe(event => {
//     if (event.itemStack.typeId == "minecraft:stick") {
//         GUI.Main(event.source);
//     }
// })